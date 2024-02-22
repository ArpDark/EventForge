import React from "react";
import { useNavigate } from 'react-router-dom';
const Navbar=()=>{
    const navigate=useNavigate();
    function handleLogout(){
        localStorage.clear();
        navigate("/login");
    }
    return (
        <div className="flex fixed overflow-auto  justify-center bg-[#2D2D2D] w-screen h-28 space-x-4 md:space-x-12 [box-shadow:_0px_15px_10px_rgb(0_0_0_/_25%)] z-10 ">
            <a href="/home" className=" flex h-10 w-36 self-center justify-center  rounded-md bg-white px-1 py-2 text-sm  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Notes</a>

            <a href="/events" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-1 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Events</a>

            <a href="/pomodoro" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-1 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">Pomodoro</a>
        
            <button className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-1 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 " onClick={handleLogout} >Log Out</button>
        </div>
    )
}

export default Navbar;