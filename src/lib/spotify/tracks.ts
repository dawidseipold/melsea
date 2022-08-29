export const getTrack = async (token: string, id: string) => {
  return fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
