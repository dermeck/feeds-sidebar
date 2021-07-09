import { Feed, FeedItem } from "../store/slices/feeds";
import FeedParser, { Item } from "feedparser";

const parseFeed = async (input: {
  feedUrl: string;
  feedData: string;
}): Promise<Feed> => {
  const parser = new FeedParser({});
  const parsedFeed: Feed = {
    id: input.feedUrl,
    url: input.feedUrl,
    items: [],
  };

  return new Promise((resolve, reject) => {
    parser.on("meta", () => {
      parsedFeed.title = parser.meta.title || "";
      parsedFeed.link = parser.meta.link || "";
    });

    parser.on("readable", () => {
      let item: Item;

      while ((item = parser.read())) {
        parsedFeed.items.push(mapFeedItem(item));
      }
    });

    parser.on("error", (e: Error) => {
      reject(e);
    });

    parser.write(input.feedData);

    parser.end(() => {
      resolve(parsedFeed);
    });
  });
};

const mapFeedItem = (item: Item): FeedItem => ({
  id: item.guid || item.link,
  url: item.link,
  title: item.title,
  published: item.pubdate || undefined,
  lastModified: item.date || undefined,
});

export default parseFeed;
