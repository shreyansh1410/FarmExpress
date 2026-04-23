import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'
import FooterSec from './Footer'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { addUser, removeUser } from '../utils/userSlice'
import ChatbotWidget from './ChatbotWidget'

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await axios.get(BASE_URL + '/profile', {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        dispatch(removeUser());
      }
    };

    fetchLoggedInUser();
  }, [dispatch]);

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <FooterSec/>
        <ChatbotWidget />
    </div>
  )
}

export default Body