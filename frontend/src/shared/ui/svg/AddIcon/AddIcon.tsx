interface AddIconProps {
size?: string;
color?: string;
className?: string;
strokeWidth?: number;
}


    const AddIcon: React.FC<AddIconProps> = ({ size = 24, color = "currentColor", className, strokeWidth = 2 }) => {
        return (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            >
                <line x1="12" y1="19" x2="12" y2="5" />
                <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        );
};


export default AddIcon;