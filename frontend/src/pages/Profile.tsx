import { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { z } from 'zod';
import Error from '../components/Error';
import axios from 'axios';

const DataSchema = z.object({
    fullName: z.string().min(4, 'Fullname must be at least 4 characters long'),
    username: z.string().min(1, 'Username is required'),
});

const PasswordDataSchema = z
    .object({
        oldPassword: z.string(),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ErrorResponse = {
    message: string;
};

const Profile = () => {
    const {
        username: realUsername,
        fullName: realFullName,
        email,
        coverImage,
        avatar,
        bio: realBio,
    } = useUser();
    const [state, setState] = useState<'disabled' | 'edit'>('disabled');

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        bio: '',
    });

    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

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

    useEffect(() => {
        if (realBio) {
            setFormData((p) => ({ ...p, bio: realBio }));
        }
    }, [realBio]);

    const setDefaultValues = () => {
        if (realUsername) {
            setFormData((p) => ({ ...p, username: realUsername }));
        }
        if (realFullName) {
            setFormData((p) => ({ ...p, fullName: realFullName }));
        }
        if (realBio) {
            setFormData((p) => ({ ...p, bio: realBio }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/edit-profile?username=true&fullName=true&bio=true`,
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

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <div className="w-full p-4 flex flex-col gap-4">
            {coverImage ? (
                <div className="cover-image w-full h-48 bg-primary-content rounded-md overflow-hidden">
                    <img
                        className="w-full h-full object-cover object-center"
                        src={coverImage}
                        alt="cover-image"
                    />
                </div>
            ) : null}

            <div
                className={`avatar avatar-placeholder w-full flex justify-center ${coverImage ? '-mt-16' : ''}`}
            >
                <div className="bg-primary text-neutral-content w-24 rounded-full border-2 shadow-md">
                    {avatar ? (
                        <img
                            loading="lazy"
                            className="w-full h-full object-cover object-center"
                            src={avatar}
                            alt="avatar"
                        />
                    ) : (
                        <span className="text-3xl">
                            {formData.fullName.toString()[0]}
                        </span>
                    )}
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

                {loading ? (
                    <div className="mb-2">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : null}

                {/* Full Name */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Full Name</legend>
                    <input
                        type="text"
                        placeholder={formData.fullName}
                        value={formData.fullName}
                        className="input w-full"
                        disabled={
                            state === 'disabled' || loading ? true : false
                        }
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
                        disabled={
                            state === 'disabled' || loading ? true : false
                        }
                        onChange={handleChange}
                        name="username"
                    />
                    <p className="fieldset-label"></p>
                </fieldset>

                {/* Bio */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Bio</legend>
                    <textarea
                        ref={textAreaRef}
                        placeholder={formData.bio}
                        value={formData.bio}
                        className="input w-full h-fit text-wrap overflow-hidden"
                        disabled={
                            state === 'disabled' || loading ? true : false
                        }
                        style={{
                            height: textAreaRef.current?.scrollHeight + 'px',
                            minHeight: '12rem',
                            padding: '0.75rem',
                            resize: state === 'disabled' ? 'none' : 'vertical',
                        }}
                        onChange={handleChange}
                        name="bio"
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

            <ForgotPasswordModal dialogRef={dialogRef} />

            <div className="buttons w-full flex gap-4 justify-end mt-4">
                {state === 'disabled' ? (
                    <>
                        <button
                            className="btn btn-outline"
                            onClick={() =>
                                dialogRef && dialogRef.current
                                    ? dialogRef.current.showModal()
                                    : null
                            }
                        >
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
                            disabled={loading ? true : false}
                        >
                            {loading ? 'loading' : 'Save'}
                        </button>
                        <button
                            disabled={loading ? true : false}
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

const ForgotPasswordModal: React.FC<{
    dialogRef: React.RefObject<HTMLDialogElement | null>;
}> = ({ dialogRef }) => {
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [forgotPasswordformData, setForgotPasswordformData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotPasswordformData((prev) => ({ ...prev, [name]: value }));
        if (error) {
            setError(null);
        }
    };

    const handlePasswordSubmit = async (
        e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setSuccessMessage('');
        const result = PasswordDataSchema.safeParse(forgotPasswordformData);
        if (!result.success) {
            setLoading(false);
            const fieldErrors = result.error.errors.map((err) => ({
                message: err.message,
            }));
            setError(fieldErrors[0]);
            return;
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/change-password`,
                {
                    oldPassword: forgotPasswordformData.oldPassword,
                    newPassword: forgotPasswordformData.newPassword,
                },
                { withCredentials: true }
            );
            if (response.data.success && response.data.message) {
                setSuccessMessage(response.data.message);
                setError(null);
                window.location.reload();
            }
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
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_3" className="modal" ref={dialogRef}>
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg">Update Password</h3>
                    <form onSubmit={handlePasswordSubmit}>
                        {error ? (
                            <Error
                                className="mb-2 mt-4"
                                error={error.message}
                                type="soft-style"
                            />
                        ) : null}

                        {loading ? (
                            <div className="mb-2">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        ) : null}

                        {successMessage ? (
                            <div
                                role="alert"
                                className="alert alert-success alert-soft w-full mt-4 mb-2"
                            >
                                <span>{successMessage}</span>
                            </div>
                        ) : null}
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">
                                Current Password
                            </legend>
                            <input
                                disabled={
                                    loading || successMessage ? true : false
                                }
                                type="password"
                                placeholder={'Your Current Password'}
                                value={forgotPasswordformData.oldPassword}
                                className="input w-full"
                                onChange={handlePasswordChange}
                                name="oldPassword"
                            />
                            <p className="fieldset-label"></p>
                        </fieldset>
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">
                                New Password
                            </legend>
                            <input
                                disabled={
                                    loading || successMessage ? true : false
                                }
                                type="password"
                                placeholder={'Your New Password'}
                                value={forgotPasswordformData.newPassword}
                                className="input w-full"
                                onChange={handlePasswordChange}
                                name="newPassword"
                            />
                            <p className="fieldset-label"></p>
                        </fieldset>
                        <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend">
                                Confirm Password
                            </legend>
                            <input
                                disabled={
                                    loading || successMessage ? true : false
                                }
                                type="password"
                                placeholder={'Confirm New Password'}
                                value={forgotPasswordformData.confirmPassword}
                                className="input w-full"
                                onChange={handlePasswordChange}
                                name="confirmPassword"
                            />
                            <p className="fieldset-label"></p>
                        </fieldset>
                        <button
                            type="submit"
                            className="btn btn-primary ml-auto block mt-4"
                            disabled={loading || successMessage ? true : false}
                        >
                            {loading ? 'loading' : 'Save'}
                        </button>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default Profile;
