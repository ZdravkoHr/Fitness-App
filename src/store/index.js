import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';
import workoutsReducer from './slices/workouts';
import dragReducer from './slices/drag';

const store = configureStore({
	reducer: {
		user: userReducer,
		workouts: workoutsReducer,
		drag: dragReducer,
	},
});

const userSelector = state => state.user;
const workoutsSelector = state => state.workouts;
const dragSelector = state => state.drag;

export { userSelector, workoutsSelector, dragSelector };
export default store;
