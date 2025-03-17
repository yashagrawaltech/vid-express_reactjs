const Header = ({
    setShowSideBar,
}: {
    setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div className="flex">
            Header
            <span className="md:hidden">
                <svg
                    className="w-8 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    onClick={() => setShowSideBar((p) => !p)}
                >
                    <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                </svg>
            </span>
        </div>
    );
};

export default Header;
