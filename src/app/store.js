import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from '../features/expenses/expensesSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        expenses: expensesReducer,
        auth: authReducer,
    },
});
