import React from "react";
import "./NavBar.css";
import { Dm, Profile } from "./Contact";
import { useUser } from "../context/UserContext";
const NavBar = ({ setContactRender }) => {
  const { user, setChatFriend } = useUser();
  return (
    <div className="NavBar">
      <img className="logo" src="chat.png" alt="" />

      <div className="navLink">
        <div
          onClick={() => {
            setContactRender(<Dm />);
            setChatFriend(null);
          }}
        >
          <i className="fa-solid fa-comment-dots"></i>
          <p>DM</p>
        </div>
        <div
          onClick={() => {
            setContactRender(<Dm />);
            setChatFriend(null);
          }}
        >
          <i className="fa-solid fa-user-group"></i>
          <p>Groups</p>
        </div>
        <div
          onClick={() => {
            setContactRender(<Dm />);
            setChatFriend(null);
          }}
        >
          <i className="fa-solid fa-phone"></i>
          <p>Calls</p>
        </div>
        <div
          onClick={() => {
            setContactRender(<Profile />);
            setChatFriend(null);
          }}
        >
          <i className="fa-solid fa-user"></i>
          <p>Profile</p>
        </div>
        <div
          onClick={() => {
            setContactRender(<Profile />);
            setChatFriend(null);
          }}
        >
          <i className="fa-solid fa-gear"></i>
          <p>Setting</p>
        </div>
      </div>

      <div
        className="profileImg"
        onClick={() => {
          setContactRender(<Profile />);
          setChatFriend(null);
        }}
      >
        <img
          src={user.profileImg ? user.profileImg : "userAvator.png"}
          alt=""
        />
      </div>
    </div>
  );
};

export default NavBar;
