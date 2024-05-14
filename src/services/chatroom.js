import axios from "axios";
const baseURL = "http://localhost:3000/api/chatroom/";



export const getChatrooms = async (userId) => {
    try {
        
        const response = await axios.get(baseURL+ userId);
        
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching chatrooms: ${error.message}`);
    }
   
  };