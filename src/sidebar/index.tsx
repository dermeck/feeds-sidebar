import React from "react";
import { render } from "react-dom";
import Sidebar from "./Sidebar";
import { Store } from "webext-redux";
import { Provider } from "react-redux";

const store = new Store();

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Sidebar />
    </Provider>,
    document.getElementById("sidebar-root")
  );
});
