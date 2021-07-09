import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import { FeedItem } from "../../store/slices/feeds";

const Container = styled.li`
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0.4rem;
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

interface Props {
  item: FeedItem;
  onClick: () => void;
}

const FeedItem: FunctionComponent<Props> = (props: Props) => {
  return (
    <Container key={props.item.id}>
      <Link href={props.item.url} onClick={props.onClick}>
        {props.item.title}
      </Link>
    </Container>
  );
};

export default FeedItem;
