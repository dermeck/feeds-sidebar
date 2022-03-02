import feedsSlice, { FeedSliceState } from '../feeds';

describe('addFeed action', () => {
    it('adds the feed', () => {
        const prevState: FeedSliceState = {
            ...feedsSlice.getInitialState(),
            feeds: [],
        };

        const action = feedsSlice.actions.addFeed({
            id: 'feedId1',
            url: 'http://feedId1.url',
            items: [
                {
                    id: 'http://feedId1.url/item1',
                    url: 'http://feedId1.url/item1',
                    title: 'item1',
                },
            ],
        });

        expect(feedsSlice.reducer(prevState, action).feeds).toEqual([
            {
                id: 'feedId1',
                url: 'http://feedId1.url',
                items: [
                    {
                        id: 'http://feedId1.url/item1',
                        url: 'http://feedId1.url/item1',
                        title: 'item1',
                    },
                ],
            },
        ]);
    });
});
