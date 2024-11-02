import styled from '@emotion/styled';
import { Warning, Spinner, Check } from 'phosphor-react';

import React, { Fragment, FunctionComponent } from 'react';

import { useAppSelector } from '../../store/hooks';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

const List = styled.ul`
    flex: 1;
    padding-left: 12px;
    border: 1px solid;
    border-color: ${(props) => props.theme.colors.menuBorderColor};
    border-radius: 4px;
    margin-top: 6px;
    overflow-y: scroll;
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
            <label className="subscribe-view__section-heading">Recently added Feeds:</label>
            {props.newFeedUrls.length > 0 && (
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
                                const loadedFeed = feeds.find((f) => f.id === newFeedUrl);
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
            )}
            <div></div>
        </Fragment>
    );
};

export default NewFeedsList;
