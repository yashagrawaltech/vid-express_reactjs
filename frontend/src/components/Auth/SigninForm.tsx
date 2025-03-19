import { useState } from 'react';
import Error from '../Error';
import { z } from 'zod';
import axios from 'axios';

const DataSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type ErrorResponse = {
    message: string;
};

const SigninForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(false);
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/signin`,
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
        <form onSubmit={handleSubmit}>
            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                {error && (
                    <Error
                        className="mb-2"
                        error={error.message}
                        type="soft-style"
                    />
                )}
                <label className="fieldset-label">Email</label>
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                />

                <label className="fieldset-label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                />

                <button className="btn btn-neutral mt-4">
                    {loading ? 'loading' : 'Signin'}
                </button>
            </fieldset>
        </form>
    );
};

export default SigninForm;
