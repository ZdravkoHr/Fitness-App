import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';
import workoutsReducer from './slices/workouts';
import diaryReducer from './slices/diary';

const store = configureStore({
	reducer: {
		user: userReducer,
		workouts: workoutsReducer,
		diary: diaryReducer,
	},
});

const userSelector = state => state.user;
const workoutsSelector = state => state.workouts;
const diarySelector = state => state.diary;

export { userSelector, workoutsSelector, diarySelector };
export default store;
