import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';

const store = configureStore({
	reducer: {
		user: userReducer,
	},
});

const userSelector = state => state.user;
const getState = store.getState;

export { userSelector, getState };
export default store;
