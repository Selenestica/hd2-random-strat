const getCurrentGame = async (data) => {
  const savedGames = JSON.parse(localStorage.getItem(data)).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  });
  if (currentGame.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedGames);
    return;
  }
  return currentGame[0];
};
