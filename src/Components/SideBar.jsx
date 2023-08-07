import React, { useState } from "react";
import Friends from "./Friends";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {AiOutlineSearch} from "react-icons/ai"
// import _ from "lodash";

const SideBar = ({
  logoutHandler,
  refToClickedPeople,
  setRefToClickedPeople,
}) => {
  const [chatedPeopleList, setChatedPeopleList] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [caller, setCaller] = useState(false);
  const [me, setMe] = useState(null); // different set me than the one which is in app comaponent.

  useEffect(() => {
    if(Cookies.get("token")){
    const fetchMineDetail = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + `/data/get_me`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setMe(res.data.me);
      } catch (err) {
        console.log("do nothing");
      }
    };
    fetchMineDetail();
  }
  });

  //function to handle the search user input
  const searchHandler = (e) => {
    setSearchString(e.target.value);

    if (e.target.value === "") {
      setCaller(!caller);
      return;
    }
  };

  useEffect(() => {
    // function to find the other people which are associated with particular searchString
    const findSearchedPeople = async () => {
      if (searchString === "") return;
      try {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL +
            `/data/get_peoples_with_string/${searchString}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        // console.log(res);
        setChatedPeopleList(res.data.users);
      } catch (err) {
        console.log(err);
        // toast.error(err.response.data.message);
      }
    };

    findSearchedPeople();
  }, [searchString]);

  useEffect(() => {
    if (Cookies.get("token")) {
      const allChatedPeople = async () => {
        try {
          const res = await axios.get(
            process.env.REACT_APP_SERVER_URL + `/data/all_chated_people`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );
          const list = [];
          // finding the details of all the people whom this logged in person has chated with.
          for (let i = 0; i < res.data.friends.length; i++) {
            const innerRes = await axios.get(
              process.env.REACT_APP_SERVER_URL +
                `/data/get_one_people_infomation/${res.data.friends[i].to}`,
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              }
            );
            list.push(innerRes.data.data);
          }
          // setting the chated people to this variable.
          setChatedPeopleList(list);
        } catch (err) {
          console.log(err);
        }
      };

      allChatedPeople();
    }
  }, [caller]);

  return (
    <div className="side-bar">
      <div className="my-detail-section">
        <div>Chat APP</div>
        <div className="my-detail-section-right-part">
          <img src={me ? me.photoUrl : null} alt="" />
          <p>{me ? me.name : null}</p>
          <button style={{paddingInline:5}}
            onClick={() => {
              logoutHandler(setRefToClickedPeople);
            }}
          >
            Logout
          </button>
        </div>
      </div>
        
      <div className="search">
        <AiOutlineSearch/>
      <input
        value={searchString}
        onChange={async (e) => {
          searchHandler(e);
        }}
        type="text"
        placeholder="Search a user with name or email..."
      />
      </div>
      <div className="whole-friend">
        {chatedPeopleList.length > 0 ? (
          chatedPeopleList.map((item) => {
            return (
              <Friends
                key={item._id}
                name={item.name}
                photoUrl={item.photoUrl}
                refToClickedPeople={refToClickedPeople}
                setRefToClickedPeople={setRefToClickedPeople}
                id={item._id}
              />
            );
          })
        ) : (
          <div style={{ minWidth: 215, textAlign: "center" }}>Empty</div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
