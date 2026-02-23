import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from '../auth/authSlice';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = (thunkAPI) => {
    const { auth } = thunkAPI.getState();
    return {
        headers: {
            Authorization: `Bearer ${auth.user?.token}`
        }
    };
};

const handleUnauthorized = (error, thunkAPI) => {
    if (error.response?.status === 401) {
        thunkAPI.dispatch(logout());
    }
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
};

// Fetch all expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/expenses`, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Fetch group settings (income, budget)
export const fetchGroupSettings = createAsyncThunk('expenses/fetchSettings', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/groups/me`, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Add expense
export const addExpenseAsync = createAsyncThunk('expenses/add', async (expenseData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/expenses`, expenseData, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Update settings (admin only)
export const updateGroupSettings = createAsyncThunk('expenses/updateSettings', async (settings, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/groups/settings`, settings, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Remove expense
export const removeExpenseAsync = createAsyncThunk('expenses/remove', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/expenses/${id}`, getAuthHeader(thunkAPI));
        return id;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Fetch all members
export const fetchMembers = createAsyncThunk('expenses/fetchMembers', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/groups/members`, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Leave group
export const leaveGroup = createAsyncThunk('expenses/leaveGroup', async (_, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/groups/leave`, {}, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Join group
export const joinGroup = createAsyncThunk('expenses/joinGroup', async (inviteCode, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/groups/join`, { inviteCode }, getAuthHeader(thunkAPI));
        // Refresh data after joining
        thunkAPI.dispatch(fetchExpenses());
        thunkAPI.dispatch(fetchGroupSettings());
        thunkAPI.dispatch(fetchMembers());
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

// Create group
export const createGroup = createAsyncThunk('expenses/createGroup', async (name, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/groups`, { name }, getAuthHeader(thunkAPI));
        // Refresh data after creation
        thunkAPI.dispatch(fetchGroupSettings());
        thunkAPI.dispatch(fetchMembers());
        return response.data;
    } catch (error) {
        return handleUnauthorized(error, thunkAPI);
    }
});

const initialState = {
    items: [],
    members: [],
    totalIncome: 0,
    budget: 0,
    group: null,
    loading: false,
    error: null,
};

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        resetExpenses: (state) => {
            state.items = [];
            state.members = [];
            state.totalIncome = 0;
            state.budget = 0;
            state.group = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchGroupSettings.fulfilled, (state, action) => {
                state.totalIncome = action.payload?.income || 0;
                state.budget = action.payload?.budget || 0;
                state.group = action.payload;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.members = action.payload;
            })
            .addCase(addExpenseAsync.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(removeExpenseAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(updateGroupSettings.fulfilled, (state, action) => {
                state.totalIncome = action.payload?.income || 0;
                state.budget = action.payload?.budget || 0;
            })
            .addCase(leaveGroup.fulfilled, (state) => {
                state.items = [];
                state.members = [];
                state.totalIncome = 0;
                state.budget = 0;
                state.group = null;
            })
            .addCase(joinGroup.fulfilled, (state, action) => {
                state.group = action.payload;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.group = action.payload;
            });
    },
});

export const { resetExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
