import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import { Button } from "../components/styled";
import { useAppDispatch } from "../store/hooks";
import { fetchAllFeedsCommand } from "../store/slices/feeds";
import NewFeedForm from "./NewFeedForm/NewFeedForm";

const SidebarContainer = styled.div`
  padding: 0.5rem;
  background-color: #fff;
  color: #38383d;
`;

const Sidebar: FunctionComponent = () => {
  const dispatch = useAppDispatch();

  return (
    <SidebarContainer>
      <NewFeedForm />
      <Button onClick={() => dispatch(fetchAllFeedsCommand())}>
        Fetch Feeds
      </Button>
    </SidebarContainer>
  );
};

export default Sidebar;
