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

const mapAtomLink = (
  linkData: FeedObject | FeedObject[]
): string | undefined => {
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

    return undefined;
  }
};

const mapAtomFeedItems = (
  items: ReadonlyArray<FeedMeFeedItem>
): ReadonlyArray<FeedItem> => {
  return items.map((x) => {
    return {
      title: x.title as string, // TODO type this properly
      url: mapAtomLink(x.link),
    };
  });
};

const parseFeed = (feed: string) => {
  const parser = new FeedMe(true);

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

        return;
      case FeedType.rss1:
      case FeedType.rss2:
      case FeedType.json:
      // TODO parse other feed types
      // console.log("feed type not yet supported: ", feedType);

      default:
        console.log("unknown feed type: ", feedType);
    }
  });

  parser.on("error", () => {
    console.error("Error while parsing feed");
  });

  parser.write(feed);
  parser.end();

  // TODO move to middleware and dispatch action with result
};

export default parseFeed;
