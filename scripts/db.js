import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let sessionChangeListeners = [];
let sb = null;

function setSession(session, setCookie) {
  if (session) {
    let expire = new Date();
    expire.setTime(expire.getTime() + 1000 * session.expires_in);
    setCookie("session = " + JSON.stringify(session) + "; expires = " + expire.toUTCString())
  } else {
    setCookie("session = ; expires = Thu, 01 Jan 1970 00:00:00 GMT");
  }
  sessionChangeListeners.forEach((listener) => listener(session));
}

export function addSessionChangeListener(listener, cookie) {
  const session = getSession(cookie);
  sessionChangeListeners.push(listener);
  if (session) {
    listener(session);
  }
}

export function getSession(cookie) {
  if (cookie) {
    const cookies = cookie.split(';');
    const sessionCookie = cookies[0];

    if (!sessionCookie) return null;
    const session = sessionCookie.split('=')[1];

    return JSON.parse(session);
  } else {
    return null;
  }
}

export function getSB() {
  return sb;
}

export function initDB(setCookie) {
  console.log("setting sb")
  sb = createClient(supabaseUrl, supabaseAnonKey);

  sb.auth.getSession().then(({ data: { session } }) => {
    setSession(session, setCookie);
  });

  // onAuthStateChange will run whenever the user logs in or logs out
  sb.auth.onAuthStateChange((event, session) => {
    setSession(session, setCookie);
  });
}