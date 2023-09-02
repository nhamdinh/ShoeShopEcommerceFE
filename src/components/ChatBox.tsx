import "./style.scss";

import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { getUserInfo } from "../store/selector/RootSelector";
import socketIOClient from "socket.io-client";
import { SOCKET_HOST } from "../utils/constants";
import { useGetStoryQuery } from "../store/components/auth/authApi";
import Loading from "./LoadingError/Loading";
import { rawMarkup } from "../utils/commonFunction";

export default function ChatBox() {
  const userInfo = useSelector(getUserInfo);
  const [stories, setStories] = useState<any>([]);
  const [showMessageBox, setShowMessageBox] = useState<any>(false);

  const [params, setParams] = useState<any>({
    user1: "",
    user2: "",
  });

  const {
    data: dataStory,
    error,
    isSuccess,
    isLoading,
  } = useGetStoryQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  useEffect(() => {
    if (isSuccess) {
      if (dataStory?.chatStories?.story) {
        setStories(dataStory?.chatStories?.story);
      } else {
        setStories([]);
      }
    }
  }, [dataStory]);

  useEffect(() => {
    scrollToBottom();
  }, [stories, showMessageBox]);

  /*Server socketIo  */
  const [socketUsernameTo, setSocketUsernameTo] = useState<any>("");
  const [phone, setphone] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  // const [socketId, setIdSocketId] = useState<any>();
  const socketRef = useRef<any>();
  const messageRef = useRef<any>(null);

  useEffect(() => {
    if (userInfo?.admins) {
      setParams({ user1: userInfo?.email, user2: userInfo?.admins[0]?.email });
      setSocketUsernameTo(userInfo?.admins[0]?.email);
      setphone(userInfo?.admins[0]?.phone);
    }
    //@ts-ignore
    socketRef.current = socketIOClient.connect(SOCKET_HOST);

    socketRef.current.on("serverSetSocketId", (socketId: any) => {
      //   setIdSocketId(socketId);
    });

    socketRef.current.on("serverSendData", (data: any) => {
      // console.log("serverSendData ::: ", data);

      if (userInfo?.email === data.to || userInfo?.email === data.sendFrom) {
        setStories((oldMsgs: any) => [...oldMsgs, data]);
        if (userInfo?.email !== data.sendFrom) {
          setSocketUsernameTo(data.sendFrom);
        }
        setShowMessageBox(true);
        scrollToBottom();
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [userInfo]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgToServer = {
        // socketId: socketId,
        content: message,
        sendFrom: userInfo?.email,
        to: socketUsernameTo,
        time: moment(Date.now()),
      };
      socketRef.current.emit("clientSendData", msgToServer);
      setMessage("");
      messageRef.current.focus();
    }
  };

  const scrollToBottom = () => {
    const element = document.getElementById("section-1");
    if (element) {
      element.scrollIntoView();
    }
  };

  const renderStory = stories.map((story: any, index: number) => {
    return (
      <div
        key={index}
        className={
          story?.sendFrom === userInfo?.email
            ? `your__message`
            : `other__people`
        }
      >
        <p>{moment(story?.time).format("llll")}</p>
        <div dangerouslySetInnerHTML={rawMarkup(story?.content)}></div>
      </div>
    );
  });

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage();
    }
  };

  /*Server socketIo  */

  return (
    <div className="ChatBox">
      {showMessageBox ? (
        <div className={"box__chat"}>
          <p
            onClick={() => {
              setShowMessageBox(false);
            }}
            className="box__chat__name"
          >
            {socketUsernameTo} - {phone}
          </p>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="box__chat_message">
              {renderStory}
              <div
                id="section-1"
                style={{ float: "left", clear: "both" }}
              ></div>
            </div>
          )}

          <div className="send__box">
            <textarea
              ref={messageRef}
              value={message}
              onKeyDown={onEnterPress}
              onChange={(event) => {
                if (event.target.value !== "\n") setMessage(event.target.value);
              }}
              placeholder="Enter message ..."
            />
            <button className="send__box__button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <img
          className={"ppp"}
          onClick={() => {
            setShowMessageBox(true);
          }}
          src="./images/icons8-facebook-messenger.gif"
          alt="userprofileimage"
        />
      )}
    </div>
  );
}
