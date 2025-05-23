import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const Sidebar = () => {
    const { username } = useUser();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogout: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/signout`,
                {},
                { withCredentials: true }
            );
            window.location.reload();
        } catch (error) {
            if (error && error instanceof AxiosError) {
                setError(
                    error.message ? error.message : 'Something went wrong'
                );
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 h-full bg-base-100">
            <NavLink
                to={'/'}
                className={({ isActive }) =>
                    `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                }
            >
                Home
            </NavLink>
            <NavLink
                to={'/watch-history'}
                className={({ isActive }) =>
                    `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                }
            >
                History
            </NavLink>
            <NavLink
                to={'/subscriptions'}
                className={({ isActive }) =>
                    `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                }
            >
                Subscriptions
            </NavLink>
            <NavLink
                to={'/studio'}
                className={({ isActive }) =>
                    `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                }
            >
                Studio
            </NavLink>

            <div className="mt-auto flex flex-col gap-4">
                {!username ? (
                    <>
                        <NavLink
                            className={({ isActive }) =>
                                `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                            }
                            to={'/sign-in'}
                        >
                            Signin
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                            }
                            to={'/sign-up'}
                        >
                            Signup
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink
                            className={({ isActive }) =>
                                `btn ${isActive ? 'btn-primary' : 'btn-soft'}`
                            }
                            to={'/profile'}
                        >
                            Profile
                        </NavLink>

                        <span className="block w-full">
                            {error ? <p>{error}</p> : null}
                            <button
                                className={'btn btn-soft btn-error w-full'}
                                onClick={handleLogout}
                                disabled={loading ? true : false}
                            >
                                {loading ? 'loading' : 'Logout'}
                            </button>
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
