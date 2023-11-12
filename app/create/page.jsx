'use client';

import { getSB } from "@/scripts/db.js";

async function createPoll() {
  // Insert is allowed if user is authenticated
  const { data, error } = await getSB()
    .from('poll')
    .insert([{ title: 'What is your favorite color?' }])
    .select();

  if (error) {
    console.error(error);
  } else {
    console.log('Created poll', data);
  }
}

export default function CreatePollPage() {
  return (
    <div>
      <h1>Create a new poll</h1>
      <button onClick={createPoll}>Create</button>
    </div>
  )
}