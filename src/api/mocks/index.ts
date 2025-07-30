import type { Plugin } from "vite";
import type { IncomingMessage } from "http";
import { resolve as mockResolver } from "./resolver";

// Helper to read the body from Node's IncomingMessage
async function getRequestBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function mockApiPlugin(): Plugin {
  return {
    name: "mock-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/api")) {
          try {
            const fullUrl = new URL(
              req.url,
              `http://${req.headers.host || "localhost"}`,
            );
            const body = await getRequestBody(req);

            // Create a standard Request object
            const request = new Request(fullUrl.href, {
              method: req.method,
              headers: req.headers as HeadersInit,
              body: body.length > 0 ? body : undefined,
            });

            const mockResponse = await mockResolver(request);

            res.statusCode = mockResponse.status;
            mockResponse.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            res.end(await mockResponse.text());
          } catch (e) {
            console.error("Mock API Error:", e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Mock API failed" }));
          }
        } else {
          next();
        }
      });
    },
  };
}
