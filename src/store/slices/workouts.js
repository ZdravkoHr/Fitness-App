import { createSlice } from '@reduxjs/toolkit';

const data = {
	workouts: [],
};

const workoutsSlice = createSlice({
	name: 'workouts',
	initialState: {
		appData: {
			...data,
		},

		dbData: {
			...data,
		},
	},

	reducers: {
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
		},
		setAppData: (state, { payload }) => {
			state.appData = payload;
		},
		setDbData: (state, { payload }) => {
			state.dbData = payload;
		},
	},
});

export const { removeWorkout, modifyWorkouts, setAppData, setDbData } =
	workoutsSlice.actions;

export default workoutsSlice.reducer;
