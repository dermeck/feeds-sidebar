/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";
import { Button, Fade } from "../components/styled";
import { useAppDispatch } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import FeedList from "./FeedList/FeedList";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const SidebarContainer = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  color: #38383d;
`;

export type View = "feeds" | "newFeed";

const Sidebar: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<View>("feeds");

  return (
    <SidebarContainer>
      <Button onClick={() => dispatch(fetchAllFeedsCommand())}>
        Fetch Feeds
      </Button>
      <Button onClick={() => setView("newFeed")}>New Feeds</Button>
      <Button onClick={() => setView("feeds")}>Feeds</Button>
      <div>
        <Fade in={view === "newFeed"}>
          <NewFeedForm />
        </Fade>
        <Fade in={view === "feeds"}>
          <FeedList />
        </Fade>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
