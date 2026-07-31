import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Loginpage"
import ProfilePage from "./pages/ProfilePage";
import {Toaster} from "react-hot-toast";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <div className='h-screen bg-(--bg) text-white p-0 md:p-3'>
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
