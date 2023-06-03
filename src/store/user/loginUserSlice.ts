import { createSlice } from "@reduxjs/toolkit";

type UserInterface = {
  id: number;
  name: string;
  email: string;
};

type UserStoreInterface = {
  user: UserInterface | null;
  isLogin: boolean;
  permissions: string[];
};

let defaultValue: UserStoreInterface = {
  user: null,
  isLogin: false,
  permissions: [],
};

const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: {
    value: defaultValue,
  },
  reducers: {
    loginAction(stage, e) {
      stage.value.user = e.payload.user;
      stage.value.permissions = e.payload.permissions;
      stage.value.isLogin = true;
    },
    logoutAction(stage) {
      stage.value.user = null;
      stage.value.isLogin = false;
    },
  },
});

export default loginUserSlice.reducer;
export const { loginAction, logoutAction } = loginUserSlice.actions;

export type { UserStoreInterface };
