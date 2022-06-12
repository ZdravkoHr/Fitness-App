import { createSlice } from '@reduxjs/toolkit';

const diarySlice = createSlice({
	name: 'diary',
	initialState: {
		diary: [],
	},

	reducers: {
		setDiary(state, { payload }) {
			state.diary = payload;
		},
	},
});

export const { setDiary } = diarySlice.actions;

export default diarySlice.reducer;
