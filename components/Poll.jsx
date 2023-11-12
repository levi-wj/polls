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

async function clickAnswer(answerId, setAnswer, hasAnswered, setHasAnswered) {
  if (hasAnswered) return;
  const userId = getSession(document.cookie).user.id;
  setAnswer(answerId);
  setHasAnswered(true);
  const { data, error } = await getSB()
    .from('vote')
    .insert([{ user_id: userId, option_id: answerId }]);
}

function PollOption({ id, text, votes, answer, setAnswer, hasAnswered, setHasAnswered }) {
  return (
    <label htmlFor={id} onClick={() => clickAnswer(id, setAnswer, hasAnswered, setHasAnswered)}>
      <div className={"cursor-pointer bg-green-100 p-3 pt-2 pb-2 rounded-md" + (answer == id ? " bg-emerald-400 text-gray-50" : "")}>
        <div className="flex justify-between items-center">
          <div>
            <input type="radio" id={id} name="option" className="mr-2" disabled={hasAnswered} />
            {text}
          </div>
          {hasAnswered ? <span className="text-gray-800 ">({votes})</span> : ''}
        </div>
      </div>
    </label>
  )
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
  let [answer, setAnswer] = useState(poll.answer);
  let [hasAnswered, setHasAnswered] = useState(poll.has_answered);
  const optionIds = poll.po_ids.split(',');
  const optionTexts = poll.po_texts.split(',');
  const optionVotes = poll.po_votes.split(',');
  
  let options = [];
  optionIds.forEach((id, i) => {
    options.push(<PollOption key={id} id={id} text={optionTexts[i]} votes={optionVotes[i]} answer={answer} setAnswer={setAnswer} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered}></PollOption>);
  });

  return (
    <div className="bg-emerald-200 px-5 py-3 rounded-md border-transparent mb-3 border-b-green-300 border-4">
      <h2 className="text-lg font-semibold mb-2">{poll.title}</h2>
      <div className="grid grid-cols-2 gap-3 mb-2">
        {options}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-gray-600 text-sm">Created {(new Date(poll.created_at).toDateString())}</p>
        <LikeBtn pollId={poll.id} hasLiked={hasLiked} setHasLiked={setHasLiked} likes={likes} setLikes={setLikes}></LikeBtn>
      </div>
    </div>
  )
}