import { createSlice } from '@reduxjs/toolkit';
import { history } from 'helpers';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		logged: false,
	},
	reducers: {
		login: (state, { payload }) => {
			state.user = { ...payload.user };
			state.logged = true;
			payload.redirect && history.push('/');
		},

		logout: (state, { payload = true }) => {
			state.user = null;
			state.logged = false;
			payload && history.push('signin');
		},
	},
});

export default userSlice.reducer;

export const { login, logout } = userSlice.actions;
