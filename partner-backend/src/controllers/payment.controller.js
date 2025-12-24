import { Payment } from '../models/Payment.js';
import { v4 as uuidv4 } from 'uuid';

const calculateRiskScore = (paymentData) => {
  let riskScore = 0;
  
  if (paymentData.amount > 1000) riskScore += 20;
  if (paymentData.paymentDetails.method === 'crypto') riskScore += 30;
  if (!paymentData.security.ipAddress) riskScore += 10;
  
  return Math.min(riskScore, 100);
};

const generateTransactionId = () => {
  return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const calculateProcessingFees = (amount, method) => {
  const feeStructure = {
    credit_card: { percentage: 0.029, fixed: 0.30 },
    debit_card: { percentage: 0.022, fixed: 0.25 },
    digital_wallet: { percentage: 0.025, fixed: 0.20 },
    bank_transfer: { percentage: 0.005, fixed: 0.50 },
    crypto: { percentage: 0.015, fixed: 0.10 }
  };
  
  const fees = feeStructure[method] || feeStructure.digital_wallet;
  const processingFee = (amount * fees.percentage) + fees.fixed;
  const serviceFee = amount * 0.003;
  
  return {
    processing: Math.round(processingFee * 100) / 100,
    service: Math.round(serviceFee * 100) / 100,
    total: Math.round((processingFee + serviceFee) * 100) / 100
  };
};

export const initiatePayment = async (req, res) => {
  const requestId = uuidv4();
  console.log(`[${requestId}] Payment initiation started`);

  try {
    const { 
      customerId, 
      orderId, 
      amount, 
      currency = 'USD',
      paymentDetails,
      security = {},
      metadata = {}
    } = req.body;

    if (!customerId || !orderId || !amount || !paymentDetails?.method || !paymentDetails?.provider) {
      console.log(`[${requestId}] Missing required payment fields`);
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information',
        error: 'MISSING_FIELDS',
        required: ['customerId', 'orderId', 'amount', 'paymentDetails.method', 'paymentDetails.provider']
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero',
        error: 'INVALID_AMOUNT'
      });
    }

    const existingPayment = await Payment.findOne({ 
      orderId, 
      'processing.status': { $in: ['initiated', 'processing', 'authorized'] }
    });

    if (existingPayment) {
      console.log(`[${requestId}] Active payment already exists for order: ${orderId}`);
      return res.status(409).json({
        success: false,
        message: 'A payment is already being processed for this order',
        error: 'PAYMENT_EXISTS',
        transactionReference: existingPayment.transactionReference
      });
    }

    const fees = calculateProcessingFees(amount, paymentDetails.method);
    const riskScore = calculateRiskScore({ amount, paymentDetails, security });

    const paymentData = {
      customerId,
      orderId,
      amount,
      currency,
      paymentDetails: {
        ...paymentDetails,
        lastFour: paymentDetails.lastFour || '****',
        brand: paymentDetails.brand || 'unknown'
      },
      processing: {
        status: 'initiated',
        fees,
        timestamps: {
          initiated: new Date()
        }
      },
      security: {
        ipAddress: req.ip || security.ipAddress,
        deviceFingerprint: security.deviceFingerprint,
        riskScore,
        fraudFlags: riskScore > 50 ? ['HIGH_RISK_AMOUNT'] : []
      },
      metadata: {
        source: metadata.source || 'web',
        userAgent: req.get('User-Agent'),
        sessionId: metadata.sessionId || uuidv4(),
        notes: metadata.notes
      }
    };

    const payment = await Payment.create(paymentData);

    console.log(`[${requestId}] Payment initiated: ${payment.transactionReference}`);

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        transactionReference: payment.transactionReference,
        status: payment.processing.status,
        amount: payment.amount,
        currency: payment.currency,
        fees: payment.processing.fees,
        riskScore: payment.security.riskScore,
        createdAt: payment.createdAt
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Payment initiation failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: 'PAYMENT_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const processPayment = async (req, res) => {
  const requestId = uuidv4();
  console.log(`[${requestId}] Payment processing started`);

  try {
    const { transactionReference } = req.params;
    const { gatewayResponse } = req.body;

    const payment = await Payment.findOne({ transactionReference });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment transaction not found',
        error: 'PAYMENT_NOT_FOUND'
      });
    }

    if (payment.processing.status !== 'initiated') {
      return res.status(400).json({
        success: false,
        message: `Payment cannot be processed in current status: ${payment.processing.status}`,
        error: 'INVALID_STATUS'
      });
    }

    const mockGatewayResponse = gatewayResponse || {
      transactionId: 'GW-' + Date.now(),
      approvalCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      responseCode: '00',
      responseMessage: 'Approved',
      avsResult: 'Y',
      cvvResult: 'M'
    };

    payment.processing.status = 'processing';
    payment.processing.gatewayResponse = mockGatewayResponse;
    payment.processing.timestamps.processed = new Date();

    await payment.save();

    setTimeout(async () => {
      try {
        payment.processing.status = Math.random() > 0.1 ? 'captured' : 'failed';
        payment.processing.timestamps.settled = new Date();
        
        if (payment.processing.status === 'failed') {
          payment.processing.gatewayResponse.responseCode = '05';
          payment.processing.gatewayResponse.responseMessage = 'Declined';
        }
        
        await payment.save();
        console.log(`[${requestId}] Payment ${payment.processing.status}: ${transactionReference}`);
      } catch (error) {
        console.error(`[${requestId}] Payment settlement failed:`, error);
      }
    }, 2000);

    console.log(`[${requestId}] Payment processing: ${transactionReference}`);

    res.json({
      success: true,
      message: 'Payment is being processed',
      data: {
        transactionReference: payment.transactionReference,
        status: payment.processing.status,
        gatewayTransactionId: payment.processing.gatewayResponse.transactionId,
        estimatedCompletion: new Date(Date.now() + 3000)
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Payment processing failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: 'PROCESSING_ERROR'
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  const requestId = uuidv4();
  
  try {
    const { transactionReference } = req.params;

    const payment = await Payment.findOne({ transactionReference })
      .populate('customerId', 'username email')
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment transaction not found',
        error: 'PAYMENT_NOT_FOUND'
      });
    }

    const response = {
      success: true,
      data: {
        transactionReference: payment.transactionReference,
        status: payment.processing.status,
        amount: payment.amount,
        currency: payment.currency,
        fees: payment.processing.fees,
        riskScore: payment.security.riskScore,
        createdAt: payment.createdAt,
        processedAt: payment.processing.timestamps.processed,
        settledAt: payment.processing.timestamps.settled,
        customer: {
          id: payment.customerId?._id,
          username: payment.customerId?.username,
          email: payment.customerId?.email
        },
        canBeRefunded: payment.canBeRefunded ? payment.canBeRefunded() : false
      }
    };

    if (payment.processing.gatewayResponse.transactionId) {
      response.data.gatewayTransactionId = payment.processing.gatewayResponse.transactionId;
    }

    res.json(response);

  } catch (error) {
    console.error(`[${requestId}] Payment status check failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve payment status',
      error: 'STATUS_CHECK_ERROR'
    });
  }
};

export const refundPayment = async (req, res) => {
  const requestId = uuidv4();
  
  try {
    const { transactionReference } = req.params;
    const { reason, amount } = req.body;

    const payment = await Payment.findOne({ transactionReference });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment transaction not found',
        error: 'PAYMENT_NOT_FOUND'
      });
    }

    if (!payment.isCompleted()) {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded',
        error: 'INVALID_STATUS'
      });
    }

    if (payment.processing.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been refunded',
        error: 'ALREADY_REFUNDED'
      });
    }

    payment.processing.status = 'refunded';
    payment.processing.timestamps.refunded = new Date();
    payment.metadata.notes = reason || 'Customer requested refund';

    await payment.save();

    console.log(`[${requestId}] Payment refunded: ${transactionReference}`);

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        transactionReference: payment.transactionReference,
        refundedAmount: amount || payment.amount,
        refundedAt: payment.processing.timestamps.refunded
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Refund failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: 'REFUND_ERROR'
    });
  }
};
