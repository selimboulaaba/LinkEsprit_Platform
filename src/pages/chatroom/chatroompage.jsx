import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/userContext";
import { getMessages } from "../../services/message";
import { getUserById } from "../../services/user";
import MDBox from "../../components/MDBox";
import EmojiPicker from "emoji-picker-react";
import {
  PhotoIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  StopIcon,
  MicrophoneIcon,
  TrashIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";

const ChatroomPage = ({ chatroom,chatroomId }) => {
  const { user, socket } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  

  const handleChatNameChange = (event) => {
    setMsg(event.target.value);
  };

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  }, [selectedFile]);
  useEffect(() => {
    
    setMessages([]);
    

    fetchMessages();
  }, [chatroom]);
  const messageEl = useRef(null);
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  const fetchMessages = async () => {
    try {
      
      setIsLoading(true);
      const response = await getMessages(chatroomId);
      const newMessages = response.messages;
      
      // Fetch user information for each message
      const messagesWithUsers = await Promise.all(
        newMessages.map(async (message) => {
          const user = await getUserById(message.user);
          return { ...message, user }; // Add user info to the message object
        })
      );
      setMessages([])
    

      setMessages((prevMessages) => [...prevMessages, ...messagesWithUsers]);

     
    } catch (error) {
      console.error("Error fetching Messages:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (date) => {
    const commentDate = new Date(date);
    const hours = commentDate.getHours().toString().padStart(2, "0");
    const minutes = commentDate.getMinutes().toString().padStart(2, "0");
    const day = commentDate.getDate().toString().padStart(2, "0");
    const month = (commentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = commentDate.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchMessages();
    
  }, [page, user]);

  const sendMessage = () => {
    if (socket) {
      
      socket.emit("chatroomMessage", {
        chatroomId,
        message: msg,
      });
      fetchMessages();
      

      setMsg("");
      setFilePreview(null);
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on("newMessage", (message) => {
        
        fetchMessages();
      });

      // Join the chatroom when component mounts or chatroom ID changes
      socket.emit("joinRoom", { chatroomId });

      // Handle disconnection and reconnection
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("connect", () => {
        console.log("Socket reconnected");
        socket.emit("joinRoom", { chatroomId });
        setMsg("");
      });
    }

    return () => {
      // Component unmount or socket disconnect
      if (socket) {
        socket.emit("leaveRoom", { chatroomId });
        setMsg("");
      }
    };
  }, [socket, chatroomId]);
  const handleSelectEmoji = (data) => {
    setMsg((previousValue) => previousValue + data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataURL = reader.result;
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };
  const removeImage = (index) => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <div className=" hidden lg:col-span-2 lg:block">
      <div className="w-full">
        <div className="relative flex flex-wrap  items-center border-b border-gray-300 lg:flex-nowrap">
          <div className="my-0 ml-0 flex  w-full flex-col justify-center lg:my-2 lg:ml-4  ">
            <div className="flex h-[50px] lg:h-auto">
              {/* <img
                src={selectedConversation.userProfilePic}
                alt="user-image"
                className="h-10 w-10 rounded-full object-cover"
              ></img> */}
              <div className="flex flex-col items-start text-left">
                <div className="flex flex-col items-start space-x-2">
                  <span className=" w-50 ml-2  block font-bold text-gray-600">
                    {chatroom.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mr-2 flex h-[3rem] w-full items-center justify-end space-x-4 self-end border-gray-300 md:h-[5rem]">
            <PhoneIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            <VideoCameraIcon
              className="h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          ref={containerRef}
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          {isLoading}
        </div>

        <div
          className="relative h-[320px] w-full overflow-y-auto bg-gray-100 p-6 lg:h-[480px]"
          ref={messageEl}
        >
          <ul className="space-y-1">
            {messages.map((message, i) => (
              <MDBox
                key={i}
                className="message"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                <MDBox
                  style={{
                    alignSelf:
                      user._id === message.user._id ? "flex-end" : "flex-start",
                    backgroundColor:
                      user._id === message.user._id ? "#cce6ff" : "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    padding: "10px",
                    width: "fit-content",
                  }}
                >
                  {user._id === message.user._id
                    ? `${message.message} `
                    : `${message.user.firstName} : ${message.message}`}
                </MDBox>
                <MDBox
                  style={{
                    alignSelf:
                      user._id === message.user._id ? "flex-end" : "flex-start",
                    width: "fit-content",
                    padding: "7px",
                  }}
                  className="text-xs text-gray-500 "
                >
                  {formatDate(message.messageDate)}
                </MDBox>
              </MDBox>
            ))}
          </ul>
        </div>
        <div className="flex w-full items-center justify-between border-gray-300 p-3 md:mb-0">
          <div className=" flex w-full flex-row items-center justify-center  ">
            <div className="mt-2">
              <button
                className="p-0"
                onClick={() => setOpenEmoji((prev) => !prev)}
              >
                <FaceSmileIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="">
              <label htmlFor="imageUpload">
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden cursor-pointer"
                  onChange={handleFileChange}
                />{" "}
                <PhotoIcon
                  className="h-6 w-6 cursor-pointer text-gray-400"
                  aria-hidden="true"
                />
              </label>
            </div>

            <input
              className="focus:border-primary focus:ring-primary ml-3 mr-3 w-full rounded-[22px] border border-gray-300 px-6 py-2 focus:outline-none focus:ring-1"
              placeholder="Type a message"
              value={msg}
              onChange={(e) => {
                handleChatNameChange(e);
              }}
            />
            <MicrophoneIcon
              className="mr-3 h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <button type="submit" onClick={() => sendMessage()}>
            <svg
              className="h-5 w-5 origin-center rotate-90 transform text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
        <EmojiPicker
          open={openEmoji}
          width={450}
          onEmojiClick={(e) => handleSelectEmoji(e.emoji)}
        />

        <div
          data-rbd-droppable-id="imageList"
          data-rbd-droppable-context-id="0"
          className="relative mt-4 grid w-full grid-cols-4 gap-3"
        >
          {filePreview && (
            <div className="relative">
              <img src={filePreview} className="h-15 w-full rounded-lg " />
              <div className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2">
                <button
                  onClick={() => removeImage()}
                  className="rounded-full bg-kindyorange p-1 text-white"
                >
                  <svg
                    stroke="#FFFFFF"
                    fill="#FFFFFF"
                    strokeWidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    height="14"
                    width="14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        <hr style={{ width: "100%", borderTop: "2px solid #ddd" }} />
        <br />
      </div>
    </div>
  );
};

export default ChatroomPage;
