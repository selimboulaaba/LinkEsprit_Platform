import axios from "axios";

const url = "http://localhost:3000/api/test";




export const getTest = async () => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching test: ${error.message}`);
    }
};
export const getTestById = async (testId) => {
    try {
        const response = await axios.get(`${url}/${testId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching test: ${error.message}`);
    }
};

export const createTest = async (test) => {
    try {
        const response = await axios.post(url, test);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating test: ${error.message}`);
    }
};
export const updateTest = async (testId, data) => {
    try {
        console.log('Updating test with ID:', testId);
        const response = await axios.put(`${url}/update/${testId}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An error occurred while updating the test.');
        }
    }
};

export const deleteTest = async (testId) => {
    try {
        const response = await axios.delete(`${url}/${testId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting test: ${error.message}`);
    }
};
