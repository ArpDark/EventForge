import React,{useEffect} from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import qs from "qs";

const Callback = () => {
    const apiUrl=import.meta.env.VITE_API_URI;

    const calling=()=>{
        const loc = useLocation();
        const queryParams = new URLSearchParams(loc.search);
        const code = queryParams.get('code');
        console.log(code);
        const data={
            'code':code,
            'user':window.localStorage.getItem("user")
        }
        const config={
            method:'post',
            url:apiUrl+'/oauth2callback',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data:qs.stringify(data)
        };
        axios(config)
        .then(async(result)=>{
            window.location.href=result.data;
        })
        .catch((error)=>{console.log(error);});
    }
    calling();
    return(
        <div>ABCD</div>
    )
}
export default Callback;