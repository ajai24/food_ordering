import axios from 'axios';
import { Order } from '../models/Order.js';

const PAYMENT_FALLBACK_MESSAGE = 'Payment processing failed.';

const getPartnerServiceUrl = () => {
  const baseUrl = process.env.PARTNER_SERVICE_URL;

  if (!baseUrl) {
    throw new Error('PARTNER_SERVICE_URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
};

export const listOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).lean();
    res.json(orders);
  } catch (error) {
    console.error('Listing orders failed', error);
    res.status(500).json({ message: 'Unable to list orders.' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, totalAmount, paymentMethod } = req.body;

    if (!userId || !restaurantId || !Array.isArray(items) || !items.length || !totalAmount) {
      return res.status(400).json({ message: 'Missing required order details.' });
    }

    const partnerUrl = getPartnerServiceUrl();

    const paymentResponse = await axios.post(`${partnerUrl}/api/v1/payments`, {
      userId,
      amount: totalAmount,
      method: paymentMethod
    });

    const order = await Order.create({
      userId,
      restaurantId,
      items,
      totalAmount,
      status: 'confirmed',
      paymentId: paymentResponse.data.paymentId
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Creating order failed', error.response?.data || error.message);
    res.status(500).json({ message: PAYMENT_FALLBACK_MESSAGE });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'preparing', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Updating order status failed', error);
    res.status(500).json({ message: 'Unable to update order status.' });
  }
};
