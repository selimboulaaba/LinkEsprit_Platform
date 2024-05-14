import axios from "axios";

const url = "http://localhost:3000/api/sectors";

export const getSectors = async () => {
    return await axios.get(url);
};

export const getSector = async () => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching sectors: ${error.message}`);
    }
};

export const createSector = async (sector) => {
    try {
        const response = await axios.post(url, sector);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating sector: ${error.message}`);
    }
};
export const updateSector = async (sectorId, data) => {
    try {
        console.log('Updating sector with ID:', sectorId);
        const response = await axios.put(`${url}/update/${sectorId}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An error occurred while updating the sector.');
        }
    }
};

export const deleteSector = async (sectorId) => {
    try {
        const response = await axios.delete(`${url}/${sectorId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting sector: ${error.message}`);
    }
};
