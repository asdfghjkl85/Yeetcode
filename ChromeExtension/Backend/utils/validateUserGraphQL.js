export async function validateUser(username) {
    username = username.toLowerCase();
    username = username.trim(); 
    const query = `
      query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
              username
          }
      }
  `;
    try {
      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
      body: JSON.stringify({ query, variables: { username } }),
      });
  
      const data = await response.json();
      var postedUsername = data.data.matchedUser.username;
      postedUsername = postedUsername.toLowerCase(); 
      return postedUsername === username
    } catch(error) {
      console.log(error); 
      return false;
    }
  }
  