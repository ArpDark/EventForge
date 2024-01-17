import React, { useState ,useEffect} from 'react';
import moment from "moment-timezone";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const EventPopup= ({ isOpen, onClose, createEvent }) => {
  const [eventName,setEventName]=useState("");
  const [eventLoc,setEventLoc]=useState("");
  const [eventDesc,setEventDesc]=useState("");
  const [eventStartDate,setEventStartDate]=useState(null);
  const [eventEndDate,setEventEndDate]=useState(null);
  const [eventStart,setEventStart]=useState(null);
  const [eventEnd,setEventEnd]=useState(null);
  const [timeZone,setTimeZone]=useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");

  useEffect(() => {
    const timezoneList = moment.tz.names();
    setTimeZone(timezoneList);
  }, []);

  const handleEventName = (event) => {
    const newValue=event.target.value;
    setEventName(newValue);
  };
  const handleEventLoc = (event) => {
    const newValue=event.target.value;
    setEventLoc(newValue);
  };
  const handleEventDesc = (event) => {
    const newValue=event.target.value;
    setEventDesc(newValue);
  };
  const handleEventStartDate = (event) => {
    setEventStartDate(event);
  };
  const handleEventEndDate = (event) => {
    setEventEndDate(event);
  };
  const handleEventStart = (event) => {
    setEventStart(event);
  };
  const handleEventEnd = (event) => {
    setEventEnd(event);
  };

  const handleTimezone=(event)=>{
    setSelectedTimezone(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(eventEnd.$d);
    const details={
      'eventname':eventName,
      'location':eventLoc,
      'description':eventDesc,
      'startdate':eventStartDate.$d,
      'enddate':eventEndDate.$d,
      'starttime':eventStart.$d,
      'endtime':eventEnd.$d,
      'timezone':selectedTimezone
    };
    // const details=[eventName,eventLoc,eventDesc,eventDate,selectedTimezone,eventStart,eventEnd];
    createEvent(details);
  };


  return (
    <div className={`fixed top-0 left-0 w-full h-full flex z-20 items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Event form</h2>
        <form onSubmit={handleSubmit} className='h-96 overflow-y-auto'>
          <label htmlFor="name" className="block text-gray-600">Name</label>
          <input type="text" id="name" name="name" onChange={handleEventName} className="w-full border rounded-md px-3 py-2 mb-2" required value={eventName}/>

          <label htmlFor="location" className="block text-gray-600">Location</label>
          <input type="text" id="location" name="location" onChange={handleEventLoc} className="w-full border rounded-md px-3 py-2 mb-2"  value={eventLoc}/>

          <label htmlFor="desc" className="block text-gray-600">Description</label>
          <input type="text" id="desc" name="desc" onChange={handleEventDesc} className="w-full border rounded-md px-3 py-2 mb-2" value={eventDesc}/>
          
          <label htmlFor="date" className="block text-gray-600">Start Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={eventStartDate} onChange={handleEventStartDate} />
          </LocalizationProvider>
          <label htmlFor="date" className="block text-gray-600">End Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={eventEndDate} onChange={handleEventEndDate} />
          </LocalizationProvider>

          <label htmlFor="tz" className="block text-gray-600">Time Zone</label>
          <select  id="tz" name="tz" value={selectedTimezone} className='w-full border rounded-md px-3 py-2 mb-2' onChange={handleTimezone}>
            <option value="" >Select a Timezone</option>
            {timeZone.map((timezone, index) => (<option key={index} value={timezone}>{timezone}</option>))}
          </select>

          <label htmlFor="name" className="block text-gray-600">Start Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker value={eventStart} onChange={handleEventStart} />
          </LocalizationProvider>

          <label htmlFor="name" className="block text-gray-600">End Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker value={eventEnd} onChange={handleEventEnd} />
          </LocalizationProvider>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">Save</button>
        </form>
        <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">Close</button>
      </div>
    </div>
  );
};

export default EventPopup;
