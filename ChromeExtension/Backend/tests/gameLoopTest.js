import updateSubmission from "../utils/gameLoop.js";

async function main(player1, player2, problemList) {
    const correctSubmissions = await updateSubmission(player1, player2, problemList)
    console.log(correctSubmissions);
}

let myUserList = ["Priyansh_31dec", "Errichto"];
let myProblemList = [
    "merge-two-2d-arrays-by-summing-values",
    "partition-array-according-to-given-pivot",
    "apply-operations-to-an-array"
];
main(myUserList[0], myUserList[1], myProblemList);