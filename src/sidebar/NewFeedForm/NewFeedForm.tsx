import React, { Fragment, FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import FeedSlice from "../../store/slices/feeds";

const NewFeedForm: FunctionComponent = () => {
  const dispatch = useDispatch();

  const [newFeedUrl, setNewFeedUrl] = useState("");

  return (
    <Fragment>
      <input
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
      ></input>
      <button
        onClick={() => {
          dispatch(FeedSlice.actions.addFeed(newFeedUrl));
        }}
      >
        Add New Feed
      </button>
    </Fragment>
  );
};

export default NewFeedForm;
