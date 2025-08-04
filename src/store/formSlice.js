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
      const { id, updatedData } = action.payload;
      const index = state.submissions.findIndex((sub) => sub.id === id);
      if (index !== -1) {
        state.submissions[index] = { ...state.submissions[index], ...updatedData };
      }
    },
   
    deleteSubmission: (state, action) => {
      const idToDelete = action.payload;
      state.submissions = state.submissions.filter(
        (sub) => sub.id !== idToDelete
      );
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