const authService = require("../services/authService");

exports.login = async (request, response) => {
    try {
        const data = await authService.login(request.body);

        response.json(data);
    } catch (err) {
        console.log("Auth error:", err.message);

        response.status(500).json({ message: "Login failed" });
    }
};