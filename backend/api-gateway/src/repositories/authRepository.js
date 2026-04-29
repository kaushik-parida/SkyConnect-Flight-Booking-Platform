const axios = require("axios");
const { authServiceUrl } = require("../config/services");

exports.login = async (data) => {
    try {
        const response = await axios.post(
            `${authServiceUrl}/api/v1.0/flight/admin/login`,
            data
        );

        return response.data;
    } catch (err) {
        console.log("Auth repo error:", err.message);
        throw err;
    }
};