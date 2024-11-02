import { GlobeSimple, X } from 'phosphor-react';

import React, { memo, useEffect, useState } from 'react';

import { NodeType } from '../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import feedsSlice from '../../../store/slices/feeds';
import { MouseEventButton } from '../../../utils/types/web-api';
import { Button } from '../../../base-components/Button/Button';
import { clsx } from 'clsx';

interface Props {
    id: string;
    label: string;
    title: string;
    url: string;
    isRead: boolean;
    feedId: string;
    indented: boolean;
    nestedLevel: number;
}

export const FeedItem = (props: Props) => {
    const dispatch = useAppDispatch();

    const isSelected = useAppSelector((state) => state.feeds.selectedNode?.nodeId) === props.id;

    useEffect(() => {
        if (isSelected) {
            setUiActive(true);
        }
    }, [isSelected]);

    const [uiActive, setUiActive] = useState<boolean>(false);
    const [xButtonClicked, setXButtonClicked] = useState(false);

    if ((props.isRead && !isSelected) || xButtonClicked) {
        return null;
    }

    const handleFeedItemClick = (feedId: string, itemId: string) => {
        dispatch(feedsSlice.actions.select({ nodeType: NodeType.FeedItem, nodeId: props.id }));

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
                props.indented && 'feed-item--indented',
                isSelected && 'feed-item--selected',
                uiActive && 'feed-item--ui-active',
            )}
            style={{ '--item-nested-level': props.nestedLevel } as React.CSSProperties}
            key={props.id}
            onClick={() => setUiActive(true)}
            onBlur={() => {
                // TODO mr blur triggers immediatly after selection => fix or remove it? (bookmarks are also not focused after click)
                setUiActive(false);
            }}>
            <div className="feed-item__grid">
                <GlobeSimple size={20} weight="light" />
                <a
                    className="feed-item__link"
                    title={props.title}
                    href={props.url}
                    onAuxClick={(e) => {
                        if (e.button === MouseEventButton.middleMousButton) {
                            // mark item as read if middle mouse button is clicked
                            handleFeedItemClick(props.feedId, props.id);
                        }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => handleFeedItemClick(props.feedId, props.id)}
                    onDragStart={(e) => e.preventDefault()}>
                    {props.label}
                </a>
                <Button
                    className="feed-item__remove-button"
                    title="Mark as Read"
                    onClick={() => handleXButtonClick(props.feedId, props.id)}>
                    <X size={20} weight="bold" />
                </Button>
            </div>
        </li>
    );
};

const MemoizedFeedItem = memo(FeedItem);

if (process.env.MODE === 'dev') {
    MemoizedFeedItem.whyDidYouRender = true;
}

export default MemoizedFeedItem;