export const sendGameProblems = async (problems, gameId) => { 
  try { 
    const payload = { problems };
    console.log(" Sending problems to backend:", payload, "Game ID:", gameId);

    const response = await fetch(`https://yeetcode-production-a720.up.railway.app/api/games/${gameId}/problems`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json(); // <-- parse response body

    if (!response.ok) {
      console.error("Failed to update problems:", data);
    } else {
      console.log(" Successfully sent problems:", data.leetcodeProblems);
    }

    return data;
  } catch (error) {
    console.error("Error sending problems to backend:", error);
  }
};

