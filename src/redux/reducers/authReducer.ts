import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginService } from '@/services/AuthService';
import { getUserProfile } from '@/services/UserService';
import type { AuthState, UserProfile, LoginCredentials } from '../models/authModel';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isFirstLogin: false,
};

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await loginService(username, password);
            const { accessToken, isFirstLogin } = response;
            
            // Save token to localStorage
            localStorage.setItem('token', accessToken);
            
            // Get user profile
            const userProfile = await getUserProfile();
            
            return { token: accessToken, user: userProfile, isFirstLogin };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Đăng nhập thất bại');
        }
    }
);

// Async thunk for loading user profile from token
export const loadUserFromToken = createAsyncThunk(
    'auth/loadUserFromToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                return rejectWithValue('No token found');
            }
            
            const userProfile = await getUserProfile();
            
            return { token, user: userProfile };
        } catch (error: any) {
            localStorage.removeItem('token');
            return rejectWithValue(error?.response?.data?.message || 'Token không hợp lệ');
        }
    }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: UserProfile; isFirstLogin: boolean }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null;
            state.isFirstLogin = action.payload.isFirstLogin;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = action.payload as string;
        });

        // Load user from token
        builder.addCase(loadUserFromToken.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadUserFromToken.fulfilled, (state, action: PayloadAction<{ token: string; user: UserProfile }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null;
        });
        builder.addCase(loadUserFromToken.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = null;
            state.isFirstLogin = false;
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
