import React,{useState,useEffect,Fragment} from "react";
import { useNavigate } from 'react-router-dom';
import EventPopup from "./EventPopup.jsx";
import EventDetailsPopup from "./EventDetailsPopup.jsx";
import Navbar from "./Navbar.jsx";
import axios from "axios";
import qs from "qs";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function Home(){
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
      url:apiUrl+'/eventdetails',
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
    <div className="flex relative min-h-screen h-dvh overflow-y-auto bg-slate-50 justify-center">
      <Navbar/>
      <div className="grid grid-flow-row  grid-cols-1 md:grid-cols-4 gap-16 relative mt-36 border-2 border-green-200 z-10">

        <button onClick={openPopup} className="grid  bg-white text-black shadow-lg rounded-md w-60 h-36 justify-center items-center">
          <div>
            <AddOutlinedIcon sx={{fontSize:72}}/>
          </div>
        </button>
        <EventPopup isOpen={isPopupOpen} onClose={closePopup} createEvent={createEvent} />
        
        {events.map((Event) => (<button onClick={()=>{openPopupD(Event)}} className="grid rounded-md shadow-md bg-white w-60 h-36 justify-center items-center" >
          <p className="text-xl font-medium">{Event.eventname}</p>
        </button>))}

        <EventDetailsPopup isOpen={isPopupOpenD} onClose={closePopupD} eventDetails={eventDetails}/>
        
      </div>
    </div>
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