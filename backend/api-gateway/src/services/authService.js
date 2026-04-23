const axios = require("axios");
const { authServiceUrl } = require("../config/services");

exports.login = async (data) => {
    try {
        console.log("Calling JSON Server for login");

        const response = await axios.get(`${authServiceUrl}/users`);

        const user = response.data.find(
            (u) => u.email === data.email && u.password === data.password
        );

        if (!user) {
            throw new Error("Invalid credentials");
        }

        return {
            message: "Login successful",
            user: user
        };

    } catch (error) {
        console.error("Service error (auth):", error.message);
        throw error;
    }
};