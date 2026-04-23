import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from "react-router";
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]=useState("");
  const [registrationNumber, setRegistrationNumber]=useState("");
  const [isLogin, setIsLogin]=useState(true);
  const [error, setError]=useState("");

  const dispatch = useDispatch()
  const navigate=useNavigate();

  const HandleLogin = async () => {
    try {
        const res = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
        dispatch(addUser(res.data));

        // Check for admin credentials
        if (emailId === "Admin@gmail.com" && password === "Admin@123") {
            navigate('/admin');
        } else {
            navigate('/');
        }
    } 
    catch (err) {
        console.log(err);
        setError(err.response.data || "Something went wrong");
    }
};


  const HandleSignUp=async ()=>{
    try{
      const res= await axios.post(BASE_URL+ "/signup", {name, emailId, password, registrationNumber}, {withCredentials:true});
      dispatch(addUser(res.data.data));
      navigate('/')

    }
    catch(err){
      console.error(err);
      setError(err.response.data || "Something went wrong");
    }
  }

  return (
    <div className='flex justify-center px-4 py-10 sm:px-6'>
    <div className="card glass-panel apple-glass apple-glass-hover w-full max-w-md transition-all duration-300">
  <div className="card-body p-7">
    <h2 className="card-title justify-center text-2xl">{isLogin? "Welcome Back" : "Create Account"}</h2>
    <p className="text-center text-sm opacity-70 -mt-1 mb-2">
      {isLogin ? "Login to continue scheduling deliveries." : "Sign up and start planning your routes."}
    </p>
    <div>
    <label className="form-control w-full">

    {!isLogin && (
      <>
    <div className="label">
    <span className="label-text">Company Name</span>
  </div>
  <input type="text" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Type here" className="input input-bordered glass-input w-full" />

  <div className="label">
    <span className="label-text">Registration Number</span>
  </div>
  <input type="text" value={registrationNumber} onChange={(e)=> setRegistrationNumber(e.target.value)} placeholder="Type here" className="input input-bordered glass-input w-full" />
  </>)}

  <div className="label">
    <span className="label-text">E-mail ID </span>
  </div>
  <input type="text" value={emailId} onChange={(e)=> setEmailId(e.target.value)} placeholder="Type here" className="input input-bordered glass-input w-full" />

  <div className="label ">
    <span className="label-text">Password</span>
  </div>
  <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Type here" className="input input-bordered glass-input w-full" />



</label>
    </div>
    {error && (<p className="text-error text-sm mt-2">{error}</p>)}
    <div className="card-actions justify-center mt-4">
      <button className="btn btn-primary w-full" onClick={isLogin? HandleLogin : HandleSignUp}> {isLogin? "Login" : "Sign Up"}</button> 
    </div>
    <p onClick={()=> setIsLogin((value)=>!value)} className="text-center cursor-pointer text-sm mt-2 hover:text-primary transition-colors"> {isLogin? "New user? Sign up here": "Existing user? Login here"}</p>
  </div>
</div></div>
  )
}

export default Login