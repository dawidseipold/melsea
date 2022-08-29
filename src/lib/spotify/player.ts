export const getPlaybackState = async (token: string) => {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCurrentlyPlayingTrack = async (token: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRecentlyPlayedTracks = async (token: string) => {
  return fetch(`https://api.spotify.com/v1/me/player/recently-played`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
