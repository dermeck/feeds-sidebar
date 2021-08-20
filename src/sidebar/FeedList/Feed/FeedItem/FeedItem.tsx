import styled from '@emotion/styled';
import React, { FunctionComponent } from 'react';
import { Globe } from 'react-feather';

import { FeedItem as FeedItemType } from '../../../../store/slices/feeds';

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
    margin-left: 0.25rem;

    &:hover {
        text-decoration: underline;
    }

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

interface Props {
    item: FeedItemType;
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const enum AuxButton {
    middleMousButton = 1,
    rightMouseButton = 2,
}

const FeedItem: FunctionComponent<Props> = (props: Props) => {
    return (
        <Container key={props.item.id}>
            <Globe size={16} />
            <Link
                href={props.item.url}
                onAuxClick={(e) => {
                    if (e.button === AuxButton.middleMousButton) {
                        props.onClick(e);
                    }
                }}
                onContextMenu={
                    // TODO create custom context menu (open in new tab etc)
                    // or find a way to track if item is opened in standard context menu to mark it as read
                    (e) => e.preventDefault()
                }
                onClick={props.onClick}
                onDragStart={(e) => e.preventDefault()}>
                {props.item.title}
            </Link>
        </Container>
    );
};

export default FeedItem;
