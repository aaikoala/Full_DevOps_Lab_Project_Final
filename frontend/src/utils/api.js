//Get the active session of the browser
export function getSession() {
  //get the raw JSON string
  const raw = localStorage.getItem("session");
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    //Checks if object exists and has token
    if (!session) return null;
    if (!session.token) return null;
    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//If an user is currently logged in 
export async function apiFetch(url, options) {
  const opts = options || {};
  const headers = opts.headers || {};

  //Checks active session
  const session = getSession();
  if (session) {
    //Add a token for authentification
    headers.Authorization = "Bearer " + session.token;
  }

  //Execute the fetch request
  return fetch(url, {
    ...opts,
    headers: headers
  });
}
