const DownArrowIcon = ({ className = "", fill = "currentColor" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill={fill} className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M1.46967 2.96967C1.76256 2.67678 2.23744 2.67678 2.53033 2.96967L7 7.4393L11.4697 2.96967C11.7626 2.67678 12.2374 2.67678 12.5303 2.96967C12.8232 3.26256 12.8232 3.73744 12.5303 4.0303L7.5303 9.0303C7.3897 9.171 7.1989 9.25 7 9.25C6.8011 9.25 6.6103 9.171 6.4697 9.0303L1.46967 4.0303C1.17678 3.73744 1.17678 3.26256 1.46967 2.96967Z" fill={fill} />
        </svg>
    );
};

export default DownArrowIcon;
