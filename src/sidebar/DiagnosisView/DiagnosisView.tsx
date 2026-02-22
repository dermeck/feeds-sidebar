import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFeedsCommand, selectFeeds } from '../../store/slices/feeds';

type Props = {
    onClose: () => void;
};

export const DiagnosisView = ({ onClose }: Props) => {
    const dispatch = useAppDispatch();

    const feedStatus = useAppSelector((s) => s.session.feedStatus);
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));

    // Group errored feeds first
    const errored = feedStatus.filter((f) => f.status === 'error');
    const others = feedStatus.filter((f) => f.status !== 'error');

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
                                const lastFetchedStr = lastFetched ? new Date(lastFetched).toLocaleString() : '—';

                                return (
                                    <li key={entry.url} className="diagnosis__row diagnosis__row--error">
                                        <div className="diagnosis__name">
                                            <div className="diagnosis__title">{title}</div>
                                            <div className="diagnosis__lastfetched">Last fetch: {lastFetchedStr}</div>
                                        </div>
                                        <div className="diagnosis__status">{entry.status}</div>
                                        <button
                                            className="button diagnosis__retry"
                                            onClick={() => dispatch(fetchFeedsCommand([entry.url]))}>
                                            Retry
                                        </button>
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

                            return (
                                <li key={entry.url} className="diagnosis__row">
                                    <div className="diagnosis__name">
                                        <div className="diagnosis__title">{title}</div>
                                        <div className="diagnosis__lastfetched">Last fetch: {lastFetchedStr}</div>
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

export default DiagnosisView;
