import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bills`;

const getAuthHeader = (thunkAPI) => {
    const { auth } = thunkAPI.getState();
    return {
        headers: {
            Authorization: `Bearer ${auth.user?.token}`
        }
    };
};

// Fetch all bills
export const fetchBills = createAsyncThunk('bills/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Add bill
export const addBill = createAsyncThunk('bills/add', async (billData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, billData, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Toggle pin
export const togglePinBill = createAsyncThunk('bills/togglePin', async (id, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/pin`, {}, getAuthHeader(thunkAPI));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Remove bill
export const removeBill = createAsyncThunk('bills/remove', async (id, thunkAPI) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader(thunkAPI));
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const billsSlice = createSlice({
    name: 'bills',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBills.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBills.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addBill.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(togglePinBill.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(removeBill.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export default billsSlice.reducer;
