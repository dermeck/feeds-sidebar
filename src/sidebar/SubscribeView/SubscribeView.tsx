import { ArrowLeft } from '@phosphor-icons/react';

import React, { RefObject, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand } from '../../store/slices/feeds';
import { NewFeedsList } from './NewFeedsList/NewFeedsList';
import { DetectedFeeds } from './DetectedFeeds/DetectedFeeds';
import { Button } from '../../base-components/Button/Button';
import { Header } from '../../base-components/Header/Header';
import { clsx } from 'clsx';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import M from 'moz-button';
const isValidURL = (str: string) => {
    const res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
    );
    return res !== null;
};

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
        if (!isValidURL(newFeedUrl)) {
            setNewFeedUrlMessage('The ented URL is invalid.');
            return;
        }

        const existingFeed = feeds.find((x) => x.id === newFeedUrl);

        if (existingFeed === undefined) {
            addNewFeed(newFeedUrl);
        } else {
            setNewFeedUrlMessage(`You are already subscribed to that feed (${existingFeed.title})`);
        }
    };

    return (
        <div className="subscribe-view">
            <Header>
                <Button variant="toolbar" title="Back to Feed List" onClick={props.onClose}>
                    <ArrowLeft size={22} />
                </Button>
                <M>moep</M>

                <h1 className="subscribe-view__title">Add New Feed</h1>
            </Header>
            <div className="subscribe-view__content">
                <form
                    className="subscribe-view__add-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addFeed();
                    }}>
                    <label className="subscribe-view__section-heading">Feed URL</label>
                    <input
                        className="text-input"
                        ref={props.urlInputRef}
                        placeholder="https://blog.mozilla.org/en/feed/"
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                        onFocus={() => setNewFeedUrlMessage('')}
                    />
                    <Button type="submit" className="subscribe-view__add-button">
                        Add New Feed
                    </Button>
                </form>
                <div
                    className={clsx(
                        'subscribe-view__message-box',
                        newFeedUrlMessage !== '' && 'subscribe-view__message-box--visible',
                    )}>
                    {newFeedUrlMessage}
                </div>
                {feedDetectionEnabled && <DetectedFeeds addNewFeed={addNewFeed} removeFeed={removeFeed} />}
                <NewFeedsList newFeedUrls={addedFeedUrls} />
            </div>
        </div>
    );
};
