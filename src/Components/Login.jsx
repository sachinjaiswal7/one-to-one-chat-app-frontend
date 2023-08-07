import React from 'react'
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const Login = ({loginSubmitHandler,navigate,me,setMe,setRefToClickedPeople}) => {

  // useEffect for checking if the token is there or not 
  useEffect(() => {
    const token = Cookies.get("token");
    if(token){
      navigate('/');
    }
  },[navigate])



  return (
    <form onSubmit={(e) => {
      loginSubmitHandler(e,navigate,me,setMe,setRefToClickedPeople);
      
    }
    } className='login-container'>
      <span>Sachin's Chat App</span>
      <input required className='style-input' type="email" placeholder='Email' />
      <input required className='style-input' type="password" placeholder='Password' />
      <button type='submit'>Login</button>
      <div>You already have an account?<a href="/register">Register</a></div>
    </form>
  )
}

export default Login