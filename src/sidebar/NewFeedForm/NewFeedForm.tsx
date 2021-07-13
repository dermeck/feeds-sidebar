import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";
import { ArrowLeft } from "react-feather";
import {
  Button,
  ToolbarContainer,
  Input,
  ToolbarButton,
} from "../../components/styled";
import { useAppDispatch } from "../../store/hooks";
import FeedSlice from "../../store/slices/feeds";

const Container = styled.div``;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const Title = styled.h1`
  align-self: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin: auto;
`;

const Label = styled.label`
  font-size: 1rem;
  line-height: 1.8rem;
  font-weight: 600;
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
      <ToolbarContainer>
        <ToolbarButton onClick={props.onCancel}>
          <ArrowLeft />
        </ToolbarButton>
        <Title>Add New Feed</Title>
      </ToolbarContainer>
      <ContentContainer>
        <Label>Feed URL</Label>
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
      </ContentContainer>
    </Container>
  );
};

export default NewFeedForm;
