import React, { useState } from 'react';

const Popup= ({ isOpen, onClose, createNote }) => {
  const [noteName,setNoteName]=useState("");
  const [noteContent,setNoteContent]=useState("");

  const handleChange = (event) => {
    const newValue=event.target.value;
    setNoteName(newValue);
  };
  const handleChange1 = (event) => {
    const newValue=event.target.value;
    setNoteContent(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const noteDetails={
      'notename':noteName,
      'notecontent':noteContent
    }
    createNote(noteDetails);
    setNoteName("");
    setNoteContent("");
    window.location.reload();
  };


  return (
    <div className={`fixed top-0 backdrop-blur-[2px] z-20 left-0 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-teal-200 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl mb-4">New Note</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block text-gray-600" >Name:</label>
          <input type="text" id="name" name="name" onChange={handleChange} className="w-full border rounded-md px-3 py-2 mb-2 bg-teal-50 " placeholder='Note Name' required value={noteName}/>
          <label htmlFor="name" className="block text-gray-600">Content:</label>
          <textarea type="text" id="name" name="name" onChange={handleChange1} rows={5}
           className="w-full border rounded-md px-3 py-2 mb-2 bg-teal-50" placeholder='Content' required value={noteContent}/>
          <button type="submit" className="bg-teal-500 shadow-md hover:shadow-none font-medium text-teal-50 hover:text-white p-2 rounded-md w-full ">
            Submit
          </button>
        </form>
        <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
