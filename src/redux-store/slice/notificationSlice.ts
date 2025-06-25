import { IMessage } from '@/model/Message';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  items: IMessage[]; 
}

const initialState:NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
   
    setNotifications: (state, action) => {
      state.items = action.payload
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find(item => item._id.toString() === action.payload);
      if (notif) notif.read = 'TRUE';
    },
    cleareNotifications: (state) => {
      state.items = []
    },

  },
});

export const { setNotifications, markAsRead, cleareNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
