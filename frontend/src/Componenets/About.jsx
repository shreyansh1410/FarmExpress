import React from 'react'
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section id="about" className='px-4 py-14 sm:px-6'>
        <h1 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-2 flex justify-center text-base-content">How it Works?</h1>
        <div className="reveal-on-scroll w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>

        <div className="reveal-on-scroll flex justify-center">
  <ul className="timeline max-w-5xl">
    <li>
      <div className="timeline-start timeline-box mb-7 apple-glass apple-glass-hover reveal-on-scroll reveal-left font-semibold text-lg transition-all duration-300">Login / Sign Up</div>
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm4.5-12.5a1 1 0 00-1.6-1.2L9.5 14l-2.1-2.1a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <hr className="bg-primary h-1" />
    </li>

    <li>
      <hr className="bg-primary h-1" />
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm4.5-12.5a1 1 0 00-1.6-1.2L9.5 14l-2.1-2.1a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="timeline-end timeline-box mt-3 apple-glass apple-glass-hover reveal-on-scroll reveal-right font-semibold text-lg transition-all duration-300">
        Add Truck
      </div>
      <hr className="bg-primary h-1" />
    </li>

    <li>
      <hr className="bg-primary h-1" />
      <div className="timeline-start timeline-box mb-7 apple-glass apple-glass-hover reveal-on-scroll reveal-left font-semibold text-lg transition-all duration-300">Schedule Route</div>
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm4.5-12.5a1 1 0 00-1.6-1.2L9.5 14l-2.1-2.1a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <hr className="bg-primary h-1" />
    </li>

    <li>
      <hr className="bg-primary h-1" />
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm4.5-12.5a1 1 0 00-1.6-1.2L9.5 14l-2.1-2.1a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="timeline-end timeline-box mt-3 apple-glass apple-glass-hover reveal-on-scroll reveal-right font-semibold text-lg transition-all duration-300">Merge Trucks</div>
      <hr className="bg-base-300 h-1" />
    </li>

    <li>
      <hr className="bg-base-300 h-1" />
      <div className="timeline-start timeline-box mb-7 apple-glass apple-glass-hover reveal-on-scroll reveal-left font-semibold text-lg transition-all duration-300">Dispatch Trucks</div>
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-base-content/60 h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M12 22a10 10 0 100-20 10 10 0 000 20zm4.5-12.5a1 1 0 00-1.6-1.2L9.5 14l-2.1-2.1a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </li>
  </ul>
</div>



<div className="reveal-on-scroll flex flex-col items-center mt-8">
<Link to="/truck">
  <button className="btn btn-primary text-lg px-6 py-3 shadow-md hover:scale-105 transition-transform backdrop-blur">
    Schedule
  </button>
</Link>
  <p className="mt-5 text-lg font-semibold opacity-70">
    Schedule Your Route Today!
  </p>
</div>

    </section>
  )
}

export default About