import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRegisterUser, fetchLoginUser } from "./userAPI";

interface userThunk {
  username: string;
  password: string;
}
type user = {
  token: string;
};
type userState = {
  user: user | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
};
const initialState: userState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchRegisterUserThunk = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>(
  "user/fetchRegisterUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetchRegisterUser(username, password);

      let responseJson;
      try {
        responseJson = await response.json();
      } catch (error) {
        return rejectWithValue("Invalid response from server");
      }

      if (!response.ok) {
        const errorMessage = String(
          responseJson.message || "An unknown error occurred"
        );

        return rejectWithValue(errorMessage);
      }

      return responseJson.message;
    } catch (error) {
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchLoginUserThunk = createAsyncThunk(
  "user/fetchLoginUser",
  async ({ username, password }: userThunk, { rejectWithValue }) => {
    const response = await fetchLoginUser(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
      return rejectWithValue(
        responseJson.message || "An unknown error occurred"
      );
    } else if (
      responseJson.message.toString() === "User logged in successfully!"
    ) {
      return responseJson.token;
    } else {
      return rejectWithValue(responseJson.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = null;
        state.error = null;
        alert("User registered successfully! Please login to continue.");
      })
      .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;

        if (action.payload === "User already exists") {
          alert("User already exists. Please use a different username.");
        } else {
          alert("Failed to register user. Please try again.");
        }
      })
      .addCase(fetchLoginUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;
        alert("Failed to login user. Please try again.");
      })
      .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.error = null;
      });
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
