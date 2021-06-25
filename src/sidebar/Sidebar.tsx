import React, { Fragment, FunctionComponent } from "react";
import { useAppSelector } from "../store/hooks";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const Sidebar: FunctionComponent = () => {
  const feeds = useAppSelector((state) => state.feeds.feeds);

  return (
    <Fragment>
      <NewFeedForm />
      {feeds.map((feed) => (
        <li key={feed.url}>{feed.url}</li>
      ))}
    </Fragment>
  );
};

export default Sidebar;
