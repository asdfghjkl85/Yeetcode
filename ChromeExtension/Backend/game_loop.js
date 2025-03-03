import getUserData from "./leetcode_user.js";

//we'll make this dynamic later
const NUM_USERS = 2;
const NUM_PROBLEMS = 3;

async function updateSubmission(player1, player2, problemList) {
    /*
    Input: players 1 and 2 (names)
           problemList: titleSlug of the Leetcode problems

    Returns: the updated submission page
        after every three seconds
    */

    let userList = [player1, player2];
    let userToHash = new Map();  //assign each user a number
    let problemToHash = new Map();  //assign each problem a number
    for (var i=0; i<NUM_USERS; i++) {userToHash.set(userList[i], i);}
    for (var i=0; i<NUM_PROBLEMS; i++) {problemToHash.set(problemList[i], i);}

    let correctSubmissions = [
        [false, false, false],
        [false, false, false]
    ];

    userList.forEach(async function(user) {
        //check if submission has passed
        const params = ["recentSubmissions"];
        const currentUserData = await getUserData(user, params);
        let recentSubmissions = currentUserData.get("recentSubmissions");
        let mostRecent = recentSubmissions[0];
        if (mostRecent["statusDisplay"] === "Accepted") {
            if (problemList.includes(mostRecent["titleSlug"])) {
                const userIdx = userToHash.get(user);
                const problemIdx = problemToHash.get(mostRecent["titleSlug"]);
                correctSubmissions[userIdx][problemIdx] = true;
            }
        }
    });

    return correctSubmissions;
}

export default updateSubmission;