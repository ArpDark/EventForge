import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
  const [sessionType, setSessionType] = useState('Work');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  useEffect(() => {
    let interval;

    if (isActive && minutes === 0 && seconds === 0) {
      // Switch between work and break sessions
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

  function handleLogout(){
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <div className='flex relative border-2 border-red-400 justify-center'>
      <div className="flex fixed  justify-center bg-[#2D2D2D] w-screen h-28 space-x-12 [box-shadow:_0px_15px_10px_rgb(0_0_0_/_25%)] z-10 ">
        <a href="/home" className="flex h-10 w-36 self-center justify-center  rounded-md bg-white px-3 py-2 text-sm  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Notes</a>

        <a href="/events" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">My Events</a>

        <a href="/pomodoro" className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">Pomodoro</a>
        
        <button className="flex h-10 w-36 self-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 " onClick={handleLogout} >Log Out</button>
      </div>
      <div className="flex relative mt-36 border-2 border-blue-500 ">
        <div className='flex flex-col items-center bg-red-300'>
          <div className='flex space-x-5 '>
            <button className=' bg-red-400 rounded-md w-32 h-10' onClick={switchToWork}>Work</button>
            <button className='bg-red-400 rounded-md w-32 h-10' onClick={switchToShortBreak}>Short Break</button>
            <button className='bg-red-400 rounded-md w-32 h-10' onClick={switchToLongBreak}>Long Break</button>
          </div>
          <div className='flex flex-col items-center'>
            <h1>{sessionType} Session</h1>
            <div className="timer"> 
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="buttons">
            <button onClick={toggleTimer} className='border-2'>
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} className='border-2'>Reset</button>
            <button className='border-2'>Settings</button>
          </div>
        </div>

        <div className=" hidden">
          <div>
            <label>Work Duration (minutes):</label>
            <input
              type="number"
              value={workDuration}
              onChange={(event) => setWorkDuration(parseInt(event.target.value, 10))}
            />
          </div>
          <div>
            <label>Short Break Duration (minutes):</label>
            <input
              type="number"
              value={shortBreakDuration}
              onChange={(e) => setShortBreakDuration(parseInt(e.target.value, 10))}
            />
          </div>
          <div>
            <label>Long Break Duration (minutes):</label>
            <input
              type="number"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Pomodoro;
