export type PlanType = 'free' | 'premium';

export type VideoItem = {
  id: string;
  title: string;
  duration: string;
  quality: string;
  gradient: string;
  fileName: string;
  source: string;
};

export type DownloadRecord = {
  id: string;
  videoId: string;
  title: string;
  downloadedAt: string;
  fileName: string;
};

export type StoredState = {
  plan: PlanType;
  dailyUsage: {
    date: string;
    count: number;
  };
  downloads: DownloadRecord[];
};
