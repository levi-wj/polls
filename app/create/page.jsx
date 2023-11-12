'use client';

import { getSB, getSession } from "@/scripts/db";
import Header from "@/components/Header";
import { useState, useEffect } from 'react';

async function createPoll(form) {
  const formData = new FormData(form);
  const sb = getSB();
  const options = formData.getAll('option');

 const {data, error} = await sb
    .from('poll')
    .insert([{ title: formData.get('title') }])
    .select();

  await sb
    .from('poll_option')
    .insert(options.map(option => { return { text: option, poll_id: data[0].id } }))
    .select();

  if (error) {
    console.error(error);
  } else {
    console.log('Created poll', data);
  }
}

export default function CreatePollPage() {
  let [options, setOptions] = useState([]);
  let [optionEles, setOptionEles] = useState([]);
  let [addingOption, setAddingOption] = useState(false);

  function addOption() {
    let text = document.getElementById('optionText').value;
    console.log(text)
    setOptions([...options, text]);
    text = '';
  }

  useEffect(() => {
    setOptionEles(options.map((option, i) => {
      return (
        <input key={i} type="text" name="option" value={option}/>
      )
    }));
  }, [options]);

  return (
    <div>
      <Header></Header>
      <div className="max-w-3xl m-auto mt-8 text-xl font-semibold">
        <h2 className="mb-3">Create new poll</h2>
        <form onSubmit={e => { createPoll(e.target); e.preventDefault(); }} className="bg-emerald-100 p-4 rounded-md">
          <input type="text" name="title" placeholder="Title" />
          <div className="bg-emerald-300 p-2 mt-3 mb-2 rounded-md">
            {optionEles}
            <div>
              {addingOption ? <input type="text" id="optionText" name="option" placeholder="Option" className="mb-3"/> : null}
              {addingOption ? <button type="button" className="ml-2 text-gray-700 bg-emerald-200 px-5 py-3 rounded-md mt-4 text-sm font-medium" onClick={() => { setAddingOption(false); addOption(); }}>Save</button> : null}
              {addingOption ? <button type="button" className="ml-2 text-gray-700 bg-emerald-200 px-5 py-3 rounded-md mt-4 text-sm font-medium" onClick={() => setAddingOption(false)}>Cancel</button> : null}
            </div>
            {!addingOption ? <button type="button" onClick={() => setAddingOption(true)} className="text-gray-700 bg-emerald-200 px-5 py-3 rounded-md text-sm font-medium">Add option</button> : null}
          </div>

          <button className="text-gray-700 bg-emerald-200 px-5 py-3 rounded-md mt-4 text-sm font-medium">Create</button>
        </form>
      </div>
    </div>
  )
}