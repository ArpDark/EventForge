import React from 'react';
function App() {
  return(
    <div className="flex flex-col flex-1 flex-wrap h-screen bg-[url('/src/assets/bg_clock.jpg')] bg-cover bg-center bg-no-repeat  ">
      
      <div className='h-[8rem] bg-gradient-to-b from-black to-transparent text-right '>
          <a href="/login" className=' text-2xl bg-transparent text-slate-300 font-semibold hover:text-slate-50 border-2 border-slate-200 hover:border-slate-50 rounded  m-6 inline-block' >Login</a>
      </div>
      
      <div className="flex-1 flex-wrap " >
        <p className="flex text-[#E6E6E6] text-4xl [text-shadow:_4px_3px_2px_rgb(0_0_0_/_50%)] ml-20" >Welcome to EventForge</p>
        <p className="flex text-[#E6E6E6] text-6xl [text-shadow:_4px_3px_2px_rgb(0_0_0_/_50%)] ml-20" >Stay Productive</p>
        <a href="/signup" className='text-2xl  text-white flex ml-20 mt-10 rounded-xl bg-[#0094FF] bg-opacity-80 w-36 justify-center' >
          Get Started
        </a>
      </div>
      
    </div>
  )
}

export default App;
