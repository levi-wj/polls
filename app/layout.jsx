'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import Auth from '@/components/Auth.jsx';
import { getSession, initDB, addSessionChangeListener } from 'scripts/db';

export default function RootLayout({ children }) {
  let [session, setSession] = useState(getSession(document.cookie));

  useEffect(() => {
    initDB(cookie => { document.cookie = cookie });
    addSessionChangeListener(setSession, document.cookie);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Polls</title>
      </head>
      <body className="bg-zinc-100">
        {/* Display the page or the authentication screen, depending on auth state */}
        {!session ? <Auth /> : children}
      </body>
    </html>
  )
}
