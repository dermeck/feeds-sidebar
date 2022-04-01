import { Feed } from '../model/feeds';

export const readOpmlFile = async (file: File): Promise<ReadonlyArray<Feed> | undefined> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
        reader.onload = async () => {
            const fileContent = reader.result as string;
            resolve(parseXml(fileContent));
        };

        reader.readAsText(file);
    });
};

const parseXml = (fileContent: string): ReadonlyArray<Feed> | undefined => {
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
