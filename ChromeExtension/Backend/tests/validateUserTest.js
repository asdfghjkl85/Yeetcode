import isValid from "../utils/validateUser.js";

async function main(username) {
    let exists = "";
    if (isValid(username)) {
        exists = "Yes";
    }
    else {
        exists = "No";
    }
    let message = `Is ${username} on Leetcode? ${exists}!`;
    console.log(message);
}

main("Tofudog23");