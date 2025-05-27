import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "hugeicons-react";

interface IconProps {
    icon: string;
    size?: number;  
    color?: string;
    strokeWidth?: number;
}

function BasicIcon({ icon, size = 24, color = "currentColor", strokeWidth = 2 }: IconProps) {
    return (
        <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} />
    );
}