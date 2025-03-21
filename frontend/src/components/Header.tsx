import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = ({
    setShowSideBar,
}: {
    setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { username, fullName } = useUser();

    return (
        <div className="flex md:px-2">
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start w-fit lg:w-full mr-2">
                    <div
                        role="button"
                        className="btn btn-ghost btn-circle"
                        onClick={() => setShowSideBar((p) => !p)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {' '}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />{' '}
                        </svg>
                    </div>
                </div>
                <div className="navbar-center">
                    <Link
                        to={'/'}
                        className="text-xl md:text-2xl font-semibold lg:mr-8"
                    >
                        Vid-Express
                    </Link>
                </div>
                <div className="navbar-end w-full ml-2">
                    <label className="input hidden md:flex">
                        <svg
                            className="h-[1em] opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            className="grow"
                            placeholder="Search"
                        />
                        <kbd className="kbd kbd-sm">⌘</kbd>
                        <kbd className="kbd kbd-sm">K</kbd>
                    </label>
                    <button className="btn btn-ghost btn-circle md:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {' '}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />{' '}
                        </svg>
                    </button>

                    <button className="btn btn-ghost btn-circle ml-2">
                        <svg
                            className="w-8 h-8"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                        </svg>
                    </button>

                    <div className="buttons md:flex gap-4 justify-end ml-4 hidden">
                        {!username ? (
                            <>
                                <Link to={'/sign-in'}>
                                    <button className="btn btn-outline">
                                        Signin
                                    </button>
                                </Link>
                                <Link to={'/sign-up'}>
                                    <button className="btn btn-primary">
                                        Signup
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to={'/profile'}>
                                    <div className="avatar avatar-placeholder">
                                        <div className="bg-primary text-neutral-content w-8 rounded-full">
                                            <span className="text-xl">
                                                {fullName.toString()[0]}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
