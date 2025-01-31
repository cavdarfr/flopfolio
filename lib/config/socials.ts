// lib/config/socials.ts
import GitHubIcon from "@/components/icons/GitHubIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import XTwitterIcon from "@/components/icons/XTwitterIcon";

export const socialConfig = {
    github: {
        icon: GitHubIcon,
        label: "GitHub",
    },
    instagram: {
        icon: InstagramIcon,
        label: "Instagram",
    },
    linkedin: {
        icon: LinkedInIcon,
        label: "LinkedIn",
    },
    twitter: {
        icon: XTwitterIcon,
        label: "Twitter",
    },
} as const;

export type SocialType = keyof typeof socialConfig; 