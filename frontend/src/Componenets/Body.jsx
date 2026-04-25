import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router'
import FooterSec from './Footer'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { addUser, removeUser } from '../utils/userSlice'
import ChatbotWidget from './ChatbotWidget'

const Body = () => {
  const dispatch = useDispatch();
  const location = useLocation();

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

  useEffect(() => {
    const observedElements = new WeakSet();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const allElements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
      allElements.forEach((element) => element.classList.add("revealed"));
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      const allElements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
      allElements.forEach((element) => element.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const observeUnrevealedElements = () => {
      const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
      elements.forEach((element, index) => {
        if (element.classList.contains("revealed") || observedElements.has(element)) return;
        if (!element.style.getPropertyValue("--reveal-delay")) {
          element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 280)}ms`);
        }
        observedElements.add(element);
        observer.observe(element);
      });
    };

    observeUnrevealedElements();

    const mutationObserver = new MutationObserver(() => {
      observeUnrevealedElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden bg-base-100">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative z-10 pt-[84px]">
          <Navbar/>
          <Outlet/>
          <FooterSec/>
          <ChatbotWidget />
        </div>
    </div>
  )
}

export default Body