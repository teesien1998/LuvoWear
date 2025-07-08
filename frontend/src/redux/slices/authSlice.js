import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Check for an existing guest ID in the localStorage or generate a new one
let initialGuestId = localStorage.getItem("guestId");
if (!initialGuestId) {
  initialGuestId = `guest_${Date.now()}`;
  localStorage.setItem("guestId", initialGuestId);
}

// Initial State
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  //   loading: false,
  //   error: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("userInfo");

      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on log out
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state, action) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(loginUser.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(loginUser.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.user = action.payload;
  //     })
  //     .addCase(loginUser.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload.message; // This is what rejectWithValue provides
  //     })
  //     .addCase(registerUser.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(registerUser.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.user = action.payload;
  //     })
  //     .addCase(registerUser.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload.message; // This is what rejectWithValue provides
  //     });
  // },
});

// // Async Thunk for User Login
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("/api/users/login", userData);
//       localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//       return response.data.user; // 👈 Triggers .fulfilled, becomes action.payload in .fulfilled
//     } catch (error) {
//       return rejectWithValue(error.response.data); // 👈 Triggers .rejected, becomes action.payload in .rejected
//     }
//   }
// );

// // Async Thunk for User Registration
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("/api/users/register", userData);
//       localStorage.setItem("userInfo", JSON.stringify(response.data.user));
//       return response.data.user; // Return the user object from the response
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const { setCredentials, logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
