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
			// state = {
			// 	...state,
			// 	user: { ...payload },
			// 	logged: true,
			// };
			state.user = { ...payload };
			state.logged = true;
		},

		logout: state => {
			state.user = null;
			state.logged = false;
		},

		removeWorkout: (state, { payload }) => {
			state.appData.workouts = state.appData.workouts.filter(
				workout => workout.id !== payload
			);
		},
		modifyWorkouts: (state, { payload }) => {
			const workoutIndex = state.appData.workouts.findIndex(
				workout => workout.id === payload.id
			);

			if (workoutIndex === -1) {
				state.appData.workouts.push(payload);
				return;
			}

			state.appData.workouts = state.appData.workouts.map(workout => {
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
	modifyWorkouts,
	removeWorkout,
	editWorkout,
	setAppData,
	setDbAppData,
} = userSlice.actions;
