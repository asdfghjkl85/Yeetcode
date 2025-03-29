import getUserData from "./leetcodeUser.js";

const NUM_USERS = 2;
const PARAMS = ["recentSubmissions"];

async function updateSubmission(player1, player2, problemList) {
    /*
    Input: players 1 and 2 (names)
           problemList: titleSlug of the Leetcode problems

    Returns: the updated submission page
        after every three seconds
    */
    const NUM_PROBLEMS = problemList.length;
    let userList = [player1, player2];
    let userToHash = new Map();  //assign each user a number
    let problemToHash = new Map();  //assign each problem a number
    
    for (var i = 0; i < NUM_USERS; i++) {
        userToHash.set(userList[i], i);
    }
    for (var i = 0; i < NUM_PROBLEMS; i++) {
        problemToHash.set(problemList[i], i);
    }

    // Initialize array with correct size
    var correctSubmissions = Array(NUM_USERS).fill().map(() => Array(NUM_PROBLEMS).fill(false));

    // Get game start time from window object
    const gameStartTime = window.GAME_START_TIME;
    if (!gameStartTime) {
        console.error("Game start time not found!");
        return correctSubmissions;
    }

    console.log("Checking submissions for problems:", problemList);
    console.log("Game started at:", new Date(gameStartTime).toISOString());

    for (var i = 0; i < NUM_USERS; i++) {
        let user = userList[i];
        try {
            const currentUserData = await getUserData(user, PARAMS);
            let recentSubmissions = currentUserData.get("recentSubmissions");
            
            console.log(`Recent submissions for ${user}:`, recentSubmissions);
            
            if (recentSubmissions && recentSubmissions.length > 0) {
                // Only check submissions made after game start time
                recentSubmissions.forEach(submission => {
                    console.log(`Checking submission:`, submission);
                    
                    // Check if the submission is for one of our problems
                    const problemSlug = submission.titleSlug || submission["titleSlug"];
                    if (!problemSlug) {
                        console.log("Submission missing titleSlug:", submission);
                        return;
                    }

                    // Convert Unix timestamp (seconds) to milliseconds
                    const submissionTime = parseInt(submission.timestamp) * 1000;
                    console.log(`Submission time: ${new Date(submissionTime).toISOString()}`);
                    
                    if (submissionTime >= gameStartTime && 
                        submission.statusDisplay === "Accepted" && 
                        problemList.includes(problemSlug)) {
                        console.log(`Found valid submission for ${user} on problem ${problemSlug}`);
                        const userIdx = userToHash.get(user);
                        const problemIdx = problemToHash.get(problemSlug);
                        correctSubmissions[userIdx][problemIdx] = true;
                    }
                });
            }
        } catch (error) {
            console.error(`Error fetching data for user ${user}:`, error);
        }
    }

    console.log("Final submission status:", correctSubmissions);
    return correctSubmissions;
}

export default updateSubmission;