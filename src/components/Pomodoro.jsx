import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PomodoroSettings from './PomodoroSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const Pomodoro = () => {
  const [sessionType, setSessionType] = useState('Work');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [isOpen,setIsOpen]=useState(false);
  useEffect(() => {
    let interval;
    if (isActive && minutes === 0 && seconds === 0) {
      setSessionType(prevSessionType => prevSessionType === 'Work' ? 'Short Break' : 'Work');
      if (sessionType === 'Work') {
        setMinutes(shortBreakDuration);
      } else {
        setMinutes(workDuration);
      }
    }
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessionType, workDuration, shortBreakDuration,longBreakDuration]);
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  const resetTimer = () => {
    setIsActive(false);
    setSessionType('Work');
    setMinutes(workDuration);
    setSeconds(0);
  };
  const switchToWork=()=>{
    setSessionType('Work');
    setMinutes(workDuration);
    setSeconds(0);
    if(isActive)
    {
      setIsActive(!isActive);
    }
  }
  const switchToShortBreak=()=>{
    setSessionType('Short Break');
    setMinutes(shortBreakDuration);
    setSeconds(0);
    if(isActive)
    {
      setIsActive(!isActive);
    }
  }
  const switchToLongBreak=()=>{
    setSessionType('Long Break');
    setMinutes(longBreakDuration);
    setSeconds(0);
    if(isActive)
    {
      setIsActive(!isActive);
    }
  }
// 
  const newSettings=async(settingsData)=>{
    console.log(settingsData);
    setWorkDuration(settingsData.workDuration);
    setShortBreakDuration(settingsData.shortBreakDuration);
    setLongBreakDuration(settingsData.longBreakDuration);
    await resetTimer;
  }
  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };
  return (
    <div className='flex relative min-h-screen h-dvh overflow-y-auto justify-center'>
      <Navbar/>
      <div className="flex flex-col relative w-screen bg-emerald-100 border-yellow-300 border-2 items-center ">
        <div className='flex flex-col items-center bg-emerald-300 w-5/6 md:w-2/5 mt-36 rounded-2xl shadow-md shadow-emerald-800'>
          <div className='flex justify-around  w-full mt-4'>
            <button className="bg-emerald-600 rounded-md  p-2 text-sm w-20 md:w-36 font-['Orbitron'] font-medium shadow-md shadow-emerald-700 hover:shadow-none" onClick={switchToWork}>WORK</button>
            <button className="bg-emerald-600 rounded-md  p-2 text-sm w-20 md:w-36 font-['Orbitron'] font-medium shadow-md shadow-emerald-700 hover:shadow-none" onClick={switchToShortBreak}>SHORT BREAK</button>
            <button className="bg-emerald-600 rounded-md  p-2 text-sm w-20 md:w-36 font-['Orbitron'] font-medium shadow-md shadow-emerald-700 hover:shadow-none" onClick={switchToLongBreak}>LONG BREAK</button>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-xl p-2 mt-2 font-['Orbitron']">{sessionType} Session</h1>
            <div className="font-['Orbitron'] text-6xl md:text-7xl p-1" id='timer'> 
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex justify-around w-3/4 md:w-2/5 mt-4 pb-4" id='buttons' >
            <button onClick={toggleTimer} className=' bg-emerald-600 rounded-2xl font-orbitron font-medium shadow-sm shadow-emerald-700 hover:shadow-none'>
              {isActive ? <PauseIcon style={{ fontSize: '2rem' }}/> : <PlayCircleFilledWhiteIcon style={{ fontSize: '2rem' }}/>}
            </button>
            <button onClick={resetTimer} className=' bg-emerald-600 rounded-md font-orbitron font-medium shadow-sm shadow-emerald-700 hover:shadow-none'>RESET</button>
            <button className=' bg-emerald-600 rounded-2xl font-orbitron font-medium shadow-sm shadow-emerald-700 hover:shadow-none' onClick={openPopup}><SettingsIcon style={{ fontSize: '2rem' }}/></button>
          </div>
        </div>
        <PomodoroSettings 
        isOpen={isOpen} 
        onClose={closePopup} 
        newSettings={newSettings}/>
      </div>
    </div>
  );
};

export default Pomodoro;