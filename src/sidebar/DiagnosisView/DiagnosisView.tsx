import { CaretLeft } from '@phosphor-icons/react';

import React, { useMemo } from 'react';

import { Button } from '../../base-components/Button/Button';
import { Badge, BadgeVariant } from '../../base-components/Badge/Badge';
import { Header } from '../../base-components/Header/Header';
import { Feed, FeedItem, itemDate } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand, selectFeeds } from '../../store/slices/feeds';
import { selectOptions } from '../../store/slices/options';
import { FeedFetchStatus } from '../../store/slices/session';

type Props = {
    onClose: () => void;
};

type DiagnosisEntry = {
    url: string;
    feed?: Feed;
    status?: FeedFetchStatus;
};

const formatDaysAgo = (value?: Date | string) => {
    if (value === undefined) return '—';
    const t = value instanceof Date ? value.valueOf() : Date.parse(value);
    if (Number.isNaN(t)) return '—';
    const days = Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
    if (days <= 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
};

const getLatestItem = (feed?: Feed): FeedItem | undefined => {
    let latest = 0;
    let latestItem: FeedItem | undefined;

    for (const item of feed?.items ?? []) {
        const date = itemDate(item);
        if (date === undefined) continue;
        if (date.valueOf() > latest) {
            latest = date.valueOf();
            latestItem = item;
        }
    }

    return latestItem;
};

const DiagnosisRow = (props: { entry: DiagnosisEntry; status: string; variant?: BadgeVariant; children?: React.ReactNode }) => {
    const { entry, status, variant, children } = props;
    const latestItem = getLatestItem(entry.feed);
    const latestItemDate = latestItem === undefined ? undefined : itemDate(latestItem);

    return (
        <li className="diagnosis-view__row">
            <div className="diagnosis-view__row-header">
                <span className="diagnosis-view__feed-title">{entry.feed?.title ?? entry.url}</span>
                <Badge variant={variant} className="diagnosis-view__status">{status}</Badge>
            </div>
            <div className="diagnosis-view__detail">Last fetch: {formatDaysAgo(entry.feed?.lastFetched)}</div>
            <div className="diagnosis-view__detail">
                Latest item: {formatDaysAgo(latestItemDate)}{' '}
                {latestItem && (
                    <a
                        className="diagnosis-view__latest-link"
                        href={latestItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {latestItem.title ?? latestItem.url}
                    </a>
                )}
            </div>
            {children && <div className="diagnosis-view__actions">{children}</div>}
        </li>
    );
};

export const DiagnosisView = ({ onClose }: Props) => {
    const dispatch = useAppDispatch();

    const feedStatus = useAppSelector((state) => state.session.feedStatus);
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const options = useAppSelector(selectOptions);

    // all subscribed feeds are listed, feedStatus only holds entries of the current session
    // (it can also contain urls without a corresponding feed, e.g. recently added and never fetched successfully)
    const entries: ReadonlyArray<DiagnosisEntry> = useMemo(() => {
        const subscribed = feeds.map((feed) => ({
            url: feed.id,
            feed,
            status: feedStatus.find((entry) => entry.url === feed.id)?.status,
        }));

        const withoutFeed = feedStatus
            .filter((entry) => !feeds.some((feed) => feed.id === entry.url))
            .map((entry) => ({ url: entry.url, status: entry.status }));

        return [...subscribed, ...withoutFeed];
    }, [feeds, feedStatus]);

    const errored = entries.filter((entry) => entry.status === 'error');

    const thresholdMs = (options.diagnosisInactiveDays ?? 60) * 24 * 60 * 60 * 1000;
    const nowMs = Date.now();

    const inactive = entries.filter((entry) => {
        if (entry.status === 'error') return false; // already in errored
        const feed = entry.feed;
        if (!feed) return true; // treat unknown feed as inactive

        // a feed without items is only inactive if it was fetched in this session,
        // otherwise it is not fetched yet
        if (feed.items.length === 0) return entry.status !== undefined;

        const hasRecentItem = feed.items.some((item) => {
            const date = itemDate(item);
            if (date === undefined) return false;
            return nowMs - date.valueOf() <= thresholdMs;
        });

        return !hasRecentItem;
    });

    const others = entries.filter(
        (entry) => !errored.some((e) => e.url === entry.url) && !inactive.some((i) => i.url === entry.url),
    );

    const removeFeed = (url: string, message: string) => {
        if (window.confirm(message)) {
            dispatch(feedsSlice.actions.deleteFeed({ url }));
        }
    };

    return (
        <div className="diagnosis-view">
            <Header>
                <Button variant="toolbar" title="Back to Feed List" onClick={onClose}>
                    <CaretLeft size={20} />
                </Button>
                <h1 className="diagnosis-view__title">Diagnosis</h1>
            </Header>

            <div className="diagnosis-view__content">
                {errored.length > 0 && (
                    <section className="diagnosis-view__section diagnosis-view__section--error">
                        <h2 className="diagnosis-view__section-heading">Feeds with errors</h2>
                        <ul className="diagnosis-view__list">
                            {errored.map((entry) => (
                                <DiagnosisRow key={entry.url} entry={entry} status={entry.status ?? ''} variant="error">
                                    <Button onClick={() => dispatch(fetchFeedsCommand([entry.url]))}>Retry</Button>
                                    <Button
                                        className="diagnosis-view__remove-button"
                                        onClick={() => removeFeed(entry.url, 'Remove this feed from subscriptions?')}
                                    >
                                        Remove
                                    </Button>
                                </DiagnosisRow>
                            ))}
                        </ul>
                    </section>
                )}

                {inactive.length > 0 && (
                    <section className="diagnosis-view__section diagnosis-view__section--inactive">
                        <h2 className="diagnosis-view__section-heading">Inactive feeds</h2>
                        <ul className="diagnosis-view__list">
                            {inactive.map((entry) => (
                                <DiagnosisRow key={entry.url} entry={entry} status="inactive" variant="warning">
                                    <Button
                                        className="diagnosis-view__remove-button"
                                        onClick={() =>
                                            removeFeed(entry.url, 'Remove this inactive feed from subscriptions?')
                                        }
                                    >
                                        Remove
                                    </Button>
                                </DiagnosisRow>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="diagnosis-view__section">
                    <h2 className="diagnosis-view__section-heading">Other feeds</h2>
                    <ul className="diagnosis-view__list">
                        {others.map((entry) => (
                            <DiagnosisRow key={entry.url} entry={entry} status={entry.status ?? 'not fetched yet'} />
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};
