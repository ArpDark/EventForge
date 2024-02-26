import React,{useState} from "react";
const PomodoroSettings=({isOpen, onClose, newSettings})=>{
  
    const [workDuration, setWorkDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);

    const handleSubmit=async()=>{
        const settingsData={
            'workDuration':workDuration,
            'shortBreakDuration':shortBreakDuration,
            'longBreakDuration':longBreakDuration
        }
        await newSettings(settingsData);
        onClose();

    }

    return (
        <div className={` fixed top-0 left-0  backdrop-blur-[2px] z-20 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
          <div className="bg-emerald-200 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col">
                <label className="text-lg font-medium ">Work Duration (minutes):</label>
                <input type="number" className="bg-emerald-50 p-1 rounded-md" value={workDuration} onChange={(event) => setWorkDuration(parseInt(event.target.value, 10))}/>
                
                <label className="text-lg font-medium " >Short Break Duration (minutes):</label>
                <input type="number" className="bg-emerald-50 p-1 rounded-md" value={shortBreakDuration} onChange={(event) => setShortBreakDuration(parseInt(event.target.value, 10))}/>
                
                <label className="text-lg font-medium ">Long Break Duration (minutes):</label>
                <input type="number" className="bg-emerald-50 p-1 rounded-md " value={longBreakDuration} onChange={(e) => setLongBreakDuration(parseInt(e.target.value, 10))}/>

                <button onClick={handleSubmit} className=" self-center bg-teal-500 shadow-md hover:shadow-none font-medium text-teal-50 hover:text-white mt-2 p-2 rounded-md w-1/2">
                    Update
                </button>
            </div>
            <button onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                Close
            </button>
          </div>
        </div>
    );
}
export default PomodoroSettings;