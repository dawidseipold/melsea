// GET

export const getUserShows = async (token: string) => {
  return fetch(`https://api.spotify.com/v1/me/shows`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
