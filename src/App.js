import "./App.scss";
import MainBar from "./Components/MainBar";
import SideBar from "./Components/SideBar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import io from "socket.io-client"
import toast from "react-hot-toast";




//navigate vairable 
let navigate;
// socket variable 
const socket = io.connect(process.env.REACT_APP_SERVER_URL);
const baseUrl = process.env.REACT_APP_SERVER_URL;

//react project base-url
const thisBaseUrl = process.env.REACT_APP_CLIENT_URL;






//important functions 


//function to set the cookie with a 2 day of  expiring duration 
const setCookie = (token) => {
  Cookies.set("token", token, {
    expires: 2,
    secure: true
  })

}




// this function for registering a user to the database 
const registerSubmitHandler = async (e, relocate, me, setMe, setRefToClickedPeople) => {
  e.preventDefault();
  const name = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  let photo = null;
  if (e.target[3].files[0]) {
    photo = e.target[3].files[0];
  }


  try {
    let res = null;
    // console.log("photo -> " + photo);
    document.querySelector(".processing").classList.add("processing-true");
    if (!photo) {
      res = await axios.post(baseUrl + `/authentication/register`, {
        name,
        email,
        password
      })

    }
    else {
      console.log("second");
      res = await axios.post(baseUrl + `/authentication/register`, {
        name,
        email,
        password,
        photo
      }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    }

    document.querySelector(".processing").classList.remove("processing-true");
    setCookie(res.data.token);
    toast.success(res.data.message);
    relocate("/");



  } catch (err) {
    document.querySelector(".processing").classList.remove("processing-true");
    Cookies.remove("token");
    toast.error(err.response.data.message);
  }

}


// this function is to login a user in the data base.
const loginSubmitHandler = async (e, relocate, me, setMe, setRefToClickedPeople) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    const res = await axios.post(baseUrl + `/authentication/login`, {
      email,
      password
    })

    setCookie(res.data.token);
    toast.success(res.data.message);
    relocate("/");

  } catch (err) {
    Cookies.remove("token");
    toast.error(err.response.data.message);
    console.log(err);
  }
}

// function to logout of the website 
const logoutHandler = (setRefToClickedPeople) => {
  Cookies.remove("token");
  navigate("/login");
  setRefToClickedPeople(null);
  toast.success("Logout Successful");
}


//function to handle the sending of the message between the users 
const sendMessageHandler = async (e, chatIncrement, setChatIncrement, refToClickedPeople, chatBottomRef) => {
  e.preventDefault();
  await socket.emit("send_message", { token: Cookies.get("token"), to: refToClickedPeople, message: e.target[0].value });
  e.target[0].value = "";
  setChatIncrement(chatIncrement + 1);
  console.log(chatIncrement);
}



function App() {
  navigate = useNavigate();
  const [refToClickedPeople, setRefToClickedPeople] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [chatIncrement, setChatIncrement] = useState(0);
  const [me, setMe] = useState(null);
  const chatBottomRef = useRef(null);
  const [currentChaterDetail, setCurrentChaterDetail] = useState(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatData]);

  // using the useEffect on change of the variable refToClickedPeople
  useEffect(() => {
    const fetchOnePersonChat = async () => {
      if (!refToClickedPeople) return;
      console.log("went throught");
      try {
        const res = await axios.get(process.env.REACT_APP_SERVER_URL + `/data/get_one_people_chats/${refToClickedPeople}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        });
        setChatData(res.data.chats);
      } catch (err) {
        toast.error("Couldn't fetch the chat of the person due to internal error");
      }
    }
    fetchOnePersonChat();
  }, [refToClickedPeople, chatIncrement]);




  //using the useEffect hook
  useEffect(() => {


    const token = Cookies.get("token");
    if (!token) {
      const curUrl = window.location.href;
      if (curUrl === thisBaseUrl) {
        navigate("/login");
      }
    }
  }, [])




  // this useEffect is for the receiver of the message
  useEffect(() => {
    socket.on(`receive_message`, async (data) => {
      try {
        const res1 = await axios.get(process.env.REACT_APP_SERVER_URL + `/data/get_me`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        })
        if (data.to.toString() === res1.data.me._id.toString()) {
          const fetchOnePersonChat = async () => {
            if (!refToClickedPeople) return;

            const res = await axios.get(process.env.REACT_APP_SERVER_URL + `/data/get_one_people_chats/${refToClickedPeople}`, {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
              }
            });
            setChatData(res.data.chats);

          }
          fetchOnePersonChat();
        }
      } catch (err) {
        toast.error("Couldn't fetch the chat of the person due to internal error");

      }
    });

  })


  useEffect(() => {
    if (Cookies.get("token")) {
      const fetchMineDetail = async () => {
        try {
          const res = await axios.get(process.env.REACT_APP_SERVER_URL + `/data/get_me`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`
            }
          })
          setMe(res.data.me);
        } catch (err) {
          console.log("do nothing");
        }
      }
      fetchMineDetail();
    }

    if (refToClickedPeople) {
      const fetchChaterDetail = async () => {
        try {
          const res = await axios.get(process.env.REACT_APP_SERVER_URL + `/data/get_one_people_infomation/${refToClickedPeople}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`
            }
          })
          setCurrentChaterDetail(res.data.data);
        }
        catch (err) {
          toast.error("Chater data wasn't fetched");
        }
      }
      fetchChaterDetail();
    }
  }, [refToClickedPeople])

  return (

    <Routes>

      <Route
        path="/"
        element={
          <div className="app">
            <SideBar me={me} logoutHandler={logoutHandler} refToClickedPeople={refToClickedPeople} setRefToClickedPeople={setRefToClickedPeople} />
            <MainBar me={me} setRefToClickedPeople={setRefToClickedPeople} currentChaterDetail={currentChaterDetail} chatBottomRef={chatBottomRef} refToClickedPeople={refToClickedPeople} sendMessageHandler={sendMessageHandler} chatIncrement={chatIncrement} setChatIncrement={setChatIncrement} chatData={chatData} />
          </div>
        }
      />
      <Route path="/register" setRefToClickedPeople={setRefToClickedPeople} element={<Register me={me} setMe={setMe} registerSubmitHandler={registerSubmitHandler} navigate={navigate} />} />
      <Route path="/login" setRefToClickedPeople={setRefToClickedPeople} element={<Login me={me} setMe={setMe} loginSubmitHandler={loginSubmitHandler} navigate={navigate} />} />
    </Routes>

  );
}

export default App;
