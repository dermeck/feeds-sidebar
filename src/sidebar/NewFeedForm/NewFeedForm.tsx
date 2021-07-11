import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";
import { Button, Input } from "../../components/styled";
import { useAppDispatch } from "../../store/hooks";
import FeedSlice from "../../store/slices/feeds";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled(Button)({ alignSelf: "flex-end" });

const NewFeedForm: FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const [newFeedUrl, setNewFeedUrl] = useState("");

  return (
    <Container>
      <Input
        placeholder="https://blog.mozilla.org/en/feed/"
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
      ></Input>
      <AddButton
        onClick={() => {
          dispatch(FeedSlice.actions.addFeed(newFeedUrl));
        }}
      >
        Add New Feed
      </AddButton>
    </Container>
  );
};

export default NewFeedForm;
