import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      default: () => 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY']
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'digital_wallet', 'bank_transfer', 'crypto'],
        required: true
      },
      provider: {
        type: String,
        enum: ['stripe', 'paypal', 'square', 'apple_pay', 'google_pay', 'crypto_gateway'],
        required: true
      },
      lastFour: String,
      brand: String,
      walletId: String,
      cryptoAddress: String
    },
    processing: {
      status: {
        type: String,
        enum: ['initiated', 'processing', 'authorized', 'captured', 'settled', 'failed', 'refunded', 'cancelled'],
        default: 'initiated'
      },
      gatewayResponse: {
        transactionId: String,
        approvalCode: String,
        responseCode: String,
        responseMessage: String,
        avsResult: String,
        cvvResult: String
      },
      fees: {
        processing: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      timestamps: {
        initiated: { type: Date, default: Date.now },
        processed: Date,
        settled: Date,
        refunded: Date
      }
    },
    security: {
      ipAddress: String,
      deviceFingerprint: String,
      riskScore: { type: Number, min: 0, max: 100, default: 0 },
      fraudFlags: [String]
    },
    metadata: {
      source: { type: String, enum: ['web', 'mobile', 'api', 'pos'], default: 'web' },
      userAgent: String,
      sessionId: String,
      notes: String
    }
  },
  { timestamps: true }
);

paymentSchema.index({ customerId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ 'processing.status': 1 });
paymentSchema.index({ transactionReference: 1 }, { unique: true });

paymentSchema.methods.calculateTotalFees = function() {
  return this.processing.fees.processing + this.processing.fees.service;
};

paymentSchema.methods.isCompleted = function() {
  return ['captured', 'settled'].includes(this.processing.status);
};

paymentSchema.methods.canBeRefunded = function() {
  return this.isCompleted() && !['refunded', 'cancelled'].includes(this.processing.status);
};

export const Payment = mongoose.model('Payment', paymentSchema);
