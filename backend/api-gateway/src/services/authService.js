const axios = require("axios");
const { authServiceUrl } = require("../config/services");

exports.login = async (data) => {
  try {
    const response = await axios.post(`${authServiceUrl}/api/auth/login`, data);
    return response.data;
  } catch (error) {
    console.error("Auth service login error:", error.response?.data || error.message);
    throw error;
  }
};

exports.register = async (data) => {
  try {
    const response = await axios.post(`${authServiceUrl}/api/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error("Auth service register error:", error.response?.data || error.message);
    throw error;
  }
};