export interface PresenceData {
  details?: string;
  state?: string;
  type?: number;
  largeImageKey?: string;
  largeImageText?: string;
  largeImageUrl?: string;
  smallImageKey?: string;
  smallImageText?: string;
  smallImageUrl?: string;
  partyId?: string;
  partySize?: number;
  partyMax?: number;
  startTimestamp?: number;
  endTimestamp?: number;
  buttons?: { label: string; url: string }[];
}

export interface AnimeData {
  id: number;
  mal_id: number;
  anilist_id: number;
  slug: string;
  title_ukrainian: string;
  title_original: string;
  title_english: string;
  status: string;
  type: string;
  year: number;
  season_name: string;
  season_name_ukrainian: string;
  has_ukrainian_dub: boolean;
  poster_url: string;
  banner_url: string;
  episodes_count: number;
  imdb_id: string;
  a: string;
  description: string;
  genres: string[];
  dubbing_studios: [
    { id: number; name: string; slug: string; logo_url: string },
  ];
  screenshots: [{ id: number; image_url: string; description: string }];
  youtube_trailer: string;
  rating: number;
}

export interface UserData {
  username: string;
  avatar: string | null;
}

export interface VideoState {
  isPaused: boolean;
  currentTime: number;
  duration: number;
}
