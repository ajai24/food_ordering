import { partnerApi } from './client.js';

export const listRestaurants = async () => {
  const { data } = await partnerApi.get('/restaurants');
  return data;
};

export const getRestaurant = async (id) => {
  const { data } = await partnerApi.get(`/restaurants/${id}`);
  return data;
};

export const createRestaurant = async (payload) => {
  const { data } = await partnerApi.post('/restaurants', payload);
  return data;
};

export const updateRestaurantMenu = async (id, menu) => {
  const { data } = await partnerApi.put(`/restaurants/${id}/menu`, { menu });
  return data;
};
