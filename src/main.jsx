import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Pomodoro from './components/Pomodoro.jsx';
import Events from './components/Events.jsx';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Callback from './components/Callback.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/events",
    element: <Events/>,
  },
  {
    path: "/pomodoro",
    element: <Pomodoro/>,
  },
  {
    path: "/oauth2callback",
    element: <Callback/>,
  }
]);

// ReactDOM.render(<RouterProvider router={router} />,document.getElementById("root"));
  
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);