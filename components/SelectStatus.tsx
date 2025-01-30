import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectStatusProps {
    value: string;
    onValueChange: (value: string) => void;
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
                <SelectItem value="active">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-emerald-600" />
                        <span className="truncate">Active</span>
                    </span>
                </SelectItem>
                <SelectItem value="inactive">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-blue-500" />
                        <span className="truncate">Inactive</span>
                    </span>
                </SelectItem>
                <SelectItem value="sold">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-amber-500" />
                        <span className="truncate">Sold</span>
                    </span>
                </SelectItem>
                <SelectItem value="cancelled">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-gray-500" />
                        <span className="truncate">Cancelled</span>
                    </span>
                </SelectItem>
                <SelectItem value="failed">
                    <span className="flex items-center gap-2">
                        <StatusDot className="text-red-500" />
                        <span className="truncate">Failed</span>
                    </span>
                </SelectItem>
                <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                        {/* Changer la couleur qui correspond à pending */}
                        <StatusDot className="text-yellow-800" />
                        <span className="truncate">Pending</span>
                    </span>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
