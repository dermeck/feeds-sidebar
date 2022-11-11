import { XMLParser } from 'fast-xml-parser';

import { Feed, Folder, rootFolderId } from '../model/feeds';
import { exportedOwnerId } from './export';

type ParseOPMLResult = { feeds: ReadonlyArray<Feed>; folders: ReadonlyArray<Folder> } | undefined;

type ParsedFeedOutline = {
    type: 'rss';
    title: string;
    text: string;
    xmlUrl: string;
};

type ParsedFolderOutline = {
    text: string;
    id: string;
    outline: ParsedOutline | ParsedOutline[] | undefined;
};

function isParsedFeedOutline(outline: ParsedOutline): outline is ParsedFeedOutline {
    return (outline as ParsedFeedOutline).type !== undefined;
}

type ParsedOutline = ParsedFeedOutline | ParsedFolderOutline;

type ParsedFeedsSidebarOPML = {
    '?xml': {
        version: '1.0';
        encoding: 'UTF-8';
    };
    opml: {
        version: '1.0';

        head: {
            title: 'Feeds Sidebar Export';
            dateCreated: string;
            ownerId: 'https://addons.mozilla.org/en-US/firefox/addon/feeds-sidebar/';
            docs: 'http://opml.org/spec2.opml';
        };
        body: { outline: ParsedOutline };
    };
};

const processOutline = (
    parent: Folder,
    outline: ParsedOutline | ParsedOutline[],
    parsedFeeds: Feed[],
    parsedFolders: Folder[],
) => {
    if (Array.isArray(outline)) {
        outline.forEach((o) => processOutline(parent, o, parsedFeeds, parsedFolders));
    } else {
        if (isParsedFeedOutline(outline)) {
            parsedFeeds.push({
                id: outline.xmlUrl, // TODO do we need the id?
                url: outline.xmlUrl,
                items: [],
            });
            parent.feedIds = [...parent.feedIds, outline.xmlUrl];

            // TODO remove duplicate code
            const idx = parsedFolders.findIndex((x) => x.id === parent.id);
            if (idx === -1) {
                parsedFolders.push(parent);
            } else {
                // replace
                parsedFolders.splice(idx, 1, parent);
            }
        } else {
            const folder: Folder = { id: outline.id, title: outline.text, feedIds: [], subfolderIds: [] };
            parent.subfolderIds = [...parent.subfolderIds, outline.id];

            const idx = parsedFolders.findIndex((x) => x.id === parent.id);
            if (idx === -1) {
                parsedFolders.push(parent);
            } else {
                // replace
                parsedFolders.splice(idx, 1, parent);
            }

            parsedFolders.push(folder);

            if (outline.outline === undefined) {
                return; // folder is empty
            }
            processOutline(folder, outline.outline, parsedFeeds, parsedFolders);
        }
    }
};

const parseOnlyFeeds = (fileContent: string): ReadonlyArray<Feed> | undefined => {
    const parsedFeeds: Feed[] = [];
    const parser = new DOMParser();

    const xml = parser.parseFromString(fileContent, 'application/xml');

    const errorNode = xml.querySelector('parsererror');
    if (errorNode) {
        console.error('error while parsing file: ', errorNode.textContent);
        return undefined;
    }

    xml.querySelectorAll('outline[xmlUrl]').forEach((feedNode) => {
        let id = feedNode.getAttribute('text');
        if (id === null) {
            // use title as fallback if text is not present
            // though it should be there (http://dev.opml.org/spec2.html#textAttribute)
            id = feedNode.getAttribute('title');
        }

        const url = feedNode.getAttribute('xmlUrl');

        if (id !== null && url !== null && !parsedFeeds.some((x) => x.id === id)) {
            parsedFeeds.push({
                id,
                url,
                items: [],
            });
        }
    });

    return parsedFeeds;
};

export const parseFeedsAndFolders = (fileContent: string): ParseOPMLResult => {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: '',
    };

    const parser = new XMLParser(options);
    const parsed = parser.parse(fileContent);

    if (parsed.opml !== undefined && parsed.opml.head !== undefined && parsed.opml.head.ownerId === exportedOwnerId) {
        // process opml that was created by us
        // always replace the complete folder structure
        const outline = (parsed as ParsedFeedsSidebarOPML).opml.body.outline;

        const parsedFolders: Folder[] = [];
        const parsedFeeds: Feed[] = [];
        const rootFolder: Folder = { id: rootFolderId, title: 'root', feedIds: [], subfolderIds: [] };

        processOutline(rootFolder, outline, parsedFeeds, parsedFolders);

        return {
            folders: parsedFolders,
            feeds: parsedFeeds,
        };
    } else {
        // if the imported file was not created by this extension we only extract the feeds
        // this is a lazy mans solution to circumvent potential problems
        // TODO support folder import for files created by others
        const feeds = parseOnlyFeeds(fileContent);

        return feeds ? { folders: [], feeds: feeds } : undefined;
    }
};
