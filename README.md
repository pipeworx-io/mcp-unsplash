# @pipeworx/unsplash

[Unsplash](https://unsplash.com/documentation) MCP — photo search, photos, users, collections. Free demo key 50 req/hr (production approval = 5000/hr).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1857+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

## Auth

- Platform: `PLATFORM_UNSPLASH_KEY`. BYO: `?_apiKey=…` (Unsplash access key).

## Tools

- `search_photos(query, page?, per_page?, order_by?, collections?, content_filter?, color?, orientation?)` — photo search
- `photo(id)` — single photo
- `photo_random(query?, count?, collections?, topics?, username?, orientation?, content_filter?)` — random photo(s)
- `photo_download(id)` — download tracker URL (use the returned `url`)
- `photo_statistics(id, resolution?, quantity?)` — usage stats
- `list_photos(page?, per_page?, order_by?)` — editorial feed
- `user(username)` — user profile
- `user_photos(username, page?, per_page?, order_by?, stats?, resolution?, quantity?, orientation?)` — user's photos
- `user_likes(username, page?, per_page?, order_by?, orientation?)` — user's liked photos
- `collections(page?, per_page?)` — list collections
- `collection(id)` — single collection
- `collection_photos(id, page?, per_page?, orientation?)` — photos in collection
- `topics(ids?, page?, per_page?, order_by?)` — topics
- `topic(id_or_slug)` — single topic
- `topic_photos(id_or_slug, page?, per_page?, orientation?, order_by?)` — photos in topic

## Data source

`https://api.unsplash.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "unsplash": {
      "url": "https://gateway.pipeworx.io/unsplash/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/unsplash/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1857+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/search_photos \
  -H 'Content-Type: application/json' \
  -d '{"query":"mountain landscape"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/search_photos`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-unsplash` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/unsplash/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "unsplash": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-unsplash"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Unsplash data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
