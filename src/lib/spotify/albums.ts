export const getUserAlbums = async (token: string) => {
  return fetch(`https://api.spotify.com/v1/me/albums`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAlbum = async (token: string, id: string) => {
  return fetch(`	https://api.spotify.com/v1/albums/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAlbumTracks = async (token: string, id: string) => {
  return fetch(`	https://api.spotify.com/v1/albums/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
