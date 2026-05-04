import "server-only";

import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/ts-client";
import {
  createApiBuilderFromCtpClient,
  type ApiRoot,
  type ByProjectKeyRequestBuilder,
} from "@commercetools/platform-sdk";

const REQUIRED_ENV = [
  "CTP_API_URL",
  "CTP_AUTH_URL",
  "CTP_CLIENT_ID",
  "CTP_CLIENT_SECRET",
  "CTP_PROJECT_KEY",
  "CTP_SCOPES",
] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV)[number];

export class MissingCommercetoolsCredentialsError extends Error {
  constructor(public readonly missing: RequiredEnvKey[]) {
    super(
      `commercetools credentials missing: ${missing.join(", ")}. ` +
        `Set these env vars on the Netlify site or in .env.local for local dev.`,
    );
    this.name = "MissingCommercetoolsCredentialsError";
  }
}

export function hasCommercetoolsCredentials(): boolean {
  return REQUIRED_ENV.every((key) => Boolean(process.env[key]));
}

function buildApi(): ByProjectKeyRequestBuilder {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) throw new MissingCommercetoolsCredentialsError(missing);

  const auth: AuthMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL!,
    projectKey: process.env.CTP_PROJECT_KEY!,
    credentials: {
      clientId: process.env.CTP_CLIENT_ID!,
      clientSecret: process.env.CTP_CLIENT_SECRET!,
    },
    scopes: process.env.CTP_SCOPES!.split(/\s+/).filter(Boolean),
    httpClient: fetch,
  };
  const httpCfg: HttpMiddlewareOptions = {
    host: process.env.CTP_API_URL!,
    httpClient: fetch,
  };
  const client = new ClientBuilder()
    .withClientCredentialsFlow(auth)
    .withHttpMiddleware(httpCfg)
    .build();
  const root: ApiRoot = createApiBuilderFromCtpClient(client);
  return root.withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY! });
}

let _api: ByProjectKeyRequestBuilder | null = null;
export function api(): ByProjectKeyRequestBuilder {
  return (_api ??= buildApi());
}
