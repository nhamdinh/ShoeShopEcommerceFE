import "./style.scss";

import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { getUserInfo } from "../store/selector/RootSelector";
import socketIOClient from "socket.io-client";
import { SOCKET_HOST } from "../utils/constants";
import { useGetStoryQuery } from "../store/components/auth/authApi";
export default function ChatBox() {
  const userInfo = useSelector(getUserInfo);

  const [params, setParams] = useState<any>({
    user1: "pagenumber ?? 1",
    user2: "keyword ?? ",
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
        console.log(dataStory)
    }
  }, [dataStory]);

  /*Server socketIo  */
  const [socketUsernameTo, setSocketUsernameTo] = useState<any>("");
  const [phone, setphone] = useState<any>("");
  const [stories, setStories] = useState<any>([]);
  const [message, setMessage] = useState<any>("");
  const [socketId, setIdSocketId] = useState<any>();
  const [showMessageBox, setShowMessageBox] = useState<any>(false);
  const socketRef = useRef<any>();
  const messagesEnd = useRef<any>();

  useEffect(() => {
    if (userInfo?.admins) {
      setSocketUsernameTo(userInfo?.admins[0]?.email);
      setphone(userInfo?.admins[0]?.phone);
    }
    //@ts-ignore
    socketRef.current = socketIOClient.connect(SOCKET_HOST);

    socketRef.current.on("serverSetSocketId", (socketId: any) => {
      setIdSocketId(socketId);
    });

    socketRef.current.on("serverSendData", (data: any) => {
      // console.log("serverSendData ::: ", data);

      if (userInfo?.email === data.to || userInfo?.email === data.sendFrom) {
        // setStories((oldMsgs: any) => [...oldMsgs, data]);
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
    if (message !== null) {
      const msgToServer = {
        socketId: socketId,
        content: message,
        sendFrom: userInfo?.email,
        to: socketUsernameTo,
        time: moment(Date.now()),
      };
      socketRef.current.emit("clientSendData", msgToServer);
      setMessage("");
    }
  };
  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };
  const renderStory = stories.map((story: any, index: number) => (
    <div
      key={index}
      className={
        story?.socketId === socketId ? `your__message` : `other__people`
      }
    >
      {story?.content}
    </div>
  ));

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage();
    }
  };

  /*Server socketIo  */

  return (
    <div className="ChatBox">
      {1 && (
        <div className="box__chat">
          <p
            onClick={() => {
              setShowMessageBox(false);
              //   setStories([]);
            }}
            className="box__chat__name"
          >
            {socketUsernameTo} - {phone}
          </p>
          <div className="box__chat_message">
            {renderStory}

            <div
              style={{ float: "left", clear: "both" }}
              ref={messagesEnd}
            ></div>
          </div>

          <div className="send__box">
            <textarea
              value={message}
              onKeyDown={onEnterPress}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              placeholder="Enter message ..."
            />
            <button className="send__box__button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
