import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authApi } from "./services/authApi";
import { userProfileApi } from "./services/userProfileApi";
import { bmiLogsApi } from "./services/bmiLogApi";
import { mealApi } from "./services/mealApi";
import { dietPlanApi } from "./services/dietPlanApi";
import { dietLogApi } from "./services/dietLogApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userProfileApi.reducerPath]: userProfileApi.reducer,
    [bmiLogsApi.reducerPath]: bmiLogsApi.reducer,
    [mealApi.reducerPath]: mealApi.reducer,
    [dietPlanApi.reducerPath]: dietPlanApi.reducer,
    [dietLogApi.reducerPath]: dietLogApi.reducer,
  },
  middleware: (getDefaultMW) =>
    getDefaultMW().concat(
      authApi.middleware,
      userProfileApi.middleware,
      bmiLogsApi.middleware,
      mealApi.middleware,
      dietPlanApi.middleware,
      dietLogApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
