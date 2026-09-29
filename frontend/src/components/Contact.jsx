import React, { useRef, useState } from "react";
import "./Contact.css";
import { useUser } from "../context/UserContext";
import axios from "axios";

// DM :-
export const Dm = () => {
  const {
    user,
    setUser,
    setChatFriend,
    chatFriend,
    newMessage,
    setNewMessage,
  } = useUser();

  async function addFriend(friendsId) {
    const isFriend = user.friends.some((item) => item._id === friendsId);
    if (!isFriend) {
      const res = await axios.patch(
        `http://localhost:5001/user/addfriend/${friendsId}`,
        {},
        { withCredentials: true },
      );

      setUser(res.data);
    }
    //else {
    //   console.log("friend alreadh exists");
    // }
  }

  // handle searching of friends
  const [searchResult, setSearchResult] = useState();
  const searchRef = useRef();
  const handleSearch = async (e) => {
    e.preventDefault();
    const name = searchRef.current.value;
    if (!name) return;

    try {
      const res = await axios.get(
        `http://localhost:5001/user/search/${name}`,

        { withCredentials: true },
      );

      setSearchResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeNewMessage = (friendId) => {
    setNewMessage((prev) =>
      prev.filter((id) => String(id) !== String(friendId)),
    );
  };

  const checkNewMessage = (friendId) => {
    const haveNewMessase = newMessage.find(
      (id) => String(id) === String(friendId),
    );
    return haveNewMessase;
  };

  return (
    <div className={chatFriend ? "contactBox smallScreen" : "contactBox"}>
      <h3>ChitChat</h3>
      <form className="searchBar" onSubmit={handleSearch}>
        <i className="fa-solid fa-magnifying-glass" onClick={handleSearch}></i>
        <input type="text" placeholder="Search" ref={searchRef} />
      </form>

      {searchResult ? (
        <div className="contactScrollBox">
          {searchResult.map((result) => {
            return (
              <div
                className="contact"
                key={result._id}
                onClick={() => {
                  addFriend(result._id);
                  setChatFriend(result);
                }}
              >
                <div className="dpImg">
                  <img
                    src={
                      result.profileImg ? result.profileImg : "userAvator.png"
                    }
                    alt=""
                  />
                  <div
                    className="activeStatus"
                    style={{
                      backgroundColor: result.isOnline
                        ? "lightgreen"
                        : "lightgray",
                    }}
                  ></div>
                </div>
                <div className="contactDetail">
                  <div className="contactName">
                    <p>{result.name}</p>
                    {/* <span className="lastMsg">2 am</span> */}
                  </div>
                  {/* <p className="lastMsg">{result.isOnline}</p> */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="contactScrollBox">
          {user?.friends?.map((friend) => {
            return (
              <div
                className="contact"
                key={friend._id}
                onClick={() => {
                  setChatFriend(friend);
                  removeNewMessage(friend._id);
                }}
              >
                <div className="dpImg">
                  <img
                    src={
                      friend.profileImg ? friend.profileImg : "userAvator.png"
                    }
                    alt=""
                  />
                  <div
                    className="activeStatus"
                    style={{
                      backgroundColor: friend.isOnline
                        ? "rgb(17, 189, 2)"
                        : "gray",
                    }}
                  ></div>
                </div>
                <div className="contactDetail">
                  <div className="contactName">
                    <p>{friend.name}</p>

                    <span
                      className={
                        checkNewMessage(friend._id) ? "showNew" : "hideNew"
                      }
                    >
                      new*
                    </span>
                  </div>
                  <p className="lastMsg">
                    {friend.isOnline
                      ? " online"
                      : `last seen ${new Date(friend.lastSeen).toLocaleString(
                          "en-US",
                          {
                            // weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// profie:-
export const Profile = () => {
  const { user, setUser, setChatFriend, chatFriend } = useUser();

  // handle user log out:-
  const handleLogOut = async () => {
    const res = await axios.post(
      "http://localhost:5001/user/logout",
      {},
      {
        withCredentials: true,
      },
    );
    setUser(null);
    setChatFriend(null);
    console.log(res.data.msg);
  };

  // handle profile image update :-
  const updateProfileImg = async (e) => {
    const image = e.target.files[0];
    const oldUrl = user.profileImg;
    // console.log("image:- ", image, "/n oldUsr;=", oldUrl);
    try {
      const res = await axios.post(
        "http://localhost:5001/user/updateprofileimg",
        { image, oldUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      // console.log(res.data, "profile image updated success");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={chatFriend ? "contactBox smallScreen" : "contactBox"}>
      <h3>ChitChat</h3>

      <div className="profile">
        <form action="">
          <div className="profilePhoto">
            <label htmlFor="ProfilePhoto">
              <img
                src={user.profileImg ? user.profileImg : "userAvator.png"}
                alt=""
              />
              <div>
                <i className="fa-solid fa-pen"></i>
              </div>
            </label>
            <input type="file" id="ProfilePhoto" onChange={updateProfileImg} />
          </div>
        </form>

        <div className="userName">{user.name}</div>
        <div className="userEmail">{user.email}</div>
        <button className="logOutBtn" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

const Contact = ({ contactRender }) => {
  return contactRender;
};

export default Contact;
