export const sendGameProblems = async (problems, gameId) => { 
  try { 
    const payload = { problems };
    console.log(" Sending problems to backend:", payload, "Game ID:", gameId);

    const response = await fetch(`http://localhost:3000/api/games/${gameId}/problems`, {
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


export const getGameProblems = async (gameId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/games/${gameId}/problems`);

    if (!response.ok) {
      throw new Error(`Failed to fetch problems for game ${gameId}`);
    }

    const data = await response.json();
    console.log(data.leetcodeProblems);

    return data.leetcodeProblems;
  } catch (error) {
    console.error("Error in getGameProblems:", error);
    return null;
  }
};