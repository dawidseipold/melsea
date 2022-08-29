export const getUserProfile = async (token: string, id: string) => {
  return fetch(`https://api.spotify.com/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
