/**
 * Validates if a LeetCode username exists.
 * 
 * @param {string} username - The LeetCode username to validate.
 * @returns {Promise<boolean>} - Returns true if the user exists, otherwise false.
 */
const isValid = async (username) => {
    try {
        const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
        const response = await fetch(url);
        const data = await response.json();

        // Check if the response contains errors
        // It could be a network error though.
        if (data.hasOwnProperty("errors")) {
            const errors = data["errors"];
            const firstError = errors[0];
            if (firstError["message"].includes("user does not exist")) {
                return false;
            }
            return false; //Keep this for now
        }

        return true;
    } catch {
        return false;
    }
}

export default isValid;
