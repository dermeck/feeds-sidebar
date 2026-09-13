import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../../store/hooks';
import { AccordionCard } from '../../../base-components/AccordionCard/AccordionCard';
import { DateSortedFeedItems, getDateSortedFeedItems } from './dateSortedFeedItems';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';

interface MainViewPlainListProps {
    className: string;
    filterString: string;
}

const getItemLabel = (item: FeedListItemModel) => `${item.parentTitle ? `${item.parentTitle} | ` : ''}${item.title}`;

const dayLabel = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

const monthLabel = (key: string) =>
    new Date(`${key}-01T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

export const MainViewDateSortedList = ({ className, filterString }: MainViewPlainListProps) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const [expandedSections, setExpandedSections] = useState<string[]>(['today', 'yesterday']);
    const sortedFeeds: DateSortedFeedItems = useMemo(() => {
        return getDateSortedFeedItems(feeds);
    }, [feeds]);

    const isExpanded = useCallback((key: string) => expandedSections.includes(key), [expandedSections]);

    const toggleExpand = useCallback(
        (key: string) => {
            if (expandedSections.includes(key)) {
                setExpandedSections(expandedSections.filter((x) => x !== key));
            } else {
                setExpandedSections([...expandedSections, key]);
            }
        },
        [expandedSections],
    );

    const renderFeedItems = (items: FeedListItemModel[]) => (
        <FeedItemList items={items} filterString={filterString} getItemLabel={(item) => getItemLabel(item)} />
    );

    return (
        <div className={clsx(className, 'date-sorted-list')}>
            {sortedFeeds.today.length > 0 && (
                <AccordionCard title="Today" expanded={isExpanded('today')} onClick={() => toggleExpand('today')}>
                    {renderFeedItems(sortedFeeds.today)}
                </AccordionCard>
            )}
            {sortedFeeds.yesterday.length > 0 && (
                <AccordionCard
                    title="Yesterday"
                    expanded={isExpanded('yesterday')}
                    onClick={() => toggleExpand('yesterday')}
                >
                    {renderFeedItems(sortedFeeds.yesterday)}
                </AccordionCard>
            )}
            {sortedFeeds.days.map((group) => (
                <AccordionCard
                    key={group.date}
                    title={dayLabel(group.date)}
                    expanded={isExpanded(group.date)}
                    onClick={() => toggleExpand(group.date)}
                >
                    {renderFeedItems(group.items)}
                </AccordionCard>
            ))}
            {sortedFeeds.months.map((group) => (
                <AccordionCard
                    key={group.date}
                    title={monthLabel(group.date)}
                    expanded={isExpanded(group.date)}
                    onClick={() => toggleExpand(group.date)}
                >
                    {renderFeedItems(group.items)}
                </AccordionCard>
            ))}

            {sortedFeeds.unknown.length > 0 && (
                <AccordionCard title="Unknown" expanded={isExpanded('unknown')} onClick={() => toggleExpand('unknown')}>
                    {renderFeedItems(sortedFeeds.unknown)}
                </AccordionCard>
            )}
        </div>
    );
};
