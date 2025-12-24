import { customerApi } from './client.js';

export const fetchProfile = async (userId) => {
  const { data } = await customerApi.get('/users/me', { params: { userId } });
  return data;
};

export const saveProfile = async (userId, payload) => {
  const { data } = await customerApi.put('/users/me', { userId, ...payload });
  return data;
};

export const addAddress = async (userId, address) => {
  const { data } = await customerApi.post('/users/me/addresses', { userId, ...address });
  return data;
};
