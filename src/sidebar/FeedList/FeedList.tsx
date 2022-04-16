import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import Feed from './Feed';
import Folder from './Folder';

interface Props {
    showFeedTitles: boolean;
    filterString: string;
}

const FeedList: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds);

    const handleOnEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    return (
        <FullHeightScrollContainer>
            <Folder editing={true} onEditComplete={handleOnEditComplete} />

            <Virtuoso
                data={feeds.feeds}
                itemContent={(index, feed) => (
                    <Feed
                        key={feed.id}
                        selectedId={feeds.selectedId}
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
