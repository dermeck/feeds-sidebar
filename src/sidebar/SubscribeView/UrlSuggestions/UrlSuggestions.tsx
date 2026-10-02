import { GlobeSimple, MinusCircle, PlusCircle } from '@phosphor-icons/react';

import React from 'react';

import { useAppSelector } from '../../../store/hooks';
import { DetectedFeed } from '../../../services/feedDetection/feedDetection';

export const UrlSuggestions = ({
    suggestions,
    addNewFeed,
    removeFeed,
}: {
    suggestions: ReadonlyArray<DetectedFeed>;
    addNewFeed: (url: string) => void;
    removeFeed: (url: string) => void;
}) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <>
            <label className="subscribe-view__section-heading">Suggested Feeds</label>
            <ul className="detected-feeds-list">
                {suggestions.map((feed) => {
                    const labelText = feed.title === '' ? feed.href : feed.title;

                    return (
                        <li className="detected-feed" key={feed.href}>
                            <div className="detected-feed-icon">
                                <GlobeSimple size={20} weight="light" />
                            </div>
                            <label title={labelText} className="detected-feed-label">
                                {labelText}
                            </label>
                            <button
                                className="button detected-feed-action"
                                title={feed.href}
                                onClick={() =>
                                    feeds.find((x) => x.id === feed.href) !== undefined
                                        ? removeFeed(feed.href)
                                        : addNewFeed(feed.href)
                                }
                            >
                                {feeds.find((x) => x.id === feed.href) !== undefined ? (
                                    <MinusCircle size={20} weight="bold" />
                                ) : (
                                    <PlusCircle size={20} weight="bold" />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};