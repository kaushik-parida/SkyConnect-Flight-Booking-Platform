const axios = require("axios");


const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL;


const SEARCH_FLIGHT_URL = FLIGHT_SERVICE_URL + "/api/v1.0/flight/search";
const CREATE_FLIGHT_URL = FLIGHT_SERVICE_URL + "/api/v1.0/flights";


exports.searchFlights = async (req, res) => {
    try {
        const searchData = req.body;

        console.log("Gateway: Forwarding search request");

        const response = await axios.post(
            SEARCH_FLIGHT_URL,
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
            CREATE_FLIGHT_URL,
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