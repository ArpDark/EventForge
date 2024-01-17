import React from 'react';
// import { promises as fs } from 'fs';
import axios from "axios";
import qs from "qs";



const EventDetailsPopup = ({isOpen, onClose,eventDetails}) =>{

    const saveOnCalendar=()=>{
        // console.log(eventDetails[0]);

        const config={
            method:'post',
            url:'http://localhost:8000/saveoncalendar',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data:qs.stringify(eventDetails[0])
        };
        axios(config)
        .then((result)=>{
            console.log("Event saved");
        })
        .catch((error)=>{console.log("Error occurred");});

    }
    const deleteEvent=()=>{
        const config={
            method:'post',
            url:'http://localhost:8000/eventdelete',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data:qs.stringify(eventDetails[0])
        };
        axios(config)
        .then((result)=>{
            console.log("Event deleted successfully");
        })
        .catch((error)=>{console.log("Error occurred");});
    }
    
    if(isOpen)
    {
        return (
            <div className={`fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl mb-4">{eventDetails[0].eventname}</h2>
                    <div>
                        <label htmlFor="name" className="block text-gray-600">Name</label>
                        <p id='name'>{eventDetails[0].eventname}</p>
                        <label htmlFor="desc" className="block text-gray-600">Description</label>
                        <p id='desc'>{eventDetails[0].description}</p>
                        <label htmlFor="loc" className="block text-gray-600">Location</label>
                        <p id='loc'>{eventDetails[0].location}</p>
                        <label htmlFor="startdate"className="block text-gray-600">Start Date</label>
                        <p id='startdate'>{eventDetails[0].startdate}</p>
                        <label htmlFor="enddate"className="block text-gray-600"> End Date</label>
                        <p id='enddate'>{eventDetails[0].enddate}</p>
                        <label htmlFor="starttime" className="block text-gray-600">Start Time</label>
                        <p id='starttime'>{eventDetails[0].starttime}</p>
                        <label htmlFor="endtime" className="block text-gray-600">End Time</label>
                        <p id='endtime'>{eventDetails[0].endtime}</p>
                        <label htmlFor="timezone" className="block text-gray-600">Timezone</label>
                        <p id='timezone'>{eventDetails[0].timezone}</p>
                    </div>
                    <button onClick={saveOnCalendar} className="bg-blue-500 text-white p-2 rounded-md w-full">Save</button>
                    <button onClick={deleteEvent} className="bg-blue-500 text-white p-2 mt-2 rounded-md w-full">Delete</button>
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
export default EventDetailsPopup;