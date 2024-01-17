import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

function Signup(){
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();

  function handleSubmit(event){
    event.preventDefault();
    const userData={
      'username':username,
      'email':email,
      'password':password
    }
    const configuration={
      method:'post',
      url:'http://localhost:8000/register',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(userData)
    };
    axios(configuration)
    .then((result)=>{
      window.localStorage.setItem('user', result.data.username);
      
      console.log(result.data.username);
      // console.log(typeof result.data);
      navigate("/home");
    })
    .catch((error)=>{console.log(error);});
  }

  return(
    <div className='flex flex-col h-screen w-screen  border-2 border-green-300 items-center bg-cyan-50 '>

      <h1 className='flex  font-sans text-2xl mt-10 font-semibold '>Sign Up in EfficiencyHub</h1>
      
      <form action="/Signup" method="" className='grid gap-4 pt-4 mt-10 w-1/4 bg-white shadow-md rounded px-8'>

        <div className='flex flex-col'>
          <label htmlFor="username" className='text-lg font-sans font-medium'>Username</label>
          <input placeholder='Name' className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 " onChange={(event)=>{setUsername(event.target.value)}} type="username" name="username"/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="email" className='text-lg font-sans font-medium'>Email</label>
          <input placeholder='abc@gmail.com' className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" onChange={(event)=>{setEmail(event.target.value)}} type="email" name="email"/>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="password" className='text-lg font-sans font-medium'>Password</label>
          <input placeholder='Password' className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full p-2.5" onChange={(event)=>{setPassword(event.target.value)}} type="password" name="password"/>
        </div>

        <button type="submit" onClick={handleSubmit} className='flex justify-center place-self-center w-1/2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-4 mb-4'>Sign Up</button>
      </form>
    </div>
  )
}
export default Signup;