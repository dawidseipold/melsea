// Endpoints
const SPOTIFY_ARTIST_ENDPOINT = 'https://api.spotify.com/v1/artists';

export const getUserArtists = async (token: string) => {
  return fetch(
    `https://api.spotify.com/v1/me/following?${new URLSearchParams({
      type: 'artist',
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getArtist = async (token: string, id: string) => {
  return fetch(`${SPOTIFY_ARTIST_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArtistTracks = async (token: string, id: string, country: string) => {
  return fetch(`${SPOTIFY_ARTIST_ENDPOINT}/${id}/top-tracks?market=${country}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getArtistDiscography = async (token: string, id: string) => {
  return fetch(
    `${SPOTIFY_ARTIST_ENDPOINT}/${id}/albums?${new URLSearchParams({
      include_groups: 'album,single',
      limit: '50',
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getArtistFeatures = async (token: string, id: string) => {
  return fetch(
    `${SPOTIFY_ARTIST_ENDPOINT}/${id}/albums?${new URLSearchParams({
      include_groups: 'appears_on',
      limit: '8',
    })}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const useArtistFollow = async (id: string, access_token: string, followed: boolean) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/following?${new URLSearchParams({
      type: 'artist',
      ids: id,
    })}`,
    {
      method: followed ? 'DELETE' : 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await response;
  return data;
};
