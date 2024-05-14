import axios from "axios";
import {jwtDecode} from 'jwt-decode'; 
import Cookies from 'js-cookie';

const url = "http://localhost:3000/api"


export const decodeToken = () => {
    const token = Cookies.get('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken;
      } else {
        return null;
      }
}
export const signup = (user) => {
    return axios.post(url + "/signup", user);
}

export const signin = (user) => {

    return axios.post(url + "/login", user);
}
export const requestReset = (email) => {
    return axios.post(url + "/resetrequest", {email});
}
export const resetPassword = (password) => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('id');
    const token = queryParams.get('token');
    const requestUrl = `${url}/passwordReset?id=${userId}&token=${token}`;
    return axios.post(requestUrl, { password });
}
export const signinWithGoogle = (user) => {
    console.log(user)
    return axios.post(url + "/google-login-callback", user);
}

export const verifyExistingUser = (email) => {
    return axios.get(url + "/verifyExistingUser/" + email);
}


