import { customerApi } from './client.js';

export const listOrders = async (userId) => {
  const { data } = await customerApi.get('/orders', { params: { userId } });
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await customerApi.post('/orders', payload);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await customerApi.patch(`/orders/${orderId}/status`, { status });
  return data;
};
