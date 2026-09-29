import React, { useEffect, useRef, useState } from "react";
import "./ChatBox.css";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://chitchat-9dj6.onrender.com");
const ChatBox = () => {
  const { user, chatFriend, messageList, setMessageList, setNewMessage } =
    useUser();

  const fetchAllMessage = async () => {
    try {
      if (!chatFriend) return;
      const res = await axios.get(
        `https://chitchat-9dj6.onrender.com/message/allmessage/${chatFriend._id}`,
        {
          withCredentials: true,
        },
      );

      setMessageList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // to auto scroll to bottom when new message added
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {
    fetchAllMessage();
  }, [chatFriend]);

  // socket ->

  useEffect(() => {
    // Register this user with the server
    if (user) {
      socket.emit("registerUserMap", user._id);
    }
  }, []);

  useEffect(() => {
    const handler = (data) => {
      if (chatFriend && String(data.sender) === String(chatFriend._id)) {
        setMessageList(JSON.parse(data.message)); // append instead of overwrite
      } else {
        setNewMessage((prev) => {
          const exists = prev.some((id) => String(id) === String(data.sender));
          if (exists) {
            return prev;
          }
          return [...prev, String(data.sender)];
        });
      }
    };

    socket.on("newMessage", handler);

    //  Cleanup to prevent duplicate listeners
    return () => {
      socket.off("newMessage", handler);
    };
  }, [chatFriend, socket]);

  return (
    <>
      {chatFriend ? (
        <div className="chatBox">
          <div className="chatHeader">
            <div className="chatProfile">
              <img
                src={
                  chatFriend.profileImg
                    ? chatFriend.profileImg
                    : "userAvator.png"
                }
                alt=""
              />
              <div>
                <p>{chatFriend.name}</p>
                <span style={{ color: chatFriend.isOnline ? "green" : "gray" }}>
                  {chatFriend.isOnline
                    ? "Online"
                    : `Last seen ${new Date(chatFriend.lastSeen).toLocaleString(
                        "en-US",
                        {
                          // weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}`}
                </span>
              </div>
            </div>

            <div className="headerIcon">
              <div>
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <i className="fa-solid fa-video"></i>
              </div>
              <div>
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </div>
            </div>
          </div>

          <div className="chatSection">
            {messageList.map((message) => {
              return (
                <div
                  key={message._id}
                  className={
                    message.sender._id === user._id
                      ? "userMessage"
                      : "clientMessage"
                  }
                >
                  <div className="msgProfile">
                    <img
                      src={
                        message.sender.profileImg
                          ? message.sender.profileImg
                          : "userAvator.png"
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    {message.imageUrl ? (
                      <div>
                        <img
                          className="chatImage"
                          src={message.imageUrl}
                          alt=""
                        />
                      </div>
                    ) : (
                      <></>
                    )}

                    <p>{message.text}</p>
                    <span>
                      {new Date(message.createdAt).toLocaleString("en-US", {
                        // weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* this div to scroll to bottom automatically */}
            <div ref={bottomRef} />
          </div>

          <InputSection />
        </div>
      ) : (
        <EmptyChat />
      )}
    </>
  );
};

export default ChatBox;

const InputSection = () => {
  const { chatFriend, setMessageList } = useUser();
  const [formData, setFromData] = useState({
    messageImage: "",
    messageText: "",
  });
  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.messageImage || formData.messageText) {
      // console.log(formData);

      try {
        const res = await axios.post(
          `https://chitchat-9dj6.onrender.com/message/create/${chatFriend._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );

        setFromData({
          messageImage: "",
          messageText: "",
        });
        // console.log(res);
        setMessageList(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
  return (
    <div className="inputSection">
      <form action="" onSubmit={handleSubmit}>
        <label id="inputFileLabel" htmlFor="inputFile">
          <i className="fa-solid fa-paperclip"></i>
        </label>
        <input
          type="file"
          id="inputFile"
          name="messageImage"
          onChange={(e) =>
            setFromData({ ...formData, [e.target.name]: e.target.files[0] })
          }
        />
        <input
          type="text"
          placeholder="Type a message..."
          id="inputMessage"
          name="messageText"
          value={formData.messageText}
          onChange={(e) => {
            setFromData({ ...formData, [e.target.name]: e.target.value });
          }}
        />
        <button type="submit" className="inputSubmit">
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

const EmptyChat = () => {
  return (
    <div className="emptyChatBox">
      <div>
        <img src="chat.png" alt="" />
        <h3>START YOUR CONVERSATION</h3>
      </div>
    </div>
  );
};
