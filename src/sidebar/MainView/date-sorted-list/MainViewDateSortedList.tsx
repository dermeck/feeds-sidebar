import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';
import { Expander } from '../../../base-components/Expander/Expander';
import { DateSortedFeedItems, getDateSortedFeedItems } from './dateSortedFeedItems';

type Section = keyof DateSortedFeedItems;

interface MainViewPlainListProps {
    className: string;
    filterString: string;
}

const getItemLabel = (item: FeedListItemModel) => `${item.parentTitle ? `${item.parentTitle} | ` : ''}${item.title}`;

export const MainViewDateSortedList = ({ className, filterString }: MainViewPlainListProps) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const [expandedSections, setExpandedSections] = useState<Section[]>([
        'today',
        'yesterday',
        'lastWeek',
        'older',
        'unknown',
    ]);
    const sortedFeeds: DateSortedFeedItems = useMemo(() => {
        return getDateSortedFeedItems(feeds);
    }, [feeds]);

    const isExpanded = useCallback((section: Section) => expandedSections.includes(section), [expandedSections]);

    const toggleExpand = useCallback(
        (section: Section) => {
            if (expandedSections.includes(section)) {
                setExpandedSections(expandedSections.filter((x) => x !== section));
            } else {
                setExpandedSections([...expandedSections, section]);
            }
        },
        [expandedSections],
    );

    return (
        <div className={className}>
            <Expander title="Today" expanded={isExpanded('today')} onClick={() => toggleExpand('today')}>
                <FeedItemList
                    items={sortedFeeds.today}
                    filterString={filterString}
                    getItemLabel={(item) => getItemLabel(item)}
                />
            </Expander>
            <Expander title="Yesterday" expanded={isExpanded('yesterday')} onClick={() => toggleExpand('yesterday')}>
                <FeedItemList
                    items={sortedFeeds.yesterday}
                    filterString={filterString}
                    getItemLabel={(item) => getItemLabel(item)}
                />
            </Expander>
            <Expander title="Last Week" expanded={isExpanded('lastWeek')} onClick={() => toggleExpand('lastWeek')}>
                <FeedItemList
                    items={sortedFeeds.lastWeek}
                    filterString={filterString}
                    getItemLabel={(item) => getItemLabel(item)}
                />
            </Expander>
            <Expander title="Older" expanded={isExpanded('older')} onClick={() => toggleExpand('older')}>
                <FeedItemList
                    items={sortedFeeds.older}
                    filterString={filterString}
                    getItemLabel={(item) => getItemLabel(item)}
                />
            </Expander>

            {sortedFeeds.unknown.length > 0 && (
                <Expander title="Unknown" expanded={isExpanded('unknown')} onClick={() => toggleExpand('unknown')}>
                    <FeedItemList
                        items={sortedFeeds.unknown}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </Expander>
            )}
        </div>
    );
};
