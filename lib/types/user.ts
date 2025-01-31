// lib/types/user.ts
import { SocialType } from "../config/socials";
import { StatusType } from "../config/status";

export interface Social {
    _id: string;
    name: SocialType;
    url: string;
}

export interface Business {
    _id: string;
    name: string;
    description: string;
    status: StatusType;
    lessons: string;
    logoUrl?: string;
}

export interface User {
    _id: string;
    name: string;
    slug: string;
    bio: string;
    avatarUrl: string;
    socials: Social[];
    business: Business[];
} 