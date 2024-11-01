import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { UsersAPI } from "./APIs/UsersAPI";
export const Store = configureStore({
  reducer: {
    // not an array, just a bracket notation
    [UsersAPI.reducerPath]: UsersAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(UsersAPI.middleware);
  },
});
setupListeners(Store.dispatch);
export {
  useGetLanguagesQuery,
  useSubmitCodeMutation,
  useGetSubmissionResultQuery,
} from "./APIs/UsersAPI";
