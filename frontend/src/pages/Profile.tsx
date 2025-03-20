import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { z } from 'zod';
import Error from '../components/Error';
import axios from 'axios';

const DataSchema = z.object({
    fullName: z.string().min(4, 'Fullname must be at least 4 characters long'),
    username: z.string().min(1, 'Username is required'),
});

type ErrorResponse = {
    message: string;
};

const Profile = () => {
    const { username: realUsername, fullName: realFullName, email } = useUser();
    const [state, setState] = useState<'disabled' | 'edit'>('disabled');

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
    });

    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (realUsername) {
            setFormData((p) => ({ ...p, username: realUsername }));
        }
    }, [realUsername]);

    useEffect(() => {
        if (realFullName) {
            setFormData((p) => ({ ...p, fullName: realFullName }));
        }
    }, [realFullName]);

    const setDefaultValues = () => {
        if (realUsername) {
            setFormData((p) => ({ ...p, username: realUsername }));
        }
        if (realFullName) {
            setFormData((p) => ({ ...p, fullName: realFullName }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
    ) => {
        e.preventDefault();
        if (state === 'disabled') return;

        setLoading(true);
        const result = DataSchema.safeParse(formData);
        if (!result.success) {
            setLoading(false);
            const fieldErrors = result.error.errors.map((err) => ({
                message: err.message,
            }));
            setError(fieldErrors[0]);
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/edit-profile?username=true&fullName=true`,
                formData,
                { withCredentials: true }
            );
            window.location.reload();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError({
                    message: err.response?.data.message || 'An error occurred',
                });
            } else {
                setError({ message: 'An unexpected error occurred' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4 flex flex-col gap-4">
            <div className="avatar avatar-placeholder w-full flex justify-center">
                <div className="bg-neutral text-neutral-content w-24 rounded-full">
                    <span className="text-3xl">
                        {formData.fullName.toString()[0]}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {error && (
                    <Error
                        className="mb-2"
                        error={error.message}
                        type="soft-style"
                    />
                )}

                {/* Full Name */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Full Name</legend>
                    <input
                        type="text"
                        placeholder={formData.fullName}
                        value={formData.fullName}
                        className="input w-full"
                        disabled={state === 'disabled' ? true : false}
                        onChange={handleChange}
                        name="fullName"
                    />
                    <p className="fieldset-label"></p>
                </fieldset>

                {/* Username */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Username</legend>
                    <input
                        type="text"
                        placeholder={formData.username}
                        value={formData.username}
                        className="input w-full"
                        disabled={state === 'disabled' ? true : false}
                        onChange={handleChange}
                        name="username"
                    />
                    <p className="fieldset-label"></p>
                </fieldset>

                {/* Email */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Email</legend>
                    <input
                        type="email"
                        placeholder={email}
                        value={email}
                        className="input w-full"
                        disabled
                    />
                    <p className="fieldset-label text-yellow-400 opacity-50">
                        {state === 'edit' ? "you can't update email" : null}
                    </p>
                </fieldset>
            </form>

            <div className="buttons w-full flex gap-4 justify-end mt-4">
                {state === 'disabled' ? (
                    <>
                        <button className="btn btn-outline">
                            Forgot Password
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                setState((p) =>
                                    p === 'disabled' ? 'edit' : 'disabled'
                                )
                            }
                        >
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                        >
                            {loading ? 'loading' : 'Save'}
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                setState((p) =>
                                    p === 'disabled' ? 'edit' : 'disabled'
                                );
                                setDefaultValues();
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
