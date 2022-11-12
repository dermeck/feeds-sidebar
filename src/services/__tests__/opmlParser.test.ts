import { rootFolderId } from '../../model/feeds';
import { parseOpml } from '../opmlParser';

const opmlFixture = (bodyXml: string) => {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <opml version="1.0">
        <head>
            <title>
                Feeds Sidebar Export
            </title>
            <dateCreated>
                11/2/2022
            </dateCreated>
            <ownerId>
                https://addons.mozilla.org/en-US/firefox/addon/feeds-sidebar/
            </ownerId>
            <docs>
                http://opml.org/spec2.opml
            </docs>
        </head>
        <body>
            ${bodyXml}
        </body>
    </opml>
    `;
};

const bodyFixture = `
<outline text="folder 1" id="folder1_id">
    <outline text="folder 1.1" id="folder11_id">
        <outline text="folder 1.1.1" id="folder111_id" />
        <outline type="rss" title="feed 1" text="feed 1" xmlUrl="feed1_url" />
    </outline>
    <outline type="rss" title="feed 2" text="feed 2" xmlUrl="feed2_url" />
</outline>
<outline text="folder 2" id="folder2_id">
    <outline type="rss" title="feed 3" text="feed 3" xmlUrl="feed3_url" />
</outline>
<outline type="rss" title="feed 4" text="feed 4" xmlUrl="feed4_url" />
<outline type="rss" title="feed 5" text="feed 5" xmlUrl="feed5_url" />
`;

describe('parseOpml', () => {
    describe('if opml file was exported from this extension', () => {
        it('returns feeds and folder structure', () => {
            const expectation: ReturnType<typeof parseOpml> = {
                feeds: [
                    { id: 'feed1_url', url: 'feed1_url', items: [] },
                    { id: 'feed2_url', url: 'feed2_url', items: [] },
                    { id: 'feed3_url', url: 'feed3_url', items: [] },
                    { id: 'feed4_url', url: 'feed4_url', items: [] },
                    { id: 'feed5_url', url: 'feed5_url', items: [] },
                ],
                folders: [
                    {
                        id: rootFolderId,
                        title: 'root',
                        subfolderIds: ['folder1_id', 'folder2_id'],
                        feedIds: ['feed4_url', 'feed5_url'],
                    },
                    { id: 'folder1_id', title: 'folder 1', subfolderIds: ['folder11_id'], feedIds: ['feed2_url'] },
                    { id: 'folder11_id', title: 'folder 1.1', subfolderIds: ['folder111_id'], feedIds: ['feed1_url'] },
                    { id: 'folder111_id', title: 'folder 1.1.1', subfolderIds: [], feedIds: [] },
                    { id: 'folder2_id', title: 'folder 2', subfolderIds: [], feedIds: ['feed3_url'] },
                ],
            };

            expect(parseOpml(opmlFixture(bodyFixture))).toStrictEqual(expectation);
        });

        it('returns a single feed and root folder if only one feed outline exists (xmlUrl is missing)', () => {
            const expectation: ReturnType<typeof parseOpml> = {
                feeds: [{ id: 'feed1_url', url: 'feed1_url', items: [] }],
                folders: [
                    {
                        id: rootFolderId,
                        title: 'root',
                        subfolderIds: [],
                        feedIds: ['feed1_url'],
                    },
                ],
            };

            expect(
                parseOpml(
                    opmlFixture('<outline type="rss" title="feed 1" text="feed 1" xmlUrl="feed1_url" />            '),
                ),
            ).toStrictEqual(expectation);
        });

        it('returns a single folder in the root folder and its content if only one folder outline exists top level', () => {
            const body = `
            <outline text="folder 1" id="folder1_id">
                <outline text="folder 1.1" id="folder11_id" />
                <outline type="rss" title="feed 1" text="feed 1" xmlUrl="feed1_url" />
            </outline>`;

            const expectation: ReturnType<typeof parseOpml> = {
                feeds: [{ id: 'feed1_url', url: 'feed1_url', items: [] }],
                folders: [
                    {
                        id: rootFolderId,
                        title: 'root',
                        subfolderIds: ['folder1_id'],
                        feedIds: [],
                    },
                    { id: 'folder1_id', title: 'folder 1', subfolderIds: ['folder11_id'], feedIds: ['feed1_url'] },
                    { id: 'folder11_id', title: 'folder 1.1', subfolderIds: [], feedIds: [] },
                ],
            };

            expect(parseOpml(opmlFixture(body))).toStrictEqual(expectation);
        });
    });

    describe('if opml was not exported from this extension', () => {
        it.todo('returns only feeds');
    });
});
