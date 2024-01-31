import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import qs from "qs";
const Callback = ()=>{
  const navigate=useNavigate();
  useEffect(()=>{
    const url=window.location.search;
    console.log(url);
    const params =new URLSearchParams(url);
    console.log(params);
    const code=params.get("code");
    console.log(code);
    const datas={
      "authcode":code
    }
    console.log(qs.stringify(datas));
    const config={
      method:'post',
      url:'http://localhost:8000/saveoncalendar/2',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data:qs.stringify(datas)
  };
  axios(config)
  .then((result)=>{
      console.log("Event saved");
      navigate("\events");
  })
  .catch((error)=>{console.log("Error occurred");});
  },[]);
  
  return (
    <h1>hello</h1>  
  );
}

export default Callback;