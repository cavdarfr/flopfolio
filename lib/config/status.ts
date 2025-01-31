// lib/config/status.ts
export const statusConfig = {
    active: {
        label: "Active",
        color: "bg-green-500",
        dotColor: "text-emerald-600",
    },
    inactive: {
        label: "Inactive",
        color: "bg-blue-500",
        dotColor: "text-blue-500",
    },
    sold: {
        label: "Sold",
        color: "bg-amber-500",
        dotColor: "text-amber-500",
    },
    cancelled: {
        label: "Cancelled",
        color: "bg-gray-500",
        dotColor: "text-gray-500",
    },
    failed: {
        label: "Failed",
        color: "bg-red-500",
        dotColor: "text-red-500",
    },
    pending: {
        label: "Pending",
        color: "bg-yellow-500",
        dotColor: "text-yellow-800",
    },
} as const;

export type StatusType = keyof typeof statusConfig; 