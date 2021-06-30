import FeedMe, {
  Feed as FeedMeResult,
  FeedItem as FeedMeFeedItem,
  FeedObject,
} from "feedme";
import { Feed, FeedItem, FeedType } from "../store/slices/feeds";

const mapAtomFeed = (parserResult: FeedMeResult): Feed => {
  return {
    type: FeedType.atom,
    title:
      typeof parserResult.title === "string" ? parserResult.title : undefined,
    id: typeof parserResult.id === "string" ? parserResult.id : undefined,
    url: mapAtomLink(parserResult.link),
    items: mapAtomFeedItems(parserResult.items),
  };
};

const mapAtomLink = (linkData: FeedObject | FeedObject[]): string => {
  // TODO cleanup this method

  // console.log("mapAtomLink", linkData);

  if (typeof linkData === "string") {
    return linkData;
  }

  if (Array.isArray(linkData)) {
    const result = linkData.find(
      (x) =>
        typeof x !== "string" && x.type === "text/html" && x.rel === "alternate"
    );

    if (typeof result === "object") {
      if (result.href !== undefined && typeof result.href === "string")
        return result.href;
    }
  } else {
    if (typeof linkData === "object") {
      if (linkData.href !== undefined && typeof linkData.href === "string")
        return linkData.href;
    }
  }

  throw new Error("atom link not found");
};

const mapAtomFeedItems = (
  items: ReadonlyArray<FeedMeFeedItem>
): Array<FeedItem> => {
  return items.map((x) => {
    return {
      title: x.title as string, // TODO type this properly
      url: mapAtomLink(x.link),
    };
  });
};

const parseFeed = async (feed: string): Promise<Feed> => {
  const parser = new FeedMe(true);

  return new Promise((resolve, reject) => {
    parser.on("finish", () => {
      const parserResult = parser.done();

      if (parserResult === undefined) {
        return;
      }

      const feedType = parserResult.type;

      switch (feedType) {
        case FeedType.atom:
          const mappedFeed = mapAtomFeed(parserResult);
          console.log("mappedAtomFeed", mappedFeed);

          resolve(mappedFeed);
          return;
        case FeedType.rss1:
        case FeedType.rss2:
        case FeedType.json:
          // TODO parse other feed types
          // console.log("feed type not yet supported: ", feedType);

          reject();
        default:
          console.log("unknown feed type: ", feedType);
      }
    });

    parser.on("error", () => {
      reject();
      console.error("Error while parsing feed");
    });

    parser.write(feed);
    parser.end();
  });
};

export default parseFeed;
