import React, { useState } from "react";
import "./Home.css";
import NavBar from "./NavBar";
import Contact, { Dm } from "./Contact";
import ChatBox from "./ChatBox";

const Home = () => {
  const [contactRender, setContactRender] = useState(<Dm />);

  return (
    <div className="Home">
      <NavBar setContactRender={setContactRender} />
      <Contact contactRender={contactRender} />
      <ChatBox />
    </div>
  );
};

export default Home;
