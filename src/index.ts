interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Unsplash MCP.
 */


const BASE = 'https://api.unsplash.com';
const UA = 'pipeworx-mcp-unsplash/1.0 (+https://pipeworx.io)';

const passthrough = { type: 'object' as const, properties: {}, additionalProperties: true };

const tools: McpToolExport['tools'] = [
  { name: 'search_photos', description: 'Photo search.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: true } },
  { name: 'photo', description: 'Single photo.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'photo_random', description: 'Random photo(s).', inputSchema: passthrough },
  { name: 'photo_download', description: 'Download tracker URL.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'photo_statistics', description: 'Usage stats.', inputSchema: { type: 'object', properties: { id: { type: 'string' }, resolution: { type: 'string' }, quantity: { type: 'number' } }, required: ['id'] } },
  { name: 'list_photos', description: 'Editorial feed.', inputSchema: passthrough },
  { name: 'user', description: 'User profile.', inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
  { name: 'user_photos', description: "User's photos.", inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'], additionalProperties: true } },
  { name: 'user_likes', description: "User's liked photos.", inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'], additionalProperties: true } },
  { name: 'collections', description: 'List collections.', inputSchema: passthrough },
  { name: 'collection', description: 'Single collection.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'collection_photos', description: 'Photos in collection.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: true } },
  { name: 'topics', description: 'Topics list.', inputSchema: passthrough },
  { name: 'topic', description: 'Single topic.', inputSchema: { type: 'object', properties: { id_or_slug: { type: 'string' } }, required: ['id_or_slug'] } },
  { name: 'topic_photos', description: 'Photos in topic.', inputSchema: { type: 'object', properties: { id_or_slug: { type: 'string' } }, required: ['id_or_slug'], additionalProperties: true } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Unsplash requires an access key. Set PLATFORM_UNSPLASH_KEY or pass ?_apiKey=… (free at https://unsplash.com/developers).');
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (k !== '_apiKey' && v != null) p.set(k, String(v));
    const res = await fetch(`${BASE}${path}${[...p].length ? `?${p}` : ''}`, {
      headers: { Accept: 'application/json', 'Accept-Version': 'v1', 'User-Agent': UA, Authorization: `Client-ID ${apiKey}` },
    });
    if (res.status === 401 || res.status === 403) throw new Error('Unsplash: invalid access key.');
    if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') throw new Error('Unsplash: rate limit (demo = 50/hr; apply for production to raise).');
    if (!res.ok) throw new Error(`Unsplash: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'search_photos':
      return get('/search/photos', args);
    case 'photo':
      return get(`/photos/${encodeURIComponent(reqStr('id', '"<id>"'))}`);
    case 'photo_random':
      return get('/photos/random', args);
    case 'photo_download':
      return get(`/photos/${encodeURIComponent(reqStr('id', '"<id>"'))}/download`);
    case 'photo_statistics':
      return get(`/photos/${encodeURIComponent(reqStr('id', '"<id>"'))}/statistics`, { resolution: args.resolution, quantity: args.quantity });
    case 'list_photos':
      return get('/photos', args);
    case 'user':
      return get(`/users/${encodeURIComponent(reqStr('username', '"<user>"'))}`);
    case 'user_photos':
      return get(`/users/${encodeURIComponent(reqStr('username', '"<user>"'))}/photos`, args);
    case 'user_likes':
      return get(`/users/${encodeURIComponent(reqStr('username', '"<user>"'))}/likes`, args);
    case 'collections':
      return get('/collections', args);
    case 'collection':
      return get(`/collections/${encodeURIComponent(reqStr('id', '"<id>"'))}`);
    case 'collection_photos':
      return get(`/collections/${encodeURIComponent(reqStr('id', '"<id>"'))}/photos`, args);
    case 'topics':
      return get('/topics', args);
    case 'topic':
      return get(`/topics/${encodeURIComponent(reqStr('id_or_slug', '"animals"'))}`);
    case 'topic_photos':
      return get(`/topics/${encodeURIComponent(reqStr('id_or_slug', '"animals"'))}/photos`, args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
