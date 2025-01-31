import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { statusConfig, StatusType } from "@/lib/config/status";

interface SelectStatusProps {
    value: StatusType;
    onValueChange: (value: StatusType) => void;
}

function StatusDot({ className }: { className: string }) {
    return (
        <svg
            width="8"
            height="8"
            fill="currentColor"
            viewBox="0 0 8 8"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <circle cx="4" cy="4" r="4" />
        </svg>
    );
}

export default function SelectStatus({
    value,
    onValueChange,
}: SelectStatusProps) {
    return (
        <Select defaultValue={value} onValueChange={onValueChange}>
            <SelectTrigger
                id={`status-${value}`}
                className="h-10 flex items-center gap-2 shrink-0"
            >
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                            <StatusDot className={config.dotColor} />
                            <span className="truncate">{config.label}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
