import { ResponseOrderForReview } from './Order';
import { FileObject } from './FileObject';

export interface ResponseReview {
  reviewId: number;
  starRate: number;
  contents: string;
  created: string;
  creator: {
    loginId: string;
    username: string;
    phone: string;
  };
  sequence: number;
  expose: boolean;
  order: ResponseOrderForReview;
  images: FileObject[];
}

export interface UpdateReview {
  sequence: boolean;
}

export interface SearchReview {
  startDate?: string;
  endDate?: string;
  creatorLoginId?: string;
  creatorPhone?: string;
  eventName?: string;
  productName?: string;
  orderId?: number;
  contents?: string;
}
