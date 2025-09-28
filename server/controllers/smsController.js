import axios from "axios";

export const send = async (req, res) => {
    const { phone_no, seconds } = req.body;

    // Clean the environment variables (remove spaces/invisible characters)
    const API_URL = process.env.API_URL?.trim();
    const ORIGIN = process.env.ORIGIN?.trim();

    try {
        console.log("Cleaned API_URL:", `"${API_URL}"`); // Quotes will show hidden spaces
        console.log("Cleaned ORIGIN:", `"${ORIGIN}"`);

        const response = await axios.post(
            `${API_URL}/send-otp`,
            {
                phone_no,
                seconds,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Origin: ORIGIN,
                },
            }
        );

        res.json({
            success: true,
            phone_no,
            seconds,
            message: "SMS forwarded successfully 🎉",
            apiResponse: response.data,
        });
    } catch (error) {
        console.error(
            "Error from axios:",
            error.response?.data || error.message
        );
        console.error("Full URL attempted:", `"${API_URL}/send-otp"`);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data,
        });
    }
};
