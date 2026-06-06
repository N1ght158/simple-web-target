export function fetchWithCsrf(csrfToken, input, init = {}) {
  const headers = new Headers(init.headers ?? {});
  if (csrfToken) {
    headers.set("x-csrf-token", csrfToken);
  }
  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}
