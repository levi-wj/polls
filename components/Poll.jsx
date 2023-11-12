import { getSB, getSession } from '@/scripts/db';
import { useState } from 'react';

async function addLike(userId, pollId, setHasLiked, likes, setLikes) {
    setLikes(likes + 1);
    setHasLiked(true);
    const { data, error } = await getSB()
      .from('poll_like')
      .insert([{ user_id: userId, poll_id: pollId }]);
}

async function removeLike(userId, pollId, setHasLiked, likes, setLikes) {
  setLikes(likes - 1);
  setHasLiked(false);
  const { data, error } = await getSB()
    .from('poll_like')
    .delete()
    .match({ user_id: userId, poll_id: pollId });
}

// Toggle adding and removing likes
function clickLike(pollId, hasLiked, setHasLiked, likes, setLikes) {
  const userId = getSession(document.cookie).user.id;
  if (hasLiked) {
    removeLike(userId, pollId, setHasLiked, likes, setLikes);
  } else {
    addLike(userId, pollId, setHasLiked, likes, setLikes);
  }
}

function LikeBtn({ pollId, hasLiked, setHasLiked, likes, setLikes }) {
  return (
    <button
      onClick={() => clickLike(pollId, hasLiked, setHasLiked, likes, setLikes)}
      className="bg-emerald-100 text-gray-700 p-2 pt-1 pb-1 items-center text-lg flex rounded-md hover:bg-emerald-50">
        <span className="text-2xl mr-2">{hasLiked ? '♥' : '♡'}</span> {likes}
    </button>
  )
}

export default function Poll({ poll }) {
  let [likes, setLikes] = useState(poll.likes);
  let [hasLiked, setHasLiked] = useState(poll.has_liked);

  return (
    <div className="bg-emerald-200 px-5 py-3 rounded-md">
      <h2 className="text-lg font-semibold">{poll.title}</h2>
      <div className="flex items-end justify-between">
        <p className="text-gray-600 text-sm">Created at {(new Date(poll.created_at).toDateString())}</p>
        <LikeBtn pollId={poll.id} hasLiked={hasLiked} setHasLiked={setHasLiked} likes={likes} setLikes={setLikes}></LikeBtn>
      </div>
    </div>
  )
}