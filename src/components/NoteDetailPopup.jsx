import React from 'react';
import axios from "axios";
import qs from "qs";
import DeleteIcon from '@mui/icons-material/Delete';

const NoteDetailPopup = ({isOpen, onClose,noteDetails}) =>{
    const apiUrl=import.meta.env.VITE_API_URI;
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
    
    function replaceWithBr(sentence) {
        return sentence.replace(/\n/g, "<br />");
    }


    if(isOpen)
    {
        return (
            <div className={`fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
                <div className="bg-teal-200 p-6 rounded-lg shadow-lg w-80 max-h-96 ">
                    <div className='flex justify-between'>
                        <h2 className="text-2xl font-medium mb-4">{noteDetails[0].notename}</h2>
                        <button onClick={deleteNote} className=" h-fit w-fit rounded-lg text-gray-500 hover:text-gray-800">
                            <DeleteIcon/>
                        </button>
                    </div>
                    <div>
                        {/* <p dangerouslySetInnerHTML={{__html: replaceWithBr(noteDetails[0].notecontent)}} id='desc'>{noteDetails[0].notecontent}</p> */}
                        <p className='bg-teal-100 rounded-md p-2 max-h-56 overflow-auto' dangerouslySetInnerHTML={{__html: replaceWithBr(noteDetails[0].notecontent)}} id='desc'/>
                    </div>
                    
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