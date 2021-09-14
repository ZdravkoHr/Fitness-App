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
		removeWorkout: (state, { payload }) => {
			state.appData.workouts = state.appData.workouts.filter(
				workout => workout.id !== payload
			);
		},
		editWorkout: (state, { payload }) => {
			console.log('payload: ', payload);
			state.appData.workouts = state.appData.workouts.map(workout => {
				console.log(workout.id, payload.id);
				console.log(workout.id === payload.id);
				return workout.id === payload.id ? payload : workout;
			});

			console.log(state.appData.workouts);
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

export const {
	login,
	logout,
	addWorkout,
	removeWorkout,
	editWorkout,
	setAppData,
	setDbAppData,
} = userSlice.actions;
