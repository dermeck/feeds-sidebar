import { Warning, Spinner, Check } from '@phosphor-icons/react';

import React, { FunctionComponent } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';

interface Props {
    newFeedUrls: ReadonlyArray<string>;
}

export const NewFeedsList: FunctionComponent<Props> = (props: Props) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const feedStatus = useAppSelector((state) => state.session.feedStatus);

    return (
        <>
            <label className="subscribe-view__section-heading">Recently added Feeds</label>
            {props.newFeedUrls.length > 0 && (
                <ul className="subscribe-view__new-feeds-list">
                    {props.newFeedUrls.map((newFeedUrl) => {
                        const status = feedStatus.find((s) => s.url === newFeedUrl)?.status;

                        if (status === undefined) {
                            return;
                        }

                        switch (status) {
                            case 'loading':
                                return (
                                    <li className="subscribe-view__new-feeds-list-item" key={newFeedUrl}>
                                        <Spinner size={18} />
                                        loading...
                                    </li>
                                );

                            case 'loaded': {
                                const loadedFeed = feeds.find((f) => f.id === newFeedUrl);
                                if (loadedFeed !== undefined) {
                                    return (
                                        <li className="subscribe-view__new-feeds-list-item" key={newFeedUrl}>
                                            <Check size={18} />
                                            {loadedFeed.title}
                                        </li>
                                    );
                                } else {
                                    return <li>{newFeedUrl}</li>;
                                }
                            }

                            case 'error':
                                return (
                                    <li className="subscribe-view__new-feeds-list-item" key={newFeedUrl}>
                                        <Warning size={18} /> {newFeedUrl}
                                    </li>
                                );

                            default:
                                throw new UnreachableCaseError(status);
                        }
                    })}
                </ul>
            )}
        </>
    );
};
