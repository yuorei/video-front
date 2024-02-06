export interface User {
    id: string;
    name: string;
    profileImageURL: string;
    subscribechannelids: string[];
}

export interface GetUserResponse {
    user: User;
}

export interface GetUserVariables {
    id: string;
}