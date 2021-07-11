import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";
import { Button, HeaderContainer, Input } from "../../components/styled";
import { useAppDispatch } from "../../store/hooks";
import FeedSlice from "../../store/slices/feeds";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled(Button)({ alignSelf: "flex-end" });

interface Props {
  onCancel: () => void;
}

const NewFeedForm: FunctionComponent<Props> = (props: Props) => {
  const dispatch = useAppDispatch();

  const [newFeedUrl, setNewFeedUrl] = useState("");

  return (
    <Container>
      <HeaderContainer>
        <Button onClick={props.onCancel}>Cancel</Button>
      </HeaderContainer>

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
