import axios from 'axios';

const normalizeBase = (value) => {
  if (!value) {
    return '';
  }
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

const customerRoot = normalizeBase(import.meta.env.VITE_CUSTOMER_API || 'http://localhost:4000');
const partnerRoot = normalizeBase(import.meta.env.VITE_PARTNER_API || 'http://localhost:4100');

const customerApiBase = `${customerRoot}/api/v1`;
const partnerApiBase = `${partnerRoot}/api/v1`;

export const customerApi = axios.create({
  baseURL: customerApiBase,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const partnerApi = axios.create({
  baseURL: partnerApiBase,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthUser = (user) => {
  if (user) {
    localStorage.setItem('fo-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('fo-user');
  }
};

export const getAuthUser = () => {
  const raw = localStorage.getItem('fo-user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse stored user', error);
    return null;
  }
};
