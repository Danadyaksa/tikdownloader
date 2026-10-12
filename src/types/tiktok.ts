export interface TikTokAuthor {
  id: string;
  unique_id: string;
  nickname: string;
  avatar: string;
}

export interface TikTokMediaData {
  id: string;
  title: string;
  cover: string;
  duration?: number;
  author: TikTokAuthor;
  type: 'video' | 'image';
  video?: {
    play: string;
    hdplay?: string;
    wmplay?: string;
    size?: number;
    hd_size?: number;
  };
  images?: string[];
  music?: {
    id?: string;
    title: string;
    author: string;
    play: string;
    cover?: string;
    duration?: number;
  };
}

export interface ExtractApiResponse {
  success: boolean;
  data?: TikTokMediaData;
  error?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  cover: string;
  authorName: string;
  authorAvatar: string;
  type: 'video' | 'image';
  downloadDate: number; // timestamp
  playUrl?: string;
  hdPlayUrl?: string;
  images?: string[];
  musicUrl?: string;
}
