//Not a unit test js file, but can test basic functionality
const leetcodeUser = require("./leetcode_user");
const userList = ["Tofudog25"];
const params = ["recentSubmissions"];

async function main() {
    userList.forEach(async function(user) {
        const currentUserData = await leetcodeUser.getUserData(user, params);
        let recentSubmissions = currentUserData.get("recentSubmissions");
        let mostRecent = recentSubmissions[0];
        //console.log(mostRecent);
        console.log(user + "---> " + mostRecent["titleSlug"] + ": " + mostRecent["statusDisplay"]);
    });
}

main();
