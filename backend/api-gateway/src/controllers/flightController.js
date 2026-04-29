const axios = require("axios");

const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL;



exports.searchFlights = async (req, res) => {
    try {
        const searchData = req.body;

        console.log("Gateway: Forwarding search request");

        const response = await axios.post(
            `${FLIGHT_SERVICE_URL}/api/v1.0/flight/search`,
            searchData,
            {
                headers: {
                    "X-User-Id": req.user.id,
                    "X-User-Email": req.user.email,
                    "X-User-Role": req.user.role
                }
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.error("Search Error:", error.response?.status);


        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data?.message || "Error from Flight Service"
            });
        }

        return res.status(500).json({
            message: "Flight search failed"
        });
    }
};



exports.createFlight = async (req, res) => {
    try {

        console.log("Gateway: Forwarding create flight request");

        const response = await axios.post(
            `${FLIGHT_SERVICE_URL}/api/v1.0/flights`,
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

        console.error("Create Error:", error.response?.status);


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