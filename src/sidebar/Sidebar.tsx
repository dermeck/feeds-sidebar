import React from "react";
import { useDispatch } from "react-redux";
import FeedSlice from "../store/slices/feeds";

function Sidebar() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={(e) => {
        console.log(e);
        dispatch({ type: "feed/added" });
        dispatch(FeedSlice.actions.addFeed("moep"));
      }}
    >
      moep...
    </button>
  );
}

export default Sidebar;
