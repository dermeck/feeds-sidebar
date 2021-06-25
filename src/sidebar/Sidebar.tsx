import React, { Fragment, FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/hooks";
import FeedSlice from "../store/slices/feeds";

const Sidebar: FunctionComponent = () => {
  const feeds = useAppSelector((state) => state.feeds.feeds);
  const dispatch = useDispatch();

  const [newFeedUrl, setNewFeedUrl] = useState("");

  return (
    <Fragment>
      <input
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
      ></input>
      <button
        onClick={(e) => {
          dispatch(FeedSlice.actions.addFeed(newFeedUrl));
        }}
      >
        Add
      </button>
      {feeds.map((feed) => (
        <li key={feed.url}>{feed.url}</li>
      ))}
    </Fragment>
  );
};

export default Sidebar;
