const DEFAULT_TIMEOUT_MS = 60000;
const KEEP_ALIVE_ROUTE = "/keepalive";

const normalizeBaseUrl = (value = "") => value.replace(/\/+$/, "");

const run = async () => {
  const baseUrl = normalizeBaseUrl(process.env.BACKEND_BASE_URL || "");
  if (!baseUrl) {
    console.error("Missing BACKEND_BASE_URL environment variable.");
    process.exitCode = 1;
    return;
  }

  const pingUrl = `${baseUrl}${KEEP_ALIVE_ROUTE}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(pingUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "cargomatch-keep-alive/1.0",
      },
    });

    console.log(
      `[keep-alive] Pinged ${pingUrl} -> ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`[keep-alive] Failed to ping ${pingUrl}:`, error.message);
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
  }
};

run();
