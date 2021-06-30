import React, { Fragment, FunctionComponent } from "react";
import { Button } from "../components/styled";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const Sidebar: FunctionComponent = () => {
  const feeds = useAppSelector((state) => state.feeds.feeds);
  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <NewFeedForm />
      {feeds.map((feed) => (
        <div key={feed.url}>
          {feed.url}
          <ul>
            {feed.items?.map((item) => (
              <li>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
      <Button onClick={() => dispatch(fetchAllFeedsCommand())}>
        Fetch Feeds
      </Button>
    </Fragment>
  );
};

export default Sidebar;
