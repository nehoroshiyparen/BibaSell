interface UserIconProps {
size?: string;
color?: string;
className?: string;
}


const UserIcon: React.FC<UserIconProps> = ({ size = 24, color = "currentColor", className }) => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color}
        viewBox="0 0 48 48"
        className={className}
        >
            <path d="M24,21A10,10,0,1,1,34,11,10,10,0,0,1,24,21ZM24,5a6,6,0,1,0,6,6A6,6,0,0,0,24,5Z" />
            <path d="M42,47H6a2,2,0,0,1-2-2V39A16,16,0,0,1,20,23h8A16,16,0,0,1,44,39v6A2,2,0,0,1,42,47ZM8,43H40V39A12,12,0,0,0,28,27H20A12,12,0,0,0,8,39Z" />
        </svg>
    );
};


export default UserIcon;