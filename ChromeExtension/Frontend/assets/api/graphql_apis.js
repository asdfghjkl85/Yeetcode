export const userRecentSubmissions = async (username, limit) =>{ 
    try{ 
        const payload = { username, limit};

        const response = await fetch("https://yeetcode-production-a720.up.railway.app/api/userRecentSubmissions", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify(payload)  
          });

        const data = await response.json();
        return data;
    } catch (error){
        console.error("Error: ", error);
        return {};
    }
};

export const validateUser = async (username) => {
    try {
        const payload = {username};

        const response = await fetch('https://yeetcode-production-a720.up.railway.app/api/validateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error: ", error);
        return false; 
    }
}