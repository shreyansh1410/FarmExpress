import React from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';


const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { isDark, toggleTheme } = useTheme();


  const HandleLogout= async ()=>{
    try{
    await axios.post(BASE_URL + '/logout', {}, {withCredentials:true});
    dispatch(removeUser());
    navigate('/login');
  }
  catch(err){
  }
  }

  return (
    <div className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/65 backdrop-blur-xl shadow-sm">
      <div className="navbar mx-auto h-[84px] w-[95%] max-w-7xl px-0">
        <div className="flex-1">
          <Link
            className="btn btn-ghost text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent hover:from-emerald-600 hover:to-cyan-600 transition-all"
            to="/"
          >
            FarmXpress
          </Link>
        </div>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex items-center gap-6 text-sm lg:text-base font-semibold">
            <a href="#about" className="px-3 py-1.5 rounded-full hover:bg-base-content/10 hover:text-primary transition-colors">About</a>
            <a href="#feature" className="px-3 py-1.5 rounded-full hover:bg-base-content/10 hover:text-primary transition-colors">Features</a>
            <a href="#contact" className="px-3 py-1.5 rounded-full hover:bg-base-content/10 hover:text-primary transition-colors">Contact Us</a>
            {!user && (
              <Link to="/login" className="px-3 py-1.5 rounded-full hover:bg-base-content/10 hover:text-primary transition-colors">
                Login
              </Link>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle bg-base-100/40 border border-base-300/40"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-base-300">
                  <img
                    alt="User"
                    src={user.photoUrl || "https://i.pravatar.cc/100?img=12"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100/85 backdrop-blur-md rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-300/70"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li><Link to='/truck'>Schedule</Link></li>
                <li><Link onClick={HandleLogout}>Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar