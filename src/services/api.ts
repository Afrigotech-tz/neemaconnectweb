import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiUrl';

const API_KEY = import.meta.env.VITE_API_KEY || 'mh8bUvdGP2xD9P4J3BZPYvr6noPBwEwZ';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    // Do not set a default Content-Type here.  When uploading files we
    // rely on axios automatically adding the correct
    // "multipart/form-data; boundary=..." header.  A static
    // application/json header would override that and turn all requests to
    // JSON, which causes 422 errors from endpoints expecting form data.
    'Accept': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests and clean up headers for form-data
api.interceptors.request.use((config) => {
  const headers = config.headers as Record<string, string | undefined> | undefined;
  const skipAuth = headers?.['X-Skip-Auth'] === 'true' || headers?.['x-skip-auth'] === 'true';
  (config as { __skipAuth?: boolean }).__skipAuth = skipAuth;
  (config as { __hadAuthToken?: boolean }).__hadAuthToken = false;

  if (skipAuth && headers) {
    delete headers['X-Skip-Auth'];
    delete headers['x-skip-auth'];
  } else {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      (config as { __hadAuthToken?: boolean }).__hadAuthToken = true;
    }
  }
  // If we're sending a FormData payload, let axios set the
  // multipart boundary automatically by removing any existing
  // Content-Type header.  A leftover application/json header will
  // cause the body to be sent as JSON instead.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicRequest = Boolean((error.config as { __skipAuth?: boolean } | undefined)?.__skipAuth);
    const hadAuthToken = Boolean((error.config as { __hadAuthToken?: boolean } | undefined)?.__hadAuthToken);
    const authErrorMessage = String(error.response?.data?.message || '').toLowerCase();
    const isLikelyExpiredAuth =
      authErrorMessage.includes('unauthenticated') ||
      authErrorMessage.includes('token') ||
      authErrorMessage.includes('expired');

    if (error.response?.status === 401 && !isPublicRequest && hadAuthToken && isLikelyExpiredAuth) {
      // Token expired or invalid - trigger logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('verification_data');
      window.dispatchEvent(
        new CustomEvent('auth-expired', {
          detail: { message: authErrorMessage || 'unauthenticated' },
        })
      );
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updateUser: (data) => api.put('/user', data),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  suspendUser: (userId, data) => api.put(`/admin/users/${userId}/status`, data),
  updateUserRole: (userId, data) => api.put(`/admin/users/${userId}/role`, data),
  // Role management methods
  assignRoleToUser: (data) => api.post('/admin/users/assign-role', data),
  removeRoleFromUser: (data) => api.delete('/admin/users/remove-role', { data }),
  getUserRoles: (userId) => api.get(`/admin/users/${userId}/roles`),
  getUserPermissions: (userId) => api.get(`/admin/users/${userId}/permissions`),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),
  uploadProfilePicture: (formData: FormData) => api.post('/profile/picture', formData),
  updateLocation: (data: any) => api.put('/profile/location', data),
  deleteProfilePicture: () => api.delete('/profile/picture'),
};

export default api;
