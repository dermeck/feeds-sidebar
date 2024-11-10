import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';
import { Expander } from '../../../base-components/Expander/Expander';
import { clsx } from 'clsx';

type Section = keyof DateSortedFeedItems;

type DateSortedFeedItems = {
    today: FeedListItemModel[];
    yesterday: FeedListItemModel[];
    lastWeek: FeedListItemModel[];
    older: FeedListItemModel[];
    unknown: FeedListItemModel[];
};

interface MainViewPlainListProps {
    show: boolean;
    filterString: string;
    // expandedSections: Section[];
    //onSectionClick: (section: Section) => void;
}

const getItemLabel = (item: FeedListItemModel) => `${item.parentTitle ? `${item.parentTitle} | ` : ''}${item.title}`;

type DateComparisonResult = 'equal' | 'before' | 'after';

const compareDateDayMonthYear = (date1: Date, date2: Date): DateComparisonResult => {
    if (
        date1.getDay() === date2.getDay() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    ) {
        return 'equal';
    }

    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);

    if (date1 <= date2) {
        return 'before';
    }

    return 'after';
};

export const MainViewDateSortedList = ({ show, filterString }: MainViewPlainListProps) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const [expandedSections, setExpandedSections] = useState<Section[]>([
        'today',
        'yesterday',
        'lastWeek',
        'older',
        'unknown',
    ]);
    const sortedFeeds: DateSortedFeedItems = useMemo(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const result: DateSortedFeedItems = {
            today: [],
            yesterday: [],
            lastWeek: [],
            older: [],
            unknown: [],
        };
        for (const feed of feeds) {
            for (const feedItem of feed.items) {
                if (!feedItem.isRead) {
                    const itemDateString = feedItem.lastModified ?? feedItem.published;
                    if (!itemDateString) {
                        result.unknown.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    } else {
                        const itemDate = new Date(itemDateString);
                        if (compareDateDayMonthYear(today, itemDate) === 'equal') {
                            result.today.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }

                        if (compareDateDayMonthYear(yesterday, itemDate) === 'equal') {
                            result.yesterday.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }

                        if (compareDateDayMonthYear(lastWeek, itemDate) === 'before') {
                            result.lastWeek.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        } else {
                            result.older.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }
                    }
                }
            }
        }
        console.log(result);
        return result;
    }, [feeds]);

    const isExpanded = useCallback(
        (section: Section) => {
            console.log('isExpanded', expandedSections.includes(section));
            return expandedSections.includes(section);
        },
        [expandedSections],
    );

    const toggleExpand = useCallback(
        (section: Section) => {
            console.log('toggleExpand', section, expandedSections);
            if (expandedSections.includes(section)) {
                setExpandedSections(expandedSections.filter((x) => x !== section));
            } else {
                setExpandedSections([...expandedSections, section]);
            }
        },
        [expandedSections],
    );

    // TODO mr add expander with child prop
    return (
        <div className={clsx(!show && 'view-hidden')}>
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
