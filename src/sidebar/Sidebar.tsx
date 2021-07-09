import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import { Button } from "../components/styled";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import feedsSlice, { fetchAllFeedsCommand } from "../store/slices/feeds";
import NewFeedForm from "./NewFeedForm/NewFeedForm";
import FeedItem from "./FeedItem/FeedItem";

const SidebarContainer = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  color: #38383d;
`;

const FeedContainer = styled.ul`
  padding-left: 1rem;
  margin: 0.3rem 0 0.5rem 0;
`;

const FeedTitle = styled.label`
  margin-left: 0.5rem;
`;

const Sidebar: FunctionComponent = () => {
  const feeds = useAppSelector((state) => state.feeds.feeds);
  const dispatch = useAppDispatch();

  return (
    <SidebarContainer>
      <NewFeedForm />
      <Button onClick={() => dispatch(fetchAllFeedsCommand())}>
        Fetch Feeds
      </Button>
      {feeds.map((feed) => (
        <div key={feed.url}>
          <FeedTitle>{feed.title || feed.url}</FeedTitle>
          <FeedContainer>
            {feed.items.map(
              (item) =>
                !item.isRead && (
                  <FeedItem
                    key={item.id}
                    item={item}
                    onClick={() =>
                      dispatch(
                        feedsSlice.actions.itemRead({
                          feedId: feed.id,
                          itemId: item.id,
                        })
                      )
                    }
                  />
                )
            )}
          </FeedContainer>
        </div>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
