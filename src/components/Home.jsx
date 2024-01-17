import React,{useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Popup from "./NotePopup";
import NoteDetailPopup from "./NoteDetailPopup";
import axios from "axios";
import qs from "qs";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

function Home(){
  const navigate=useNavigate();
  const [user,setUser]=useState("");
  // const [lists,setLists]=useState([]);
  const [notes,setNotes]=useState([]);
  const [noteDetails,setNoteDetails]=useState({});
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
      fetchNoteNames();
    }
    fetchUser();
  }, []);
  
  function handleLogout(){
    localStorage.clear();
    navigate("/login");
  }

  const openPopup = () => {
    setPopupOpen(true);
    setIsOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };

  const openPopupD = (note) => {
    // console.log(x);
    const note1={
      'username':user,
      'notename':note.notename,
      '_id':note._id
    }
    const configuration={
      method:'post',
      url:'http://localhost:8000/notedetails',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(note1)
    };
    axios(configuration)
    .then((result)=>{
      setNoteDetails(result.data);
    })
    .catch((error)=>{console.log(error);}).then(()=>{
      setPopupOpenD(true);
    });
    
  };
  const closePopupD = () => {
    fetchNoteNames();
    setPopupOpenD(false);
  };
  

  function createNote(noteData){
    noteData.username=user;
    const configuration={
      method:'post',
      url:'http://localhost:8000/createnote',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(noteData)
    };
    axios(configuration)
    .then((result)=>{
      console.log(result.data);
      console.log("List has been created");
      fetchNoteNames();
      closePopup();
    })
    .catch((error)=>{console.log(error);});
  }

  function fetchNoteNames(){
    console.log(window.localStorage.getItem("user"));
    const userData={
      'username':window.localStorage.getItem("user")
    };
    const config2={
      method:'post',
      url:'http://localhost:8000/notenames',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(userData)
    };
    axios(config2)
    .then((result)=>{
      const returnValue=(result.data);
      // const x=[];
      console.log(returnValue);
      // for(let a=0;a<returnValue.length;a++){
      //   x.push(returnValue[a].notename);
      // }
      setNotes(returnValue);
      console.log(notes);
    })
    .catch((error)=>{
      console.log("Error occurred");
    });
  }

  if(user){
  return (
    <div className="flex relative h-dvh max-h-full bg-slate-50 justify-center">
      <div className="flex fixed  justify-center bg-[#2D2D2D] w-screen h-28 space-x-12 [box-shadow:_0px_15px_10px_rgb(0_0_0_/_25%)] z-10 ">
        <a href="/home" className="flex h-10 w-36 self-center justify-center  rounded-md bg-white px-3 py-2 text-sm  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Notes</a>

        <a href="/events" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Events</a>

        <a href="/pomodoro" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">Pomodoro</a>
        
        <button className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 " onClick={handleLogout} >Log Out</button>
      </div>
      
      <div className="grid grid-flow-row  grid-cols-4 gap-16 relative mt-36 border-2 border-green-200 z-0">

        <button onClick={openPopup} className="grid  bg- text-black shadow-lg rounded-md w-60 h-36 justify-center items-center">
          <div>
            <AddOutlinedIcon sx={{fontSize:72}}/>
          </div>
          {/* <p className="border-2 border-green-300 mb-4">New Note</p> */}
        </button>
        <Popup isOpen={isPopupOpen} onClose={closePopup} createNote={createNote} />
        
        {notes.map((Note) => (<button onClick={()=>{openPopupD(Note)}} className="grid rounded-md shadow-md bg-white w-60 h-36 justify-center items-center">
          <p className="text-xl font-medium" >{Note.notename}</p>
          <p className="border-2 border-red-200  truncate " >{Note.notecontent}</p>
          </button>))}

        <NoteDetailPopup isOpen={isPopupOpenD} onClose={closePopupD} noteDetails={noteDetails}/>
        
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