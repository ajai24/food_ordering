import { customerApi, setAuthUser } from './client.js';

export const register = async (payload) => {
  const { data } = await customerApi.post('/auth/register', payload);
  setAuthUser(data.user);
  return data.user;
};

export const login = async (payload) => {
  const { data } = await customerApi.post('/auth/login', payload);
  setAuthUser(data.user);
  return data.user;
};

export const logout = () => {
  setAuthUser(null);
};
