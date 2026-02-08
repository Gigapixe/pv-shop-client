const DesktopIcon = ({ className = "", fill = "currentColor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill={fill} className={className}>
            <path d="M9 4V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2H2C1.73478 2 1.48043 2.10536 1.29289 2.29289C1.10536 2.48043 1 2.73478 1 3V6.5C1 6.76522 1.10536 7.01957 1.29289 7.20711C1.48043 7.39464 1.73478 7.5 2 7.5H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 9.49953V7.51953V9.09453" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 9.5H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 6H9C8.44772 6 8 6.44772 8 7V10C8 10.5523 8.44772 11 9 11H10C10.5523 11 11 10.5523 11 10V7C11 6.44772 10.5523 6 10 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default DesktopIcon;
