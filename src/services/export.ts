import { encode } from 'html-entities';

import { Feed, Folder, rootFolderId } from '../model/feeds';

export const exportedOwnerId = 'https://addons.mozilla.org/en-US/firefox/addon/feeds-sidebar/';

const exportFilename = 'feeds-sidebar-export.opml';

const opmlExport = (folders: ReadonlyArray<Folder>, feeds: ReadonlyArray<Feed>): void => {
    const { xmlDoc, bodyNode } = createBaseDocument();

    const rootFolder = folders.find((x) => x.id === rootFolderId);

    if (rootFolder === undefined) {
        throw new Error('root folder must be defined');
    }

    rootFolder.subfolderIds.forEach((subfolderId) => {
        const subfolder = findSubfolder(folders, subfolderId);

        appendFolderNode(xmlDoc, bodyNode, subfolder, folders, feeds);
    });

    appendFeedNodes(xmlDoc, bodyNode, rootFolder.feedIds, feeds);

    const xmlString = new XMLSerializer().serializeToString(xmlDoc);

    triggerDownload(new Blob([xmlString], { type: 'text/xml' }));
};

function findSubfolder(folders: readonly Folder[], subfolderId: string) {
    const subfolder = folders.find((folder) => folder.id === subfolderId);

    if (subfolder === undefined) {
        throw new Error(`Subfolder with id: ${subfolderId} not found.`);
    }
    return subfolder;
}

const createBaseDocument = () => {
    const xmlDoc = document.implementation.createDocument(null, 'opml');

    const pi = xmlDoc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
    xmlDoc.insertBefore(pi, xmlDoc.firstChild);

    const rootNode = xmlDoc.getElementsByTagName('opml')[0];
    rootNode.setAttribute('version', '1.0');

    const headNode = xmlDoc.createElement('head');
    appendHeadNode(xmlDoc, headNode, 'title', 'Feeds Sidebar Export');
    appendHeadNode(xmlDoc, headNode, 'dateCreated', new Date().toLocaleDateString());
    appendHeadNode(xmlDoc, headNode, 'ownerId', exportedOwnerId);
    appendHeadNode(xmlDoc, headNode, 'docs', 'http://opml.org/spec2.opml');

    rootNode.appendChild(headNode);

    const bodyNode = xmlDoc.createElement('body');
    rootNode.appendChild(bodyNode);

    return { xmlDoc, bodyNode };
};

const appendHeadNode = (xmlDoc: XMLDocument, headNode: HTMLHeadElement, tag: string, textContent: string) => {
    const node = xmlDoc.createElement(tag);
    const textNode = xmlDoc.createTextNode(textContent);
    node.appendChild(textNode);

    headNode.appendChild(node);
};

const appendFolderNode = (
    xmlDoc: XMLDocument,
    rootNode: Element,
    folder: Folder,
    folders: ReadonlyArray<Folder>,
    feeds: ReadonlyArray<Feed>,
) => {
    const folderNode = xmlDoc.createElement('outline');
    folderNode.setAttribute('text', encode(folder.title));
    folderNode.setAttribute('id', encode(folder.id));

    folder.subfolderIds.forEach((subfolderId) => {
        const subfolder = findSubfolder(folders, subfolderId);
        appendFolderNode(xmlDoc, folderNode, subfolder, folders, feeds);
    });

    appendFeedNodes(xmlDoc, folderNode, folder.feedIds, feeds);

    rootNode.appendChild(folderNode);
};

const appendFeedNodes = (
    xmlDoc: XMLDocument,
    folderNode: Element,
    feedIds: ReadonlyArray<string>,
    feeds: ReadonlyArray<Feed>,
) =>
    feedIds.forEach((feedId) => {
        const feed = feeds.find((feed) => feed.id === feedId);

        if (feed === undefined) {
            throw new Error(`Feed with id: ${feedId} not found.`);
        }

        appendFeedNode(xmlDoc, folderNode, feed);
    });

const appendFeedNode = (xmlDoc: XMLDocument, rootNode: Element, feed: Feed) => {
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
