import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent } from 'react';

import { useAppSelector } from '../../../store/hooks';

// TODO duplicate
const Label = styled.label`
    font-size: 1rem;
    line-height: 1.8rem;
    font-weight: 600;
`;

const NewFeedsList: FunctionComponent = () => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const newFeeds = useAppSelector((state) => state.session.newFeeds);

    return (
        <Fragment>
            <Label>Recently added Feeds:</Label>
            <ul>
                {newFeeds.map((newFeed) => {
                    switch (newFeed.status) {
                        case 'loading':
                            return <li>loading...</li>;
                        case 'loaded': {
                            const loadedFeed = feeds.find((f) => f.url === newFeed.url);
                            if (loadedFeed !== undefined) {
                                return <li>{loadedFeed.title}</li>;
                            } else {
                                return <li>moep{newFeed.url}</li>;
                            }
                        }
                        case 'error':
                            return <li>error: {newFeed.url}</li>;
                    }
                })}
            </ul>
        </Fragment>
    );
};

export default NewFeedsList;
