import React from 'react';
import axios from "axios";
import qs from "qs";



const NoteDetailPopup = ({isOpen, onClose,noteDetails}) =>{
    const apiUrl='http://localhost:8000';
    const deleteNote=()=>{
        const config={
            method:'post',
            url:apiUrl+'/notedelete',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data:qs.stringify(noteDetails[0])
        };
        axios(config)
        .then((result)=>{
            window.location.reload();
        })
        .catch((error)=>{console.log("Error occurred");});
    }
    
    if(isOpen)
    {
        return (
            <div className={`fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl mb-4">{noteDetails[0].notename}</h2>
                    <div>
                        <label htmlFor="name" className="block text-gray-600">Name</label>
                        <p id='name'>{noteDetails[0].notename}</p>
                        <label htmlFor="content" className="block text-gray-600">Content</label>
                        <p id='desc'>{noteDetails[0].notecontent}</p>
                    </div>
                    <button onClick={deleteNote} className="bg-blue-500 text-white p-2 mt-2 rounded-md w-full">Delete</button>
                    <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">Close</button>
                </div>
            </div>
            
        );
    }
    else
    {
        return (
            <div className='hidden'>
                Not Open
            </div>
        )
    }
    
}
export default NoteDetailPopup;