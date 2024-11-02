import { GlobeSimple, PlusCircle, MinusCircle } from 'phosphor-react';
import React from 'react';
import { useAppSelector } from '../../../store/hooks';

export const DetectedFeeds = ({
    addNewFeed,
    removeFeed,
}: {
    addNewFeed: (url: string) => void;
    removeFeed: (url: string) => void;
}) => {
    const detectedFeeds = useAppSelector((state) => state.session.detectedFeeds);
    const feeds = useAppSelector((state) => state.feeds.feeds);

    return (
        <>
            <label className="subscribe-view__section-heading">Detected Feeds</label>
            <ul className="detected-feeds-list">
                {detectedFeeds.map((feed) => {
                    return (
                        <li className="detected-feed" key={feed.href}>
                            <div className="detected-feed-icon">
                                <GlobeSimple size={20} weight="light" />
                            </div>
                            <label className="detected-feed-label">{feed.title}</label>
                            <button className="button detected-feed-action">
                                {feeds.find((x) => x.id === feed.href) !== undefined ? (
                                    <MinusCircle size={20} weight="bold" onClick={() => removeFeed(feed.href)} />
                                ) : (
                                    <PlusCircle size={20} weight="bold" onClick={() => addNewFeed(feed.href)} />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
