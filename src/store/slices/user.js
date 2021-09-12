import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		logged: false,
		appData: {
			workouts: [],
		},
		dbAppData: {},
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
		addWorkout: (state, { payload }) => {
			state.appData.workouts.push(payload);
		},
		setAppData: (state, { payload }) => {
			state.appData = payload;
		},
		setDbAppData: (state, { payload }) => {
			state.dbAppData = payload;
		},
	},
});

export default userSlice.reducer;

export const { login, logout, addWorkout, setAppData, setDbAppData } =
	userSlice.actions;
