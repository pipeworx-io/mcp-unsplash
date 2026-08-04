# @pipeworx/unsplash

[Unsplash](https://unsplash.com/documentation) MCP — photo search, photos, users, collections. Free demo key 50 req/hr (production approval = 5000/hr).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Unsplash data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
