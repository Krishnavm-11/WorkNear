import { createSlice } from "@reduxjs/toolkit";

const workerSlice = createSlice({

  name: "workers",

  initialState: {

    workers: [],
    loading: false,

  },

  reducers: {

    setWorkers: (state, action) => {
      state.workers = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

  },

});

export const {

  setWorkers,
  setLoading,

} = workerSlice.actions;

export default workerSlice.reducer;