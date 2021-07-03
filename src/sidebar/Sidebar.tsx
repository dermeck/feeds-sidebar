import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import { Button } from "../components/styled";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

export const SidebarContainer = styled.div`
  padding: 0.5rem;
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
          {feed.title || feed.url}
          <ul>
            {feed.items?.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
