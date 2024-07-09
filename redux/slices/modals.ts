import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxModalsState } from 'typings';

const initialState: ReduxModalsState = {
  showLoginModal: false
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialState,
  reducers: {
    toggleLoginModal: (state, { payload }: PayloadAction<boolean>) => {
        state.showLoginModal = payload;
    },
    resetModalsState: () => initialState
  },
});

export const { toggleLoginModal, resetModalsState } = modalsSlice.actions;

export default modalsSlice.reducer;
