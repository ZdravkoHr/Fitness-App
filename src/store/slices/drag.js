import { createSlice } from '@reduxjs/toolkit';

const dragSlice = createSlice({
	name: 'drag',
	initialState: {
		dragging: false,
		initCoords: {},
		clientCoords: {},
		fakeCoords: {},
		dragID: null,
		data: null,
	},

	reducers: {
		update: (state, { payload }) => {
			Object.entries(payload).forEach(([key, val]) => {
				state[key] = val;
			});
		},

		updateFake: (state, { payload }) => {
			state.fakeCoords = { ...payload };
		},
	},
});

export default dragSlice.reducer;

export const { update, updateFake } = dragSlice.actions;
