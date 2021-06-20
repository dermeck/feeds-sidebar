import { Middleware } from "redux";
import { RootState } from "../store";

// eslint-disable-next-line @typescript-eslint/ban-types
export const loggerMiddleware: Middleware<{}, RootState> =
  (storeApi) => (next) => (action) => {
    console.log("dispatching", action);
    const result = next(action);
    console.log("next state", storeApi.getState());

    return result;
  };
