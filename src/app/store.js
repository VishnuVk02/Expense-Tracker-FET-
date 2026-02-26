import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from '../features/expenses/expensesSlice';
import authReducer from '../features/auth/authSlice';
import billsReducer from '../features/bills/billsSlice';

export const store = configureStore({
    reducer: {
        expenses: expensesReducer,
        auth: authReducer,
        bills: billsReducer,
    },
});
