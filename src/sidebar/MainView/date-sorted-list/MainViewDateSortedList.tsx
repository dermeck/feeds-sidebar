import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../../store/hooks';
import { Card } from '../../../base-components/Card/Card';
import { DateSortedFeedItems, getDateSortedFeedItems } from './dateSortedFeedItems';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';
import { EmptyListMessage } from '../EmptyListMessage';

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

    const filteredFeeds = useMemo(() => {
        const matchesFilter = (items: FeedListItemModel[]) =>
            items.filter((item) => !item.isRead && item.title?.toLowerCase().includes(filterString.toLowerCase()));
        return {
            today: matchesFilter(sortedFeeds.today),
            yesterday: matchesFilter(sortedFeeds.yesterday),
            days: sortedFeeds.days.map((group) => ({ ...group, items: matchesFilter(group.items) })),
            months: sortedFeeds.months.map((group) => ({ ...group, items: matchesFilter(group.items) })),
            unknown: matchesFilter(sortedFeeds.unknown),
        };
    }, [sortedFeeds, filterString]);

    const hasMatchingItems = useMemo(() => {
        return (
            filteredFeeds.today.length > 0 ||
            filteredFeeds.yesterday.length > 0 ||
            filteredFeeds.unknown.length > 0 ||
            filteredFeeds.days.some((group) => group.items.length > 0) ||
            filteredFeeds.months.some((group) => group.items.length > 0)
        );
    }, [filteredFeeds]);

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
            {filteredFeeds.today.length > 0 && (
                <Card
                    type="accordion"
                    title="Today"
                    expanded={isExpanded('today')}
                    onClick={() => toggleExpand('today')}
                >
                    {renderFeedItems(filteredFeeds.today)}
                </Card>
            )}
            {filteredFeeds.yesterday.length > 0 && (
                <Card
                    type="accordion"
                    title="Yesterday"
                    expanded={isExpanded('yesterday')}
                    onClick={() => toggleExpand('yesterday')}
                >
                    {renderFeedItems(filteredFeeds.yesterday)}
                </Card>
            )}
            {filteredFeeds.days.map((group) =>
                group.items.length > 0 ? (
                    <Card
                        type="accordion"
                        key={group.date}
                        title={dayLabel(group.date)}
                        expanded={isExpanded(group.date)}
                        onClick={() => toggleExpand(group.date)}
                    >
                        {renderFeedItems(group.items)}
                    </Card>
                ) : null,
            )}
            {filteredFeeds.months.map((group) =>
                group.items.length > 0 ? (
                    <Card
                        type="accordion"
                        key={group.date}
                        title={monthLabel(group.date)}
                        expanded={isExpanded(group.date)}
                        onClick={() => toggleExpand(group.date)}
                    >
                        {renderFeedItems(group.items)}
                    </Card>
                ) : null,
            )}

            {filteredFeeds.unknown.length > 0 && (
                <Card
                    type="accordion"
                    title="Unknown"
                    expanded={isExpanded('unknown')}
                    onClick={() => toggleExpand('unknown')}
                >
                    {renderFeedItems(filteredFeeds.unknown)}
                </Card>
            )}
            {!hasMatchingItems && <EmptyListMessage filterString={filterString} />}
        </div>
    );
};
