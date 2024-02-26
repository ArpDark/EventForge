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
    const apiUrl=import.meta.env.VITE_API_URI;

    const saveOnCalendar=()=>{
        console.log(eventDetails[0]);
        const config={
            method:'post',
            url:apiUrl+'/saveoncalendar',
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
            url:apiUrl+'/eventdelete',
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

    function replaceWithBr(sentence) {
        return sentence.replace(/\n/g, "<br />");
    }
    
    if(isOpen)
    {
        return (
            <div className={`fixed top-0 left-0 z-20 w-full backdrop-blur-[2px] h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
                <div className="flex flex-col bg-teal-200 p-6 rounded-lg shadow-lg w-80 max-h-96">
                    <div className='flex justify-between'>
                        <h2 className="text-2xl font-medium mb-4">{eventDetails[0].eventname}</h2>
                        <button onClick={deleteEvent} className="h-fit w-fit rounded-lg text-gray-500 hover:text-gray-800">
                            <DeleteIcon/>
                        </button>
                    </div>
                    <div className=' max-h-64 overflow-auto'>
                        <div className='flex p-2 w-full items-center'>
                            <DescriptionIcon/>
                            {/* <p id='loc' className='bg-teal-100 rounded-md w-full p-2'>{eventDetails[0].description}</p> */}
                            <p className='bg-teal-100 rounded-md p-2 w-full' dangerouslySetInnerHTML={{__html: replaceWithBr(eventDetails[0].description)}} id='desc'/>
                        </div>
                        <div className='flex p-2 w-full items-center'>
                            <LocationOnIcon/>
                            <p id='loc' className='bg-teal-100 rounded-md w-full p-2'>{eventDetails[0].location}</p>
                        </div>
                        <div className='flex p-2 w-full items-center'>
                            <DateRangeIcon/>
                            <p id='loc' className='bg-teal-100 rounded-md w-full p-2'>{moment(eventDetails[0].startdate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")} - {moment(eventDetails[0].enddate).tz(eventDetails[0].timezone).format("DD-MM-YYYY")}</p>
                        </div>
                        <div className='flex p-2 w-full items-center'>
                            <AccessTimeIcon/>
                            <p id='time' className='bg-teal-100 rounded-md w-full p-2'>{moment(eventDetails[0].starttime).tz(eventDetails[0].timezone).format("hh:mm A")} - {moment(eventDetails[0].endtime).tz(eventDetails[0].timezone).format("hh:mm A")}</p>
                        </div>
                    </div>
                    <button onClick={saveOnCalendar} className="bg-teal-500 shadow-md hover:shadow-none font-medium text-teal-50 hover:text-white mt-2 p-2 rounded-md w-full">Save</button>
                    
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