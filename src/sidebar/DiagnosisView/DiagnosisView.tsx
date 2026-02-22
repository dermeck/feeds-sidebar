import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFeedsCommand, selectFeeds } from '../../store/slices/feeds';
import { selectOptions } from '../../store/slices/options';
import feedsSlice from '../../store/slices/feeds';
import { Feed, FeedItem } from '../../model/feeds';

type Props = {
    onClose: () => void;
};

export const DiagnosisView = ({ onClose }: Props) => {
    const dispatch = useAppDispatch();

    const feedStatus = useAppSelector((s) => s.session.feedStatus);
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));

    const errored = feedStatus.filter((f) => f.status === 'error');

    const options = useAppSelector(selectOptions);
    const INACTIVE_DAYS = options.diagnosisInactiveDays ?? 60;
    const nowMs = Date.now();
    const thresholdMs = INACTIVE_DAYS * 24 * 60 * 60 * 1000;

    const inactive = feedStatus.filter((entry) => {
        if (entry.status === 'error') return false; // already in errored
        const feed = feeds.find((f) => f.id === entry.url);
        if (!feed) return true; // treat unknown feed as inactive

        // if feed has no items it's inactive
        if (!feed.items || feed.items.length === 0) return true;

        // check if any item is newer than threshold
        const hasRecentItem = feed.items.some((item) => {
            const dateStr = item.published ?? item.lastModified;
            if (!dateStr) return false;
            const t = Date.parse(dateStr);
            if (isNaN(t)) return false;
            return nowMs - t <= thresholdMs;
        });

        return !hasRecentItem;
    });

    const others = feedStatus.filter(
        (f) => !errored.some((e) => e.url === f.url) && !inactive.some((i) => i.url === f.url),
    );

    const formatDaysAgo = (iso?: string) => {
        if (!iso) return '—';
        const t = Date.parse(iso);
        if (isNaN(t)) return '—';
        const diff = Date.now() - t;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        if (days <= 0) return 'today';
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

    const getLatestItem = (feed?: Feed | undefined): FeedItem | undefined => {
        if (!feed || !feed.items || feed.items.length === 0) return undefined;
        let latest = 0;
        let latestItem: FeedItem | undefined;
        for (const item of feed.items) {
            const dateStr = item.published ?? item.lastModified;
            if (!dateStr) continue;
            const t = Date.parse(dateStr);
            if (isNaN(t)) continue;
            if (t > latest) {
                latest = t;
                latestItem = item;
            }
        }
        return latestItem;
    };

    return (
        <div className="diagnosis__container">
            <div className="diagnosis__header">
                <h2>Diagnosis</h2>
                <button className="button" onClick={onClose} aria-label="Close Diagnosis">
                    Close
                </button>
            </div>

            <div className="diagnosis__list">
                {errored.length > 0 && (
                    <section className="diagnosis__section diagnosis__section--errors">
                        <h3 className="diagnosis__section-title">Feeds with errors</h3>
                        <ul>
                            {errored.map((entry) => {
                                const feed = feeds.find((f) => f.id === entry.url);
                                const title = feed?.title ?? entry.url;
                                const lastFetched = feed?.lastFetched;
                                const lastFetchedStr = formatDaysAgo(lastFetched);
                                const latestItem = getLatestItem(feed);
                                const latestIso = latestItem
                                    ? (latestItem.published ?? latestItem.lastModified)
                                    : undefined;
                                const latestStr = formatDaysAgo(latestIso);

                                return (
                                    <li key={entry.url} className="diagnosis__row diagnosis__row--error">
                                        <div className="diagnosis__name">
                                            <div className="diagnosis__title">{title}</div>
                                            <div className="diagnosis__lastfetched">Last fetch: {lastFetchedStr}</div>
                                            <div className="diagnosis__latestitem">
                                                Latest item: {latestStr}{' '}
                                                {latestItem && (
                                                    <a
                                                        className="diagnosis__latestlink"
                                                        href={latestItem.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {latestItem.title ?? latestItem.url}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="diagnosis__status">{entry.status}</div>
                                        <div className="diagnosis__actions">
                                            <button
                                                className="button diagnosis__retry"
                                                onClick={() => dispatch(fetchFeedsCommand([entry.url]))}>
                                                Retry
                                            </button>
                                            <button
                                                className="button diagnosis__remove"
                                                onClick={() => {
                                                    if (window.confirm('Remove this feed from subscriptions?')) {
                                                        dispatch(feedsSlice.actions.deleteFeed({ url: entry.url }));
                                                    }
                                                }}>
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                {inactive.length > 0 && (
                    <section className="diagnosis__section diagnosis__section--inactive">
                        <h3 className="diagnosis__section-title">Inactive feeds</h3>
                        <ul>
                            {inactive.map((entry) => {
                                const feed = feeds.find((f) => f.id === entry.url);
                                const title = feed?.title ?? entry.url;
                                const lastFetched = feed?.lastFetched;
                                const lastFetchedStr = formatDaysAgo(lastFetched);
                                const latestItem = getLatestItem(feed);
                                const latestIso = latestItem
                                    ? (latestItem.published ?? latestItem.lastModified)
                                    : undefined;
                                const latestStr = formatDaysAgo(latestIso);

                                return (
                                    <li key={entry.url} className="diagnosis__row diagnosis__row--inactive">
                                        <div className="diagnosis__name">
                                            <div className="diagnosis__title">{title}</div>
                                            <div className="diagnosis__lastfetched">Last fetch: {lastFetchedStr}</div>
                                            <div className="diagnosis__latestitem">
                                                Latest item: {latestStr}{' '}
                                                {latestItem && (
                                                    <a
                                                        className="diagnosis__latestlink"
                                                        href={latestItem.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {latestItem.title ?? latestItem.url}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="diagnosis__status">inactive</div>
                                        <div className="diagnosis__actions">
                                            <button
                                                className="button diagnosis__remove"
                                                onClick={() => {
                                                    if (
                                                        window.confirm('Remove this inactive feed from subscriptions?')
                                                    ) {
                                                        dispatch(feedsSlice.actions.deleteFeed({ url: entry.url }));
                                                    }
                                                }}>
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}

                <section className="diagnosis__section">
                    <h3 className="diagnosis__section-title">Other feeds</h3>
                    <ul>
                        {others.map((entry) => {
                            const feed = feeds.find((f) => f.id === entry.url);
                            const title = feed?.title ?? entry.url;
                            const lastFetched = feed?.lastFetched;
                            const lastFetchedStr = lastFetched ? new Date(lastFetched).toLocaleString() : '—';
                            const latestItem = getLatestItem(feed);
                            const latestIso = latestItem
                                ? (latestItem.published ?? latestItem.lastModified)
                                : undefined;
                            const latestStr = formatDaysAgo(latestIso);

                            return (
                                <li key={entry.url} className="diagnosis__row">
                                    <div className="diagnosis__name">
                                        <div className="diagnosis__title">{title}</div>
                                        <div className="diagnosis__lastfetched">Last fetch: {lastFetchedStr}</div>
                                        <div className="diagnosis__latestitem">
                                            Latest item: {latestStr}{' '}
                                            {latestItem && (
                                                <a
                                                    className="diagnosis__latestlink"
                                                    href={latestItem.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    {latestItem.title ?? latestItem.url}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="diagnosis__status">{entry.status}</div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </div>
        </div>
    );
};
