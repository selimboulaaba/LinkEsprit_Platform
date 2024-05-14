import axios from "axios";

const url = "http://localhost:3000/api/offers"

export const getOffers = async () => {
  return await axios.get(url);
}

export const addOffer = async (offer) => {
  return await axios.post(url, offer);
};
export const updateOffer = async (offer) => {

  return await axios.put(`${url}/update/${offer._id}`, offer);

};
export const getOfferById = async (id) => {
  const response = await axios.get(url + "/" + id);
  return response.data;

}

export const deleteOffer = async (id) => {
  return await axios.put(url + "/delete/" + id);
}

export const getOffersByUserId = async (id) => {
  return await axios.get(url + "/user/" + id);
}

export const getPostedOffers = async (id) => {
  return await axios.get(url + "/posted/" + id);
}
export const endOfferById = async (id, isEnded) => {
  try {
    const response = await axios.post(url + "/endOffer/" + id + "/" + isEnded);
    return response.data;
  } catch (error) {
    console.error('Error updating offer: ', error);
    throw error;
  }
}
export const recommendStudentForOffer = async (offerId, teacherId, studentId) => {
  const requestBody = {
    offerId,
    teacherId,
    studentId,
  };

  try {
    const response = await axios.post(url + "/recommend", requestBody);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const verifyStudentRecommendation = async (offerId, studentId) => {
  const requestBody = {
    offerId: offerId,
    studentId: studentId,
  };
  console.log("reqbody:", requestBody)
  try {
    const response = await axios.post(url + "/verifyStudent", requestBody);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
export const getRecommendedOffers = async (UserId) => {
  return await axios.get(url + "/recommended/" + UserId);
};
export const rejectOffer = async (RecommendationId) => {
  return await axios.put(url + "/reject/" + RecommendationId);
};

export const getOffferByPublication = async (pubId) => {
  try {
    const response = await axios.get(url + "/publication/" + pubId);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};