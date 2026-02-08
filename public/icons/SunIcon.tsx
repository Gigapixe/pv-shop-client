const SunIcon = ({ className = "", fill = "currentColor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill={fill} className={className}>
            <g clip-path="url(#clip0_5256_5353)">
                <path d="M6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" stroke={fill} stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 1V2" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10V11" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.46484 2.46484L3.16984 3.16984" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.83008 8.83008L9.53508 9.53508" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 6H2" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 6H11" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.16984 8.83008L2.46484 9.53508" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.53508 2.46484L8.83008 3.16984" stroke="currentColor" stroke-opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_5256_5353">
                    <rect width="12" height="12" fill={fill} />
                </clipPath>
            </defs>
        </svg>
    );
};

export default SunIcon;
