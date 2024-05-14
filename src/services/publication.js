import axios from "axios";

const baseURL = "http://localhost:3000/api/publications"; // Define baseURL outside the function

export const getPublications = async (page, userId) => {
    const url = `${baseURL}/${userId}?page=${page}`; // Use baseURL to construct the URL
    try {
        const response = await axios.get(url);
        return response.data; // Return response data
    } catch (error) {
        throw new Error(`Error fetching publications: ${error.message}`);
    }
};
export const createPublication = async (publication) => {
    try {
        const response = await axios.post(baseURL, publication);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating publication: ${error.message}`);
    }
}
export const updateLikes = async (publicationId, likeUserId) => {
    try {
        const response = await axios.put(`${baseURL}/updateLikes/${publicationId}`, { likeUserId });
        return response.data;
    } catch (error) {
        throw new Error(`Error updating likes: ${error.message}`);
    }
}
export const getLikesFromPublications = async (publicationId) => {
    const url = `${baseURL}/likes/${publicationId}`;
    try {
        const response = await axios.get(url);
        return response.data; // Return response data
    } catch (error) {
        throw new Error(`Error fetching publications: ${error.message}`);
    }
};