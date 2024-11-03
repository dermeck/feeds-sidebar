import { GlobeSimple, X } from 'phosphor-react';

import React, { memo, useEffect, useState } from 'react';

import { NodeType } from '../../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import feedsSlice from '../../../../store/slices/feeds';
import { MouseEventButton } from '../../../../utils/types/web-api';
import { Button } from '../../../../base-components/Button/Button';
import { clsx } from 'clsx';

type Props = {
    id: string;
    label: string;
    title: string;
    url: string;
    isRead: boolean;
    feedId: string;
    nestedLevel: number;
};

const FeedListItem = ({ id, label, title, url, isRead, feedId, nestedLevel }: Props) => {
    const dispatch = useAppDispatch();

    const isSelected = useAppSelector((state) => state.feeds.selectedNode?.nodeId) === id;

    useEffect(() => {
        if (isSelected) {
            setUiActive(true);
        }
    }, [isSelected]);

    const [uiActive, setUiActive] = useState<boolean>(false);
    const [xButtonClicked, setXButtonClicked] = useState(false);

    if ((isRead && !isSelected) || xButtonClicked) {
        return null;
    }

    const handleFeedItemClick = (feedId: string, itemId: string) => {
        dispatch(feedsSlice.actions.select({ nodeType: NodeType.FeedItem, nodeId: id }));

        dispatch(
            feedsSlice.actions.markItemAsRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );
    };

    const handleXButtonClick = (feedId: string, itemId: string) => {
        dispatch(
            feedsSlice.actions.markItemAsRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );

        setXButtonClicked(true);
    };

    return (
        <li
            className={clsx(
                'feed-item',
                nestedLevel > 0 && 'feed-item--indented',
                isSelected && 'feed-item--selected',
                uiActive && 'feed-item--ui-active',
            )}
            style={{ '--item-nested-level': nestedLevel } as React.CSSProperties}
            key={id}
            onClick={() => setUiActive(true)}
            onBlur={() => {
                // TODO mr blur triggers immediatly after selection => fix or remove it? (bookmarks are also not focused after click)
                setUiActive(false);
            }}>
            <div className="feed-item__grid">
                <GlobeSimple size={20} weight="light" />
                <a
                    className="feed-item__link"
                    title={title}
                    href={url}
                    onAuxClick={(e) => {
                        if (e.button === MouseEventButton.middleMousButton) {
                            // mark item as read if middle mouse button is clicked
                            handleFeedItemClick(feedId, id);
                        }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => handleFeedItemClick(feedId, id)}
                    onDragStart={(e) => e.preventDefault()}>
                    {label}
                </a>
                <Button
                    className="feed-item__remove-button"
                    title="Mark as Read"
                    onClick={() => handleXButtonClick(feedId, id)}>
                    <X size={20} weight="bold" />
                </Button>
            </div>
        </li>
    );
};

const MemoizedFeedListItem = memo(FeedListItem);

if (process.env.MODE === 'dev') {
    MemoizedFeedListItem.whyDidYouRender = true;
}

export { MemoizedFeedListItem as FeedListItem };
