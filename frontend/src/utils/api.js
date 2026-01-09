export function getSession() {
  const raw = localStorage.getItem("session");
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (!session) return null;
    if (!session.token) return null;
    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function apiFetch(url, options) {
  const opts = options || {};
  const headers = opts.headers || {};

  const session = getSession();
  if (session) {
    headers.Authorization = "Bearer " + session.token;
  }

  return fetch(url, {
    ...opts,
    headers: headers
  });
}
