import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gaula-korner.onrender.com/api',
});

// ✅ Products API
export const productsApi = {
  getAll: () => api.get('/products'),
};

// ✅ Address API
export const addressApi = {
  search: (input: any) => api.get('/address/autocomplete', { params: { input } }),
};

// ✅ Payment API
export const paymentApi = {
  createIntent: (amount: any, address: any) => {
    return api.post('/payment/create-payment-intent', { amount, address });
  },
};

// ✅ Interceptor – fallback for auth and address only
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.warn("Backend unavailable, using mock fallback!");

      const url = error.config.url;
      const data = error.config.data ? JSON.parse(error.config.data) : {};
      const params = error.config.params || {};

      // Mock register fallback
      if (url.includes('/auth/register')) {
        return Promise.resolve({
          data: {
            token: 'mock-jwt-token',
            user: { id: 'mock-id', name: data.name, email: data.email },
          },
        });
      }

      // Mock login fallback
      if (url.includes('/auth/login')) {
        return Promise.resolve({
          data: {
            token: 'mock-jwt-token',
            user: { id: 'mock-id', name: 'Mock User', email: data.email },
          },
        });
      }

      // Mock address fallback
      if (url.includes('/address/autocomplete')) {
        const input = params.input || '';

        const mockPredictions = [
          {
            place_id: 'mock_1',
            description: `${input} Street, Pretoria, South Africa`,
            structured_formatting: {
              main_text: `${input} Street`,
              secondary_text: 'Pretoria, South Africa',
            },
            lat: '-25.7479',
            lon: '28.2293',
          },
          {
            place_id: 'mock_2',
            description: `${input} Avenue, Johannesburg, South Africa`,
            structured_formatting: {
              main_text: `${input} Avenue`,
              secondary_text: 'Johannesburg, South Africa',
            },
            lat: '-26.2041',
            lon: '28.0473',
          },
        ];

        return Promise.resolve({
          data: { predictions: input.length >= 3 ? mockPredictions : [] },
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
