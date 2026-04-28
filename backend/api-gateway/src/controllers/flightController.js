const axios = require("axios");

exports.searchFlights = async (req, res) => {
    try {
        const searchData = req.body;

        console.log("Gateway: Forwarding request to Flight Service");

        const response = await axios.post(
            "http://localhost:8082/api/v1.0/flight/search", // change if needed
            searchData,
            {
                headers: {
                    "x-user-id": req.user.id,
                    "x-user-email": req.user.email,
                    "x-user-role": req.user.role
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error("Error calling Flight Service:", error.message);

        res.status(500).json({
            message: "Flight service error"
        });
    }
};