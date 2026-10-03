import { CaretLeft } from '@phosphor-icons/react';

import React, { RefObject, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand } from '../../store/slices/feeds';
import { NewFeedsList } from './NewFeedsList/NewFeedsList';
import { DetectedFeeds } from './DetectedFeeds/DetectedFeeds';
import { Button } from '../../base-components/Button/Button';
import { MessageBar } from '../../base-components/MessageBar/MessageBar';
import { Header } from '../../base-components/Header/Header';
import { TextInput } from '../../base-components/TextInput/TextInput';
import { parseUrl } from '../../services/feedDetection/feedDetection';

interface SubscribeViewProps {
    urlInputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
}

export const SubscribeView = (props: SubscribeViewProps) => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const feedDetectionEnabled = useAppSelector((state) => state.options.feedDetectionEnabled);

    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newFeedUrlMessage, setNewFeedUrlMessage] = useState('');
    const [addedFeedUrls, setAddedFeedUrls] = useState<string[]>([]);

    const addNewFeed = (url: string) => {
        setAddedFeedUrls((oldItems) => (oldItems.includes(url) ? oldItems : [...oldItems, url]));
        dispatch(fetchFeedsCommand([url]));
    };

    const removeFeed = (feedUrl: string) => {
        setAddedFeedUrls((oldItems) => oldItems.filter((x) => x !== feedUrl));
        dispatch(feedsSlice.actions.deleteFeed({ url: feedUrl }));
    };

    const addFeed = () => {
        const url = parseUrl(newFeedUrl);

        if (url === undefined) {
            setNewFeedUrlMessage('The entered URL is invalid.');
            return;
        }

        const feedUrl = newFeedUrl.trim();
        const existingFeed = feeds.find((x) => x.id === feedUrl);

        if (existingFeed === undefined) {
            addNewFeed(feedUrl);
        } else {
            setNewFeedUrlMessage(`You are already subscribed to that feed (${existingFeed.title})`);
        }
    };

    return (
        <div className="subscribe-view">
            <Header>
                <Button variant="toolbar" title="Back to Feed List" onClick={props.onClose}>
                    <CaretLeft size={20} />
                </Button>
                <h1 className="subscribe-view__title">Add New Feed</h1>
            </Header>
            <div className="subscribe-view__content">
                <form
                    className="subscribe-view__add-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addFeed();
                    }}
                >
                    <label className="subscribe-view__section-heading">Feed URL</label>
                    <TextInput
                        label="Feed URL"
                        className="subscribe-view__url-input"
                        ref={props.urlInputRef}
                        placeholder="https://blog.mozilla.org/en/feed/"
                        value={newFeedUrl}
                        onChange={(e) => {
                            setNewFeedUrl(e.target.value);
                            setNewFeedUrlMessage('');
                        }}
                        onFocus={() => setNewFeedUrlMessage('')}
                    />
                    <Button type="submit" className="subscribe-view__add-button">
                        Add New Feed
                    </Button>
                </form>
                {newFeedUrlMessage !== '' && <MessageBar variant="error">{newFeedUrlMessage}</MessageBar>}
                {feedDetectionEnabled && <DetectedFeeds addNewFeed={addNewFeed} removeFeed={removeFeed} />}
                <NewFeedsList newFeedUrls={addedFeedUrls} />
            </div>
        </div>
    );
};
