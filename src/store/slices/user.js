import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		logged: false,
	},
	reducers: {
		login: (state, { payload }) => {
			state.user = { ...payload };
			state.logged = true;
		},

		logout: state => {
			state.user = null;
			state.logged = false;
		},
	},
});

export default userSlice.reducer;

export const { login, logout } = userSlice.actions;
