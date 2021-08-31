import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
	},
	reducers: {
		login: (state, { payload }) => {
			state.user = { ...payload };
		},

		logout: state => {
			state.user = null;
		},
	},
});

export default userSlice.reducer;

export const { login, logout } = userSlice.actions;
