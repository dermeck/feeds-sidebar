import { Feed } from '../store/slices/feeds';

export const readOpmlFile = async (file: File): Promise<ReadonlyArray<Feed>> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
        reader.onload = async () => {
            const fileContent = reader.result as string;
            resolve(parseXml(fileContent));
        };

        reader.readAsText(file);
    });
};

const parseXml = (fileContent: string): ReadonlyArray<Feed> => {
    const parsedFeeds: Feed[] = [];
    const parser = new DOMParser();

    const xml = parser.parseFromString(fileContent, 'application/xml');

    xml.querySelectorAll('outline[xmlUrl]').forEach((feedNode) => {
        const id = feedNode.getAttribute('text');
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
