import axios from "axios";

const url = "http://localhost:3000/api/users"

export const getUsers = async () => {
    return await axios.get(url);
}
export const updateUser = async (user, password) => {
    try {
        let formData = new FormData();
        formData.append('file', user.file);
        formData.append('user', JSON.stringify(user));

        const response = await axios.post(`${url}/verifyPassword/${user._id}`, { password: password });
        if (response.data) {
            // Password verification successful, proceed with the update
            const updatedUserResponse = await axios.put(`${url}/update/${user._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return updatedUserResponse.data; // Return updated user data
        } else {
            // Password verification failed
            throw new Error('Wrong password!');
        }
    } catch (error) {
        throw error; // Handle any errors occurred during the password verification or user update
    }
};
export const getUserById = async (id) => {
    try {
        const response = await axios.get(url + "/" + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

export const desactivateUser = async (id) => {
    return await axios.put(url + "/desactivate/" + id);
}

export const activateUser = async (id) => {
    return await axios.put(url + "/activate/" + id);
}

export const verifyUser = async (id) => {
    return await axios.put(url + "/verify/" + id);
}

export const addAdmin = async (admin) => {
    return await axios.post(url + "/addAdmin", admin)
}

export const followUser = async (userId, followUserId) => {
    return await axios.post(url + "/follow/" + userId + "/" + followUserId)
}

export const unfollowUser = async (userId, followUserId) => {
    return await axios.post(url + "/unfollow/" + userId + "/" + followUserId)
}

export const getUserByName = async (name) => {
    try {
        const response = await axios.get(url + "/name/" + name);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by name:', error);
        throw error;
    }
}

export const getDashboard = async () => {
    try {
        const response = await axios.get(url + "/dashboard");
        return response.data;
    } catch (error) {
        console.log("Error fetching dashboard: ", error);
    }
}

export const getStudent = async (role) => {
    try {
        const response = await axios.get(url + "/students/" + role);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getSkills = async () => {
    try {
        const response = await axios.get(url + "/skills");
        return response.data;
    } catch (error) {
        console.error('Error fetching user by name:', error);
        throw error;
    }
}

export const updateSkills = async (id, skills) => {
    try {
        const response = await axios.put(url + "/skills/" + id, { skills: skills });
        return response.data;
    } catch (error) {
        console.error('Error fetching user by name:', error);
        throw error;
    }
}

export const getOwnSkills = async (id) => {
    try {
        const response = await axios.get(url + "/skills/" + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by name:', error);
        throw error;
    }
}