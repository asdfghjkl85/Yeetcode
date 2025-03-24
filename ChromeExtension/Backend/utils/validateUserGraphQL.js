export async function validateUser(username) {
  username = username.toLowerCase();
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












/** TEST STUFF 
 * 
//<!-----GRAPHQL QUERIES-------------------!>
// import { graphql, buildSchema} from "graphql";
// import express from "express";
// import {createHandler} from "graphql-http/lib/use/express";  
// import {ruruHTML} from "ruru/server";

// const PORT = 4000;
// const app = express();
// app.use(express.json());

// app.post("/graphql", async (req, res) => {
//   try {
//     const { query, username} = req.body
//     console.log(query);
//     console.log(username);
//     const variables = { username };  
//     const response = await fetch("https://leetcode.com/graphql", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query, variables }),
//     });
  
//     const data = await response.json();

//     if (data.data && data.data.matchedUser.username) {
//       const username = data.data.matchedUser.username || null;
//       const githubUrl = data.data.matchedUser.githubUrl || null;
//       res.json({
//         success: true,
//         username: username,
//         githubUrl: githubUrl,
//       });
//     } else {
//       res.json({
//         success: false,
//         username: null,
//         githubUrl: null,
//       });
//     }
//   } catch (error) {
//     console.error("Error proxying to LeetCode:", error);
//     res.status(500).json({ error: "Failed to fetch from LeetCode API" });
//   }
// });

// app.get("/graphql", (_req, res) => {
//   res.type("html");
//   res.end(ruruHTML({ endpoint: "/graphql" }));
// });

// app.listen(PORT, () => {
//   console.log(`Server running on: http://localhost:${PORT}`);
// });
*/