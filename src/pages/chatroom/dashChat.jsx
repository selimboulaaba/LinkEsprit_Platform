import { createRef, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import ChatroomPage from "./chatroompage";
import { useAuth } from "../../context/userContext";
import { getChatrooms } from '../../services/chatroom';

const DashChat = () => {
  const { user } = useAuth();
  const [chatrooms, setChatrooms] = useState([]);
  const [chatroomName, setChatroomName] = useState("");
  const [showChatroom, setShowChatroom] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  const handleChatNameChange = (event) => {
    setChatroomName(event.target.value);
  }

  const fetchChatrooms = async () => {
    try {
      const response = await getChatrooms(user._id);
      
      setChatrooms(response);
    } catch (error) {
      console.error('Error fetching Chatrooms:', error);
    }
  }
  useEffect(() => {
    fetchChatrooms();
    // eslint-disable-next-line
  }, [user]);

  const joinChatroom = (chatroom) => {
    setShowChatroom(true);
    setSelectedChatroom(chatroom);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="px-6 py-6">
        <div className="flex flex-wrap -mx-3">
          {/* Left side */}
          <div className="w-full md:w-1/2 px-3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="font-semibold text-xl mb-4">Chatrooms</div>
              <div>
                <input
                  type="text"
                  id="chatroomName"
                  name="chatroomName"
                  value={chatroomName}
                  onChange={(event) => handleChatNameChange(event)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                {chatrooms.map((chatroom) => (
                  <button
                    key={chatroom._id}
                    onClick={() => joinChatroom(chatroom)}
                    className="w-full py-2 px-4 bg-gray-200 text-left text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {chatroom.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Right side */}
          <div className="w-full md:w-1/2 px-3 mt-6 md:mt-0">
            <div className="bg-gray-100 shadow-md rounded-lg p-6">
              {showChatroom && <ChatroomPage chatroom={selectedChatroom} chatroomId={selectedChatroom._id} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default DashChat;
