import { encode } from 'html-entities';

import { Feed } from '../store/slices/feeds';

const exportFilename = 'ytrss-export.xml';

const opmlExport = (feeds: ReadonlyArray<Feed>): void => {
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><body>
    ${feeds.map(createOutlineForFeed).join('\n')}
    </body></opml>`;

    triggerDownload(new Blob([xmlString], { type: 'text/xml' }));
};

const createOutlineForFeed = (feed: Feed): string =>
    `<outline text="${encode(feed.title)}" xmlUrl="${encode(feed.url)}" />`;

const triggerDownload = (content: Blob) => {
    const link = document.createElement('a');

    link.href = URL.createObjectURL(content);
    link.download = exportFilename;
    link.click();

    document.removeChild(link);
};

export default opmlExport;
