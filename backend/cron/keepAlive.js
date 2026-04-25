const DEFAULT_TIMEOUT_MS = 15000;

const routesToPing = ["/", "/healthz"];

const getRandomRoute = () => {
  const idx = Math.floor(Math.random() * routesToPing.length);
  return routesToPing[idx];
};

const normalizeBaseUrl = (value = "") => value.replace(/\/+$/, "");

const run = async () => {
  const baseUrl = normalizeBaseUrl(process.env.BACKEND_BASE_URL || "");
  if (!baseUrl) {
    console.error("Missing BACKEND_BASE_URL environment variable.");
    process.exitCode = 1;
    return;
  }

  const route = getRandomRoute();
  const pingUrl = `${baseUrl}${route}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(pingUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "farmxpress-keep-alive/1.0",
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
