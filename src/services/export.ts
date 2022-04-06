import { encode } from 'html-entities';

import { Feed } from '../model/feeds';

const exportFilename = 'ytrss-export.opml';

const opmlExport = (feeds: ReadonlyArray<Feed>): void => {
    const { xmlDoc, bodyNode } = createBaseDocument();

    feeds.map((feed) => {
        addFeedNode(xmlDoc, bodyNode, feed);
    });

    const xmlString = new XMLSerializer().serializeToString(xmlDoc);

    triggerDownload(new Blob([xmlString], { type: 'text/xml' }));
};

const createBaseDocument = () => {
    const xmlDoc = document.implementation.createDocument(null, 'opml');

    const pi = xmlDoc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
    xmlDoc.insertBefore(pi, xmlDoc.firstChild);

    const rootNode = xmlDoc.getElementsByTagName('opml')[0];
    rootNode.setAttribute('version', '1.0');

    const headNode = xmlDoc.createElement('head');
    headNode.setAttribute('title', 'YTRSS Export');
    headNode.setAttribute('dateCreated', new Date().toLocaleDateString());
    rootNode.appendChild(headNode);

    const bodyNode = xmlDoc.createElement('body');
    rootNode.appendChild(bodyNode);

    return { xmlDoc, bodyNode };
};

const addFeedNode = (xmlDoc: XMLDocument, rootNode: Element, feed: Feed) => {
    const feedNode = xmlDoc.createElement('outline');
    feedNode.setAttribute('type', 'rss');
    feedNode.setAttribute('title', encode(feed.title));
    feedNode.setAttribute('text', encode(feed.title));
    feedNode.setAttribute('xmlUrl', encode(feed.url));

    rootNode.appendChild(feedNode);
};

const triggerDownload = (content: Blob) => {
    const link = document.createElement('a');

    link.href = URL.createObjectURL(content);
    link.download = exportFilename;
    link.click();
};

export default opmlExport;
