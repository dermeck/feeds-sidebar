import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';
import { AccordionCard } from '../../../base-components/AccordionCard/AccordionCard';
import { DateSortedFeedItems, getDateSortedFeedItems } from './dateSortedFeedItems';

type Section = keyof DateSortedFeedItems;

interface MainViewPlainListProps {
    className: string;
    filterString: string;
}

const getItemLabel = (item: FeedListItemModel) => `${item.parentTitle ? `${item.parentTitle} | ` : ''}${item.title}`;

export const MainViewDateSortedList = ({ className, filterString }: MainViewPlainListProps) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const [expandedSections, setExpandedSections] = useState<Section[]>(['today', 'yesterday']);
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
            {sortedFeeds.today.length > 0 && (
                <AccordionCard
                    title="Today"
                    count={sortedFeeds.today.length}
                    expanded={isExpanded('today')}
                    onClick={() => toggleExpand('today')}
                >
                    <FeedItemList
                        items={sortedFeeds.today}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </AccordionCard>
            )}
            {sortedFeeds.yesterday.length > 0 && (
                <AccordionCard
                    title="Yesterday"
                    count={sortedFeeds.yesterday.length}
                    expanded={isExpanded('yesterday')}
                    onClick={() => toggleExpand('yesterday')}
                >
                    <FeedItemList
                        items={sortedFeeds.yesterday}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </AccordionCard>
            )}
            {sortedFeeds.lastWeek.length > 0 && (
                <AccordionCard
                    title="Last Week"
                    count={sortedFeeds.lastWeek.length}
                    expanded={isExpanded('lastWeek')}
                    onClick={() => toggleExpand('lastWeek')}
                >
                    <FeedItemList
                        items={sortedFeeds.lastWeek}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </AccordionCard>
            )}
            {sortedFeeds.older.length > 0 && (
                <AccordionCard
                    title="Older"
                    count={sortedFeeds.older.length}
                    expanded={isExpanded('older')}
                    onClick={() => toggleExpand('older')}
                >
                    <FeedItemList
                        items={sortedFeeds.older}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </AccordionCard>
            )}

            {sortedFeeds.unknown.length > 0 && (
                <AccordionCard
                    title="Unknown"
                    count={sortedFeeds.unknown.length}
                    expanded={isExpanded('unknown')}
                    onClick={() => toggleExpand('unknown')}
                >
                    <FeedItemList
                        items={sortedFeeds.unknown}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(item)}
                    />
                </AccordionCard>
            )}
        </div>
    );
};
