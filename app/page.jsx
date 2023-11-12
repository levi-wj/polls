'use client';

import Header from "@/components/Header";
import { getSB, getSession } from "@/scripts/db";
import Poll from "@/components/Poll";
import { useState, useEffect } from 'react';

async function getPolls(setPolls, userId) {
  const sb = getSB();
  if (sb) {
    const { data, error } = await getSB().rpc('get_polls', { user_id: userId });
    if (error) {
      console.error(error);
    } else {
      setPolls(data || []);
    }
  }
}

export default function Home() {
  let [polls, setPolls] = useState([]);
  let [pollEles, setPollEles] = useState([]);

  useEffect(() => {
    const session = getSession(document.cookie);
    if (session) {
      getPolls(setPolls, session.user.id);
    }
  }, []);

  useEffect(() => {
    const newEles = polls.map(poll => {
      return (
        <Poll key={poll.id} poll={poll}></Poll>
      )
    });
    setPollEles(newEles);
  }, [polls]);

  return (
    <div>
      <Header></Header>
      <div className="max-w-3xl m-auto mt-8 text-xl font-semibold">
        <h2 className="mb-3">Trending Polls</h2>
        {pollEles}
      </div>
    </div>
  )
}
