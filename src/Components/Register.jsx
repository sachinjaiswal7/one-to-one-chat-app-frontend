import React from 'react'
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import {AiOutlineLoading3Quarters} from "react-icons/ai"


const Register = ({registerSubmitHandler,navigate,me,setMe,setRefToClickedPeople}) => {

  //useEffect for checking if the token is there or not 
  useEffect(() => {
    const token = Cookies.get("token");
    
    if(token){
      navigate('/');
    }
  },[navigate])



  return (
    <form  onSubmit={(e) => {
      registerSubmitHandler(e,navigate,me,setMe,setRefToClickedPeople);
    }
    }className='register-container'>
      <span>Sachin's Chat App</span>
      <input required type="text" className='style-input' id='name' placeholder='Name' />

      <input required type="email" className='style-input' placeholder='Email'  id='email'/>

      <input required type="password" className='style-input' id='password' placeholder='Password' />

      <label htmlFor="photo">Photo</label>
      <input  type="file" id="photo"/>
      <button type='submit'>Register</button>
      <div>You do have an account? <a href="/login">Login</a></div>
      <div className='processing '><AiOutlineLoading3Quarters/>  <p> Processing...</p></div>
    </form>
  )
}

export default Register