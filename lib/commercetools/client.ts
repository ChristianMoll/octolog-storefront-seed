const authUrl = process.env.CTP_AUTH_URL;
const apiUrl = process.env.CTP_API_URL;
const projectKey = process.env.CTP_PROJECT_KEY;
const clientId = process.env.CTP_CLIENT_ID;
const clientSecret = process.env.CTP_CLIENT_SECRET;
const scopes = process.env.CTP_SCOPES;

type Token = { access_token: string; expires_at: number };
let cachedToken: Token | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now() + 30_000) {
    return cachedToken.access_token;
  }

  if (!authUrl || !clientId || !clientSecret || !projectKey) {
    throw new Error('Commercetools env vars are not configured');
  }

  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  if (scopes) body.set('scope', scopes);

  const res = await fetch(`${authUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`commercetools auth failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    access_token: json.access_token,
    expires_at: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.access_token;
}

export type CTPRequestInit = Omit<RequestInit, 'headers' | 'body'> & {
  query?: Record<string, string | number | boolean | undefined | null | string[]>;
  body?: unknown;
  revalidate?: number | false;
};

export async function ctpFetch<T>(path: string, init: CTPRequestInit = {}): Promise<T> {
  if (!apiUrl || !projectKey) {
    throw new Error('Commercetools env vars are not configured');
  }
  const token = await getAccessToken();

  const url = new URL(`${apiUrl}/${projectKey}${path}`);
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        for (const item of v) url.searchParams.append(k, String(item));
      } else {
        url.searchParams.append(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  let body: BodyInit | undefined;
  if (init.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(init.body);
  }

  const next =
    init.revalidate === false
      ? { revalidate: 0 as const }
      : { revalidate: init.revalidate ?? 60 };

  const fetchInit: RequestInit = { ...init, headers, body };
  (fetchInit as RequestInit & { next?: { revalidate?: number } }).next = next;
  const res = await fetch(url.toString(), fetchInit);
  if (!res.ok) {
    throw new Error(`commercetools ${path} failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}
