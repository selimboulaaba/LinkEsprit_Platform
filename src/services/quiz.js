import axios from "axios";

const url = "http://localhost:3000/api/quiz";




export const getQuiz = async () => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Quiz: ${error.message}`);
    }
};
export const getQuizById = async (quizId) => {
    try {
        const response = await axios.get(`${url}/${quizId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching quiz: ${error.message}`);
    }
};

export const createQuiz = async (quiz) => {
    try {
        const response = await axios.post(url, quiz);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating quiz: ${error.message}`);
    }
};
export const updateQuiz = async (quizId, data) => {
    try {
        console.log('Updating quiz with ID:', quizId);
        const response = await axios.put(`${url}/update/${quizId}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An error occurred while updating the quiz.');
        }
    }
};
export const generateQuiz = async (data) => {
    try {
        const response = await axios.post("http://localhost:3000/api/openAI", data);
        return response.data;
    } catch (error) {
        throw new Error(`Error generating quiz: ${error.message}`);
    }
};

export const deleteQuiz = async (quizId) => {
    try {
        const response = await axios.delete(`${url}/${quizId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting quiz: ${error.message}`);
    }
};
