import React, { FunctionComponent } from 'react';

import { FullHeightScrollContainer } from '../../base-components';
import { useAppSelector } from '../../store/hooks';
import Feed from './Feed/Feed';

interface Props {
    showFeedTitles: boolean;
    filterString: string;
}

const FeedList: FunctionComponent<Props> = (props: Props) => {
    const feeds = useAppSelector((state) => state.feeds);

    return (
        <FullHeightScrollContainer>
            {feeds.feeds.map((feed) => (
                <Feed
                    key={feed.id}
                    isSelected={feeds.selectedFeedId === feed.id}
                    feed={feed}
                    showTitle={props.showFeedTitles}
                    filterString={props.filterString}
                />
            ))}
        </FullHeightScrollContainer>
    );
};

export default FeedList;
