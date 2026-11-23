// Description OpenAPI 3.0 de l'API REST. Elle est servie telle quelle sur
// /api/v1/openapi.json et lue par la page /api-docs.
const json = (schema: object) => ({ "application/json": { schema } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const error = { description: "Error", content: json(ref("Error")) };

const body = (schema: object) => ({
  required: true,
  content: json(schema),
});

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "TemkiLab API",
    version: "1.0.0",
    description:
      "REST API over the same business services as the web interface. Mobile clients sign in with POST /auth/token and send the returned token as `Authorization: Bearer <token>`. Browsers may read with their session cookie, but every write request requires a bearer token (CSRF protection). Permissions are enforced server-side exactly as in the UI. Add your own resources under `paths` and `components.schemas`.",
  },
  servers: [{ url: "/api/v1" }],
  security: [{ bearerAuth: [] }, { sessionCookie: [] }],
  paths: {
    "/auth/token": {
      post: {
        summary: "Sign in (mobile): exchange email and password for a token",
        security: [],
        requestBody: body({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
            deviceName: { type: "string", maxLength: 60 },
          },
        }),
        responses: {
          "200": {
            description: "Token valid for 30 days",
            content: json(ref("TokenResponse")),
          },
          "401": error,
          "429": error,
        },
      },
      delete: {
        summary: "Sign out: revoke the token used for this request",
        responses: { "204": { description: "Token revoked" }, "401": error },
      },
    },
    "/me": {
      get: {
        summary: "Current user",
        responses: {
          "200": {
            description: "The signed-in user",
            content: json(ref("User")),
          },
          "401": error,
        },
      },
    },
    "/me/avatar": {
      put: {
        summary: "Set the profile picture (256 px JPEG/PNG/WebP data URL)",
        requestBody: body({
          type: "object",
          required: ["dataUrl"],
          properties: { dataUrl: { type: "string" } },
        }),
        responses: {
          "200": { description: "Saved" },
          "401": error,
          "422": error,
        },
      },
      delete: {
        summary: "Remove the profile picture",
        responses: { "204": { description: "Removed" }, "401": error },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer" },
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "authjs.session-token",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              fields: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          expiresAt: { type: "string", format: "date-time" },
          user: ref("User"),
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
} as const;
