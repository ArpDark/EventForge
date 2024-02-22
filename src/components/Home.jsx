import React,{useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Popup from "./NotePopup";
import NoteDetailPopup from "./NoteDetailPopup";
import axios from "axios";
import qs from "qs";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Navbar from "./Navbar";


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
      url:apiUrl+'/notedetails',
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
    setPopupOpenD(false);
  };
  

  function createNote(noteData){
    noteData.username=user;
    const configuration={
      method:'post',
      url:apiUrl+'/createnote',
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
      url:apiUrl+'/notenames',
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
    <div className="flex relative min-h-screen h-dvh overflow-y-auto bg-slate-50 justify-center">
      <Navbar/>
      
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16 relative mt-36 border-2 border-green-200 z-0">

        <button onClick={openPopup} className="grid  bg-white text-black shadow-lg rounded-md w-60 h-36 justify-center items-center">
          <div>
            <AddOutlinedIcon sx={{fontSize:72}}/>
          </div>
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