/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";
import { Drawer, ToolbarContainer, Input } from "../components/styled";
import { ToolbarButton } from "../components/styled/Button";
import { useAppDispatch } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import FeedList from "./FeedList/FeedList";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const SidebarContainer = styled.div`
  background-color: #fff;
  color: #38383d;
`;

const Header = styled(ToolbarContainer)`
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  grid-column-gap: 6px;
  align-items: center;
`;

const FetchAllButton = styled(ToolbarButton)({
  gridColumn: "1",
});

const NavigateToAddViewButton = styled(ToolbarButton)({
  gridColumn: "3",
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
