import { createSlice } from '@reduxjs/toolkit';

const dragSlice = createSlice({
	name: 'drag',
	initialState: {
		dragging: false,
		initCoords: {},
		clientCoords: {},

		dragID: null,
		data: null,
	},

	reducers: {
		update: (state, { payload }) => {
			Object.entries(payload).forEach(([key, val]) => {
				state[key] = val;
			});
			//state = { ...state, ...payload };
		},
	},
});

export default dragSlice.reducer;

export const { update, setItem } = dragSlice.actions;
