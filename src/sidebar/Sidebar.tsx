/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";
import { Button, Drawer, HeaderContainer, Input } from "../components/styled";
import { useAppDispatch } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import FeedList from "./FeedList/FeedList";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const SidebarContainer = styled.div`
  background-color: #fff
  color: #38383d;
`;

const Header = styled(HeaderContainer)`
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  grid-column-gap: 8px;
  align-items: center;
`;

const FetchAllButton = styled(Button)({
  gridColumn: "1",
  paddingInline: "0",
  marginLeft: "0.5rem",
  width: "32px",
  height: "32px",
});

const NavigateToAddViewButton = styled(Button)({
  gridColumn: "3",
  paddingInline: "0",
  marginRight: "0.5rem",
  width: "32px",
  height: "32px",
});

const FilterInput = styled(Input)({
  gridColumn: "2",
});

export type View = "feeds" | "newFeed";

const Sidebar: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<View>("feeds");

  return (
    <SidebarContainer>
      <Header>
        <FetchAllButton onClick={() => dispatch(fetchAllFeedsCommand())}>
          O
        </FetchAllButton>
        <FilterInput value="Filter..."></FilterInput>
        <NavigateToAddViewButton onClick={() => setView("newFeed")}>
          +
        </NavigateToAddViewButton>
      </Header>
      <FeedList />

      <Drawer show={view === "newFeed"}>
        <NewFeedForm onCancel={() => setView("feeds")} />
      </Drawer>
    </SidebarContainer>
  );
};

export default Sidebar;
