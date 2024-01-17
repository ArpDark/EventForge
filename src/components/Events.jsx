import React,{useState,useEffect,Fragment} from "react";
import { useNavigate } from 'react-router-dom';
import EventPopup from "./EventPopup.jsx";
import EventDetailsPopup from "./EventDetailsPopup.jsx";
import axios from "axios";
import qs from "qs";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Home(){
  const navigate=useNavigate();
  const [user,setUser]=useState("");
  const [eventDetails,setEventDetails]=useState({});
  const [events,setEvents]=useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupOpenD, setPopupOpenD] = useState(false);

  useEffect(() => {
    const fetchUser= async()=>{
      try
      {
        const loggedInUser = window.localStorage.getItem("user");
        setUser(loggedInUser);
      }
      catch(error)
      {
        console.log(error);
      }
      fetchEventNames();
    }
    fetchUser();
  }, []);
  
  function handleLogout(){
    localStorage.clear();
    navigate("/login");
  }

  const openPopup = () => {
    setPopupOpen(true);
    // setIsOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };

  const openPopupD = (event) => {
    // console.log(x);
    const event1={
      'username':user,
      'eventname':event.eventname,
      '_id':event._id
    }
    const configuration={
      method:'post',
      url:'http://localhost:8000/eventdetails',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(event1)
    };
    axios(configuration)
    .then((result)=>{
      // console.log("Result");
      setEventDetails(result.data);
      // console.log(typeof(result.data));
      
    })
    .catch((error)=>{console.log(error);}).then(()=>{
      setPopupOpenD(true);
    });
    
  };
  const closePopupD = () => {
    setPopupOpenD(false);
  };
  

  function createEvent(newEvent){
    
    // const eventData={
    //   'username':user,
    //   'listname':newEvent
    // }
    // console.log(newEvent);
    newEvent.username=user;
    const configuration={
      method:'post',
      url:'http://localhost:8000/createevent',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(newEvent)
    };
    axios(configuration)
    .then((result)=>{
      console.log("Result");
      console.log(result.data);
      console.log("Event has been created");
      fetchEventNames();
      // closePopup();
      // setNewEvent("");
    })
    .catch((error)=>{console.log(error);});
  }

  function fetchEventNames(){
    // console.log(window.localStorage.getItem("user"));
    const userData={
      'username':window.localStorage.getItem("user")
    };
    const config={
      method:'post',
      url:'http://localhost:8000/eventnames',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(userData)
    };
    axios(config)
    .then((result)=>{
      const returnValue=(result.data);
      // const x=[];
      console.log(returnValue);
      // for(let a=0;a<returnValue.length;a++){
      //   x.push(returnValue[a].eventname);
      // }
      setEvents(returnValue);
      // console.log(events);
    })
    .catch((error)=>{
      console.log("Error occurred");
    });
  }

  if(user){
  return (
    <div className="flex relative border-2 border-red-400">
      <div className="flex fixed  justify-center bg-[#2D2D2D] w-screen h-28 space-x-12 [box-shadow:_0px_15px_10px_rgb(0_0_0_/_25%)] z-10 ">
        <a href="/home" className="flex h-10 w-36 self-center justify-center  rounded-md bg-white px-3 py-2 text-sm  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Notes</a>

        <a href="/events" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Events</a>

        <a href="/pomodoro" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">Pomodoro</a>
        
        <button className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 " onClick={handleLogout} >Log Out</button>
      </div>
      
      <div className="grid grid-flow-row grid-cols-4 gap-20 relative left-8 mt-36 border-2 border-green-200">

        <button onClick={openPopup} className="flex bg-blue-500 text-white p-2 rounded-md w-60 h-60 justify-center items-center">
          Create Event
        </button>
        <EventPopup isOpen={isPopupOpen} onClose={closePopup} createEvent={createEvent} />
        
        {events.map((Event) => (<button onClick={()=>{openPopupD(Event)}} className="flex bg-gray-200 w-60 h-60 justify-center items-center" >{Event.eventname}</button>))}

        <EventDetailsPopup isOpen={isPopupOpenD} onClose={closePopupD} eventDetails={eventDetails}/>
        
      </div>
    </div>  // Outer most div
  );
  }
  else
  {
    return(
      <div>
        <p>Not Logged IN</p>
        <a href="/login">Login</a>
      </div>
    );
  }
}

export default Home;