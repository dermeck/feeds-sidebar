**API Contract**

This doc describes the messaging contract between content scripts / pageAction, the background proxy, and the canonical Redux store. See the implementations for the canonical source:

- [src/store/reduxBridge/messaging.ts](src/store/reduxBridge/messaging.ts#L1-L43)
- [src/store/reduxBridge/wrapStore.ts](src/store/reduxBridge/wrapStore.ts#L1-L73)
- [src/store/reduxBridge/utils/changeUtils.ts](src/store/reduxBridge/utils/changeUtils.ts#L1-L43)
- [src/background/background.ts](src/background/background.ts#L1-L140)
- [src/services/feedDetection/feedDetection.ts](src/services/feedDetection/feedDetection.ts#L1-L20)
- [src/services/persistence.ts](src/services/persistence.ts#L1-L36)

---

**Quick startup handshake (summary)**

1. Content script initializes and sends `GetFullStateRequest` to request the current `RootState`.
2. Background responds with `GetFullStateResponse` payloading the full `RootState`.
3. Content scripts apply that initial state locally and listen for `PatchState` messages to stay in sync.

Notes: during background init incoming messages are buffered and replayed into `wrapStore` (see [background.ts](src/background/background.ts#L1-L140)).

---

**Message Types**

| MessageType                                            |                              Direction | Payload                                                                       | Response / Notes                                                                                                                                                                                                                   |
| ------------------------------------------------------ | -------------------------------------: | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DispatchAction` (`msg-dispatch`)                      |            content-script → background | `{ action: UnknownAction }`                                                   | Background will `dispatch` the action to the canonical store. See [`messaging.ts`](src/store/reduxBridge/messaging.ts#L1-L43) and [`wrapStore.ts`](src/store/reduxBridge/wrapStore.ts#L1-L73).                                     |
| `GetFullStateRequest` (`msg-request-state`)            |            content-script → background | none                                                                          | Background replies with `GetFullStateResponse` containing the full `RootState`.                                                                                                                                                    |
| `GetFullStateResponse` (`msg-full-state`)              |           background → content-scripts | `RootState`                                                                   | Initial full state used by proxies.                                                                                                                                                                                                |
| `PatchState` (`msg-patch-state`)                       |           background → content-scripts | `Changes` (`updatedProperties: {key,value}[]`, `deletedProperties: string[]`) | Shallow root-level diff applied by proxies; nested objects are replaced, not deeply merged. See [`changeUtils.ts`](src/store/reduxBridge/utils/changeUtils.ts#L1-L43).                                                             |
| `StartFeedDetection` (`msg-page-start-feed-detection`) |       background → page/content script | `{ url: string }`                                                             | Triggers feed detection in the page. Background retries once on common "no receiver" error. See [`background.ts`](src/background/background.ts#L1-L140).                                                                           |
| `FeedsDetected` (`msg-page-feeds-detected`)            | pageAction/content-script → background | `{ url: string; feeds: DetectedFeed[] }`                                      | Background maps this to a session action (`sessionSlice.actions.feedsDetected`). `DetectedFeed` is `{ type: string; href: string; title: string }` (see [`feedDetection.ts`](src/services/feedDetection/feedDetection.ts#L1-L20)). |
| `LogMessage` (`msg-log`)                               | pageAction/content-script → background | `{ message: string; data: unknown }`                                          | Logged in background for debugging.                                                                                                                                                                                                |

---

**Patch payload shape**

The `PatchState` payload uses the `Changes` type:

- `updatedProperties: { key: string; value: unknown }[]`
- `deletedProperties: string[]`

Proxies should apply this with `applyChanges(oldState, changes)` from [`changeUtils.ts`](src/store/reduxBridge/utils/changeUtils.ts#L1-L43).

Example (pseudo-code for a content script):

```ts
import { applyChanges } from './utils/changeUtils'; // local copy in proxy

let currentState = {} as RootState;

function handleMessage(message: BackgroundScriptMessage) {
  if (message.type === MessageType.GetFullStateResponse) {
    currentState = message.payload; // set initial state
  } else if (message.type === MessageType.PatchState) {
    currentState = applyChanges(currentState, message.payload);
  }
}
```

Important caveat: the `PatchState` diff is shallow at the root level. If a nested object changes, its whole value is replaced in `updatedProperties`.

---

**Persistence keys & load/save semantics**

- Keys used in `persistence.ts`: `feedsKey`, `optionsKey`, `timestampKey`. See [src/services/persistence.ts](src/services/persistence.ts#L1-L36).
- `saveState(state)` writes `feeds` and `options` plus a timestamp.
- `loadState()` returns `{ feeds, options, session, timestamp } | undefined` — it returns `undefined` if either persisted feeds or options are missing.

---

**Behavioral notes and recommended patterns**

- The background is the canonical store; content scripts are thin proxies that request full state then consume patches.
- `browser.runtime.sendMessage(...)` returns a Promise — callers should handle rejections. The background code treats the specific message `"Could not establish connection. Receiving end does not exist."` as a transient condition and may retry (see [background.ts](src/background/background.ts#L1-L140)).
- When adding new message types, add them to `MessageType` and handle them in `wrapStore` and the content-script side.

