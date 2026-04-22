import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("ewise_token") || sessionStorage.getItem("ewise_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const publicEndpoints = ['/auth/login', '/auth/refresh-token', '/auth/logout', '/forgot-password'];

const getStoredAccessToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token')
    : null;

const getStoredRefreshToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('ewise_refresh_token') || sessionStorage.getItem('ewise_refresh_token')
    : null;

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('ewise_token', accessToken);
  sessionStorage.setItem('ewise_token', accessToken);
  localStorage.setItem('ewise_refresh_token', refreshToken);
  sessionStorage.setItem('ewise_refresh_token', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('ewise_token');
  sessionStorage.removeItem('ewise_token');
  localStorage.removeItem('ewise_refresh_token');
  sessionStorage.removeItem('ewise_refresh_token');
  localStorage.removeItem('ewise_processing_time');
};

const isManualLogoutInProgress = () => {
  return typeof window !== 'undefined' && sessionStorage.getItem('ewise_manual_logout') === '1';
};

const dispatchLogout = () => {
  const event = new CustomEvent('auth:logout');
  window.dispatchEvent(event);
};

const dispatchLogoutWithMessage = (message: string) => {
  const event = new CustomEvent('auth:logout-with-message', { detail: { message } });
  window.dispatchEvent(event);
};

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    if (publicEndpoints.some((path) => requestUrl.includes(path))) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message;
      
      // Case 1: No message = token expired, try refresh
      if (!errorMessage) {
        if (typeof window === 'undefined') {
          return Promise.reject(error);
        }

        if (originalRequest?._retry) {
          return Promise.reject(error);
        }

        const currentAccessToken = getStoredAccessToken();
        const currentRefreshToken = getStoredRefreshToken();

        if (!currentAccessToken || !currentRefreshToken) {
          clearTokens();
          dispatchLogout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { refreshToken: requestRefreshToken } = await import('@/services/AuthService');
          const refreshedTokens = await requestRefreshToken({
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          });

          const nextAccessToken = refreshedTokens.accessToken;
          const nextRefreshToken = refreshedTokens.refreshToken || currentRefreshToken;

          saveTokens(nextAccessToken, nextRefreshToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${nextAccessToken}`;
          processQueue(null, nextAccessToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          clearTokens();
          dispatchLogout();

          setTimeout(() => {
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
          }, 100);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } 
      // Case 2: Has message = device conflict/account already logged in elsewhere
      else {
        if (typeof window !== 'undefined') {
          // If user is manually logging out, don't show device-conflict toast.
          if (isManualLogoutInProgress()) {
            clearTokens();
            dispatchLogout();
            return Promise.reject(error);
          }

          clearTokens();
          dispatchLogoutWithMessage(errorMessage);
          
          setTimeout(() => {
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
          }, 4000);
        }
      }
    } 
    // Handle 403 Forbidden
    else if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        // If user is manually logging out, don't show any extra auth handling.
        if (isManualLogoutInProgress()) {
          clearTokens();
          dispatchLogout();
          return Promise.reject(error);
        }

        clearTokens();
        dispatchLogout();
        
        setTimeout(() => {
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;