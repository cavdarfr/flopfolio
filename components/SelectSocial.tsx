import { Button } from "@/components/ui/button";
import GitHubIcon from "./icons/GitHubIcon";
import InstagramIcon from "./icons/InstagramIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import XTwitterIcon from "./icons/XTwitterIcon";
import { cn } from "@/lib/utils";

const socialNetworks = [
    {
        value: "github",
        label: "GitHub",
        icon: GitHubIcon,
    },
    {
        value: "instagram",
        label: "Instagram",
        icon: InstagramIcon,
    },
    {
        value: "linkedin",
        label: "LinkedIn",
        icon: LinkedInIcon,
    },
    {
        value: "twitter",
        label: "Twitter",
        icon: XTwitterIcon,
    },
] as const;

export type SocialNetwork = (typeof socialNetworks)[number]["value"];

interface SelectSocialProps {
    value: string;
    onValueChange: (value: string) => void;
}

export default function SelectSocial({
    value,
    onValueChange,
}: SelectSocialProps) {
    return (
        <div className="flex gap-2 flex-wrap">
            {socialNetworks.map((network) => (
                <Button
                    key={network.value}
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onValueChange(network.value)}
                    className={cn(
                        "h-10 w-10",
                        value === network.value &&
                            "bg-slate-300 text-white hover:bg-slate-400"
                    )}
                >
                    <network.icon size={20} />
                    <span className="sr-only">{network.label}</span>
                </Button>
            ))}
        </div>
    );
}
