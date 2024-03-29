import React,{useState,useEffect,Fragment} from "react";
import { useNavigate } from 'react-router-dom';
import EventPopup from "./EventPopup.jsx";
import EventDetailsPopup from "./EventDetailsPopup.jsx";
import Navbar from "./Navbar.jsx";
import axios from "axios";
import qs from "qs";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Cookies from "js-cookie";

function Events(){
  const navigate=useNavigate();
  const [user,setUser]=useState("");
  const [eventDetails,setEventDetails]=useState({});
  const [events,setEvents]=useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupOpenD, setPopupOpenD] = useState(false);
  const apiUrl=import.meta.env.VITE_API_URI;

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
      url:apiUrl+'/eventdetails',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(event1)
    };
    axios(configuration)
    .then((result)=>{
      setEventDetails(result.data);
    })
    .catch((error)=>{console.log(error);}).then(()=>{
      setPopupOpenD(true);
    });
    
  };
  const closePopupD = () => {
    setPopupOpenD(false);
  };
  

  function createEvent(newEvent){
    
    newEvent.username=user;
    const configuration={
      method:'post',
      url:apiUrl+'/createevent',
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

    Cookies.set("user",window.localStorage.getItem("user"));

    const config={
      method:'post',
      url:apiUrl+'/eventnames',
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
    <div className="flex relative min-h-screen h-dvh overflow-y-auto bg-teal-100 justify-center">
      <Navbar/>
      <div className="grid grid-flow-row  grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-16 relative mt-36 z-0">

        <button onClick={openPopup} className="grid bg-teal-300  shadow-md shadow-teal-500 hover:shadow-none  text-black  rounded-md w-60 h-36 justify-center items-center">
          <div>
            <AddOutlinedIcon sx={{fontSize:72}}/>
          </div>
        </button>
        
        {events.map((Event) => (<button onClick={()=>{openPopupD(Event)}} className="grid rounded-md bg-teal-300  shadow-sm shadow-teal-500 hover:shadow-none w-60 h-36 justify-center items-center" >
          <p className="text-xl font-medium">{Event.eventname}</p>
        </button>))}

        
      </div>
      <EventPopup isOpen={isPopupOpen} onClose={closePopup} createEvent={createEvent} />
      <EventDetailsPopup isOpen={isPopupOpenD} onClose={closePopupD} eventDetails={eventDetails}/>
    </div>
  );
  }
  else
  {
    navigate("/login");
    return(
      <div>
      </div>
    );
  }
}

export default Events;