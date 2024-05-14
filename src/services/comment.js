import axios from "axios";

const baseURL = "http://localhost:3000/api/comments";

export const createComment = async (comment) => {
    try {
        const response = await axios.post(baseURL, comment);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
}

export const getCommentsByPublicationId = async (publicationId) => {
    try {
        const response = await axios.get(`${baseURL}/publication/${publicationId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
    }
}
