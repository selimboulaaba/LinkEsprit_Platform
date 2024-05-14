import axios from "axios";

const baseURL = "http://localhost:3000/api/applications";

export const postApplication = async (application) => {
    try {
        const formData = new FormData();
        formData.append('offerId', application.offerId);
        formData.append('userId', application.userId);
        formData.append('pdfFile', application.pdfFile);
        const response = await axios.post(baseURL, formData);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating application: ${error.message}`);
    }
}
export const updateApplication = async (applicationId, data) => {
    try {
       console.log(data)
        const response = await axios.put(baseURL+"/update/"+ applicationId, data);
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An error occurred while updating the test.');
        }
    }
};

export const verifyUserApplying = async (userId, offerId) => {
    try {
        const response = await axios.get(baseURL + "/verify/" + userId + "/" + offerId);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating application: ${error.message}`);
    }
}

export const getApplicationsByOffer = async (offerId) => {
    try {
        const response = await axios.get(baseURL + "/offer/" + offerId);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating application: ${error.message}`);
    }
}

export const replyToApplication = async (applicationId, state) => {
    try {
        const response = await axios.put(baseURL + "/reply/" + applicationId + "/" + state);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating application: ${error.message}`);
    }
}

