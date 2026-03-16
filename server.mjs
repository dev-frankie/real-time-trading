import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const host = process.env.HOSTNAME ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);
const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function safeResolveFromDist(pathname) {
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(distDir, safePath);
}

function sendFile(filePath, res) {
  const ext = extname(filePath);
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  const isAsset = filePath.includes("/assets/");
  const cacheControl = isAsset
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
  });
  createReadStream(filePath).pipe(res);
}

const server = createServer((req, res) => {
  const requestPath = (req.url ?? "/").split("?")[0] || "/";
  const filePath = safeResolveFromDist(requestPath === "/" ? "index.html" : requestPath);

  try {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      sendFile(filePath, res);
      return;
    }
  } catch {
    // Fall through to SPA fallback.
  }

  if (!existsSync(indexPath)) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Missing dist/index.html");
    return;
  }

  sendFile(indexPath, res);
});

server.listen(port, host, () => {
  process.stdout.write(`Static server running at http://${host}:${port}\n`);
});
