import axios from "axios";

const baseURL = "http://localhost:3000/api/messages";

export const getMessages = async (chatRoomId) => {
    try {
        const response = await axios.get(`${baseURL}/${chatRoomId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
    }
}

