import styled from "@emotion/styled";
import React, { Fragment, FunctionComponent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import feedsSlice from "../../store/slices/feeds";
import FeedItem from "../FeedItem/FeedItem";

const FeedContainer = styled.ul`
  padding-left: 1rem;
  margin: 0.3rem 0 0.5rem 0;
`;

const FeedTitle = styled.label`
  margin-left: 0.5rem;
`;

const FeedList: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const feeds = useAppSelector((state) => state.feeds.feeds);

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default FeedList;
