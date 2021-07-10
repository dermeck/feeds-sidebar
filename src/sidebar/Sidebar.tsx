/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";
import { Button } from "../components/styled";
import { useAppDispatch } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import FeedList from "./FeedList/FeedList";
import NewFeedForm from "./NewFeedForm/NewFeedForm";
import { keyframes } from "@emotion/react";

const SidebarContainer = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  color: #38383d;
`;

// use max-width because transition to width: auto does not work
const fadeIn = keyframes`
  from {
    visibility: hidden;
    opacity: 0;
    max-width: 0;

  }

  to {
    visibility: visible;
    opacity: 1;
    max-width: 999px;
  }
`;

const fadeOut = keyframes`
  from {
    visibility: visible;
    opacity: 1;
    max-width: 999px;
  }

  to {
    visibility: hidden;
    opacity: 0;
    max-width: 0;
  }
`;

interface FadeProps {
  in?: boolean;
}

const Fade = styled.div`
  display: ${(props: FadeProps) => (props.in ? "block" : "none")};
  animation: ${(props: FadeProps) => (props.in ? fadeIn : fadeOut)} 0.5s
    ease-out;
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
