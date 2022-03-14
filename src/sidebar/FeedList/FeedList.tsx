import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { useAppSelector } from '../../store/hooks';
import Feed from './Feed';

interface Props {
    showFeedTitles: boolean;
    filterString: string;
}

const FeedList: FunctionComponent<Props> = (props: Props) => {
    const feeds = useAppSelector((state) => state.feeds);

    return (
        <FullHeightScrollContainer>
            <Virtuoso
                data={feeds.feeds}
                itemContent={(index, feed) => (
                    <Feed
                        key={feed.id}
                        isSelected={feeds.selectedFeedId === feed.id}
                        feed={feed}
                        showTitle={props.showFeedTitles}
                        filterString={props.filterString}
                    />
                )}
            />
        </FullHeightScrollContainer>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
