const MenuIcon = ({ className = "", fill = "currentColor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill={fill} className={className}>
            <path d="M6 7.5H30" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 18H30" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 28.5H30" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default MenuIcon;
