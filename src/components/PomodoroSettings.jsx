import React,{useState} from "react";
const PomodoroSettings=({isOpen, onClose, newSettings})=>{
  
    const [workDuration, setWorkDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);

    const handleSubmit=()=>{
        const settingsData={
            'workDuration':workDuration,
            'shortBreakDuration':shortBreakDuration,
            'longBreakDuration':longBreakDuration
        }
        newSettings(settingsData);
        onClose();

    }

    return (
        <div className={` fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col">
                <label>Work Duration (minutes):</label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(event) => setWorkDuration(parseInt(event.target.value, 10))}
                />
                <label>Short Break Duration (minutes):</label>
                <input
                  type="number"
                  value={shortBreakDuration}
                  onChange={(event) => setShortBreakDuration(parseInt(event.target.value, 10))}
                />
                <label>Long Break Duration (minutes):</label>
                <input
                  type="number"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(parseInt(e.target.value, 10))}
                />
                <button onClick={handleSubmit} className=" self-center bg-blue-500 text-white p-2 rounded-md w-1/2">
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