const authService = require("../services/authService");

exports.login = async (request, response) => {
    try {
        const credentials = request.body;

        console.log("Login request");

        const data = await authService.login(credentials);

        response.json(data);

    } catch (error) {
        console.error("Login error:", error.message);

        response.status(500).json({
            message: "Login failed"
        });
    }
};