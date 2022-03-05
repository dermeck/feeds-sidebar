import styled from '@emotion/styled';

import React, { Fragment, FunctionComponent } from 'react';
import { AlertTriangle, Check, Loader } from 'react-feather';

import { Label } from '../../base-components';
import { useAppSelector } from '../../store/hooks';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

const List = styled.ul`
    padding-left: 1rem;
    margin-top: 0.5rem;
`;

const ListItem = styled.li`
    padding: 0.3rem;

    list-style: none;

    & > svg {
        margin-right: 0.5rem;
        vertical-align: middle;
    }
`;

interface Props {
    newFeedUrls: ReadonlyArray<string>;
}

const NewFeedsList: FunctionComponent<Props> = (props: Props) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const feedStatus = useAppSelector((state) => state.session.feedStatus);

    return (
        <Fragment>
            <Label>Recently added Feeds:</Label>
            <List>
                {props.newFeedUrls.map((newFeedUrl) => {
                    const status = feedStatus.find((s) => s.url === newFeedUrl)?.status;

                    if (status === undefined) {
                        return;
                    }

                    switch (status) {
                        case 'loading':
                            return (
                                <ListItem>
                                    <Loader size={16} />
                                    loading...
                                </ListItem>
                            );

                        case 'loaded': {
                            const loadedFeed = feeds.find((f) => f.url === newFeedUrl);
                            if (loadedFeed !== undefined) {
                                return (
                                    <ListItem>
                                        <Check size={16} />
                                        {loadedFeed.title}
                                    </ListItem>
                                );
                            } else {
                                return <li>{newFeedUrl}</li>;
                            }
                        }

                        case 'error':
                            return (
                                <ListItem>
                                    <AlertTriangle size={16} /> {newFeedUrl}
                                </ListItem>
                            );

                        default:
                            throw new UnreachableCaseError(status);
                    }
                })}
            </List>
        </Fragment>
    );
};

export default NewFeedsList;
