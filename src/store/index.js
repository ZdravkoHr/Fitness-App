import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';
import workoutsReducer from './slices/workouts';

const store = configureStore({
	reducer: {
		user: userReducer,
		workouts: workoutsReducer,
	},
});

const userSelector = state => state.user;
const workoutsSelector = state => state.workouts;

export { userSelector, workoutsSelector };
export default store;
