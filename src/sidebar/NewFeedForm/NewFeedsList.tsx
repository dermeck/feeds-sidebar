import styled from '@emotion/styled';
import { Warning, Spinner, Check } from 'phosphor-react';

import React, { Fragment, FunctionComponent } from 'react';

import { Label } from '../../base-components';
import { useAppSelector } from '../../store/hooks';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

const List = styled.ul`
    padding-left: 12px;
    margin-top: 6px;
`;

const ListItem = styled.li`
    padding: 4px;

    list-style: none;

    & > svg {
        margin-right: 6px;
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
                                    <Spinner size={18} />
                                    loading...
                                </ListItem>
                            );

                        case 'loaded': {
                            const loadedFeed = feeds.find((f) => f.url === newFeedUrl);
                            if (loadedFeed !== undefined) {
                                return (
                                    <ListItem>
                                        <Check size={18} />
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
                                    <Warning size={18} /> {newFeedUrl}
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
