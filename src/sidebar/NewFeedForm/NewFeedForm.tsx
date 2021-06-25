import React, { Fragment, FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import FeedSlice from "../../store/slices/feeds";

import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0.5rem;
`;

const Button = styled.button`
  align-self: flex-end;
  :hover {
    background-color: rgba(207, 207, 207, 0.66);
  }
  background-color: rgba(207, 207, 207, 0.33);
  border: none;
  color: rgb(21, 20, 26);
  font-size: 13px;
  // font-weight: 600;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  line-height: 27px;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  height: 32px;
  border-radius: 2px;
  border: 1px solid rgba(12, 12, 13, 0.2);
  padding-inline: 8px;
`;

const NewFeedForm: FunctionComponent = () => {
  const dispatch = useDispatch();

  const [newFeedUrl, setNewFeedUrl] = useState("");

  return (
    <Container>
      <Input
        placeholder="https://blog.mozilla.org/en/feed/"
        value={newFeedUrl}
        onChange={(e) => setNewFeedUrl(e.target.value)}
      ></Input>
      <Button
        onClick={() => {
          dispatch(FeedSlice.actions.addFeed(newFeedUrl));
        }}
      >
        Add New Feed
      </Button>
    </Container>
  );
};

export default NewFeedForm;
