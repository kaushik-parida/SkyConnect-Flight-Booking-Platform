const axios = require("axios");


exports.searchFlights = async (req, res) => {
    try {
        const searchData = req.body;

        console.log("Gateway: Forwarding search request");

        const response = await axios.post(
            "http://localhost:8082/api/v1.0/flight/search", // match flight service
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
        console.error("Error calling Flight Service (search):", error.message);

        res.status(500).json({
            message: "Flight search failed"
        });
    }
};



exports.createFlight = async (req, res) => {
    try {
        const response = await axios.post(
            "http://localhost:8082/api/v1.0/flights",
            req.body,
            {
                headers: {
                    "X-User-Id": req.user.id,
                    "X-User-Email": req.user.email,
                    "X-User-Role": req.user.role
                }
            }
        );

        return res.status(201).json(response.data);

    } catch (error) {

        console.error("Gateway Error:", error.response?.status);


        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "Error from Flight Service"
            });
        }


        return res.status(500).json({
            message: "Flight create failed"
        });
    }
};