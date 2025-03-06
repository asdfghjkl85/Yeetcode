//Not a unit test js file, but can test basic functionality
import getUserData from "../utils/leetcodeUser.js"
const userList = ["Errichto"];
const params = ["recentSubmissions"];

async function main() {
    userList.forEach(async function(user) {
        const currentUserData = await getUserData(user, params);
        let recentSubmissions = currentUserData.get("recentSubmissions");
        let mostRecent = recentSubmissions[0];
        //console.log(mostRecent);
        console.log(user + "---> " + mostRecent["titleSlug"] + ": " + mostRecent["statusDisplay"]);
    });
}

main();
