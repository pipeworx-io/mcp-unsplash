# @pipeworx/unsplash

[Unsplash](https://unsplash.com/documentation) MCP — photo search, photos, users, collections. Free demo key 50 req/hr (production approval = 5000/hr).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1558+ live data sources.

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

Both URLs reach the same gateway and the same 1558+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

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

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-unsplash
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

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
