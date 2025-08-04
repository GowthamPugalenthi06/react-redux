// redux/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  submissions: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addSubmission: (state, action) => {
      state.submissions.push(action.payload);
    },
    loadSubmissions: (state, action) => {
      state.submissions = action.payload;
    },
    updateSubmission: (state, action) => {
      const { id, updated } = action.payload;
      state.submissions[id] = updated;
    },
    deleteSubmission: (state, action) => {
      state.submissions.splice(action.payload, 1);
    },
  },
});

export const {
  addSubmission,
  loadSubmissions,
  updateSubmission,
  deleteSubmission,
} = formSlice.actions;

export default formSlice.reducer;
