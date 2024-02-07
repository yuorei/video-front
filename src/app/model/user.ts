import { Video } from './video';

export interface User {
    id: string;
    name: string;
    profileImageURL: string;
    subscribechannelids: string[];
    videos: Video[];
}

export interface GetUserResponse {
    user: User;
}

export interface GetUserVariables {
    id: string;
}