import React from "react";
import { useDispatch } from "react-redux";

function Sidebar() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={(e) => {
        console.log(e);
        dispatch({ type: "feed/added" });
      }}
    >
      moep...
    </button>
  );
}

export default Sidebar;
