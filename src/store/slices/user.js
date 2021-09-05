import { createSlice } from '@reduxjs/toolkit';
import { history } from 'helpers';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
	},
	reducers: {
		login: (state, { payload }) => {
			state.user = { ...payload };
			history.push('/');
		},

		logout: (state, { payload = true }) => {
			console.log('LOGGING OUT!', payload);
			state.user = null;
			payload && history.push('signin');
		},
	},
});

export default userSlice.reducer;

export const { login, logout } = userSlice.actions;
