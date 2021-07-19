import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent } from 'react';
import { AlertTriangle, Check, Loader } from 'react-feather';

import { Label } from '../../../components/styled';
import { useAppSelector } from '../../../store/hooks';

const List = styled.ul`
    padding-left: 1rem;
    margin-top: 0.5rem;
`;

const ListItem = styled.li`
    list-style: none;
    padding: 0.3rem;

    & > svg {
        vertical-align: middle;
        margin-right: 0.5rem;
    }
`;

const NewFeedsList: FunctionComponent = () => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const newFeeds = useAppSelector((state) => state.session.newFeeds);

    return (
        <Fragment>
            <Label>Recently added Feeds:</Label>
            <List>
                {newFeeds.map((newFeed) => {
                    switch (newFeed.status) {
                        case 'loading':
                            return (
                                <ListItem>
                                    <Loader size={16} />
                                    loading...
                                </ListItem>
                            );
                        case 'loaded': {
                            const loadedFeed = feeds.find((f) => f.url === newFeed.url);
                            if (loadedFeed !== undefined) {
                                return (
                                    <ListItem>
                                        <Check size={16} />
                                        {loadedFeed.title}
                                    </ListItem>
                                );
                            } else {
                                return <li>{newFeed.url}</li>;
                            }
                        }
                        case 'error':
                            return (
                                <ListItem>
                                    <AlertTriangle size={16} /> {newFeed.url}
                                </ListItem>
                            );
                    }
                })}
            </List>
        </Fragment>
    );
};

export default NewFeedsList;
