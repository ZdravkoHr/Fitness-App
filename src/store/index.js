import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';

const store = configureStore({
	reducer: {
		user: userReducer,
	},
});

const userSelector = state => state.user;

export { userSelector };
export default store;
