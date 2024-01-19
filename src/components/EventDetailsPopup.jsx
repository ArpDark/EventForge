import React from 'react';
import axios from "axios";
import qs from "qs";
import moment from 'moment-timezone';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';

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
            window.location.reload();
        })
        .catch((error)=>{console.log("Error occurred");});
    }
    
    if(isOpen)
    {
        return (
            <div className={`fixed top-0 left-0 z-20 w-full backdrop-blur-[2px] h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
                <div className="flex flex-col w-96 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl mb-4">{eventDetails[0].eventname}</h2>
                    <div className=' min-h-fit max-h-72 overflow-y-auto'>
                        <div className='flex p-2'>
                            <DescriptionIcon/>
                            <p id='loc'>{eventDetails[0].description}</p>
                        </div>
                        <div className='flex p-2'>
                            <LocationOnIcon/>
                            <p id='loc'>{eventDetails[0].location}</p>
                        </div>
                        <div className='flex p-2'>
                            <DateRangeIcon/>
                            <p id='loc'>{moment(eventDetails[0].startdate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")} - {moment(eventDetails[0].enddate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")}</p>
                        </div>
                        <div className='flex p-2'>
                            <AccessTimeIcon/>
                            <p id='time'>{moment(eventDetails[0].starttime).tz(eventDetails[0].timezone).format("hh:mm A")} - {moment(eventDetails[0].endtime).tz(eventDetails[0].timezone).format("hh:mm A")}</p>
                        </div>
                        
                        {/* <label htmlFor="startdate"className="block text-gray-600">Start Date</label>
                        <p id='startdate'>{moment(eventDetails[0].startdate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")}</p>
                        <label htmlFor="enddate"className="block text-gray-600"> End Date</label>
                        <p id='enddate'>{moment(eventDetails[0].enddate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")}</p> */}
                        {/* <label htmlFor="starttime" className="block text-gray-600">Start Time</label>
                        <p id='starttime'>{moment(eventDetails[0].starttime).tz(eventDetails[0].timezone).format("hh:mm A")}</p> */}
                        {/* <label htmlFor="endtime" className="block text-gray-600">End Time</label>
                        <p id='endtime'>{moment(eventDetails[0].endtime).tz(eventDetails[0].timezone).format("hh:mm A")}</p> */}
                        {/* <label htmlFor="timezone" className="block text-gray-600">Timezone</label>
                        <p id='timezone'>{eventDetails[0].timezone}</p> */}
                    </div>
                    <button onClick={saveOnCalendar} className="bg-blue-500 text-white p-2 rounded-md w-full">Save</button>
                    <button onClick={deleteEvent} className="self-center border-2 border-green w-fit h-fit">
                        <DeleteIcon/>
                    </button>
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