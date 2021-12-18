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
				if (key === 'data') console.log(key + ': ', val);
				state[key] = val;
			});
		},
	},
});

export default dragSlice.reducer;

export const { update, setItem } = dragSlice.actions;
