import { useState } from 'react';
import Error from '../components/Error';
import axios from 'axios';
import { z } from 'zod';

interface FormData {
    video: File | null;
    title: string;
    description: string;
    thumbnail: File | null;
}

type ErrorResponse = {
    message: string;
};

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10 MB

const DataSchema = z.object({
    video: z
        .instanceof(File)
        .refine((file) => file.size > 0, {
            message: 'Video file is required',
        })
        .refine((file) => file.size <= MAX_VIDEO_SIZE, {
            message: `Video file must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)} MB`,
        }),
    title: z
        .string()
        .min(1, { message: 'Title is required' })
        .max(100, { message: 'Title must be at most 100 characters long' }),
    description: z.string().max(500, {
        message: 'Description must be at most 500 characters long',
    }),
    thumbnail: z
        .instanceof(File)
        .refine((file) => file.size > 0, {
            message: 'Thumbnail file is required',
        })
        .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, {
            message: `Thumbnail file must be less than ${MAX_THUMBNAIL_SIZE / (1024 * 1024)} MB`,
        }),
});

const Post = () => {
    const [formData, setFormData] = useState<FormData>({
        video: null,
        title: '',
        description: '',
        thumbnail: null,
    });

    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'video' || name === 'thumbnail') {
            if (files && files.length > 0) {
                const file = files[0];
                if (name === 'thumbnail' && file.size > MAX_THUMBNAIL_SIZE) {
                    setError({
                        message: `Thumbnail size must be less than ${MAX_THUMBNAIL_SIZE / (1024 * 1024)} MB`,
                    });
                    return; // Do not update formData with invalid file
                }
                if (name === 'video' && file.size > MAX_VIDEO_SIZE) {
                    setError({
                        message: `Video size must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)} MB`,
                    });
                    return; // Do not update formData with invalid file
                }
                setFormData((prev) => ({
                    ...prev,
                    [name]: files[0],
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: null,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setSuccessMessage('');
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
            // Create a new FormData instance
            const formDataToSend = new FormData();
            formDataToSend.append('video', formData.video as File);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('thumbnail', formData.thumbnail as File);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video/upload`,
                formDataToSend,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccessMessage('Video uploaded successfully');
                setError(null);
                setFormData({
                    video: null,
                    title: '',
                    description: '',
                    thumbnail: null,
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError({
                    message: err.response?.data.message || 'An error occurred',
                });
            } else {
                setError({ message: 'An unexpected error occurred' });
            }
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl md:text-6xl font-bold mb-4">
                Post New Video
            </h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                {error ? (
                    <Error
                        className="mb-2"
                        error={error.message}
                        type="soft-style"
                    />
                ) : null}

                {successMessage ? (
                    <div
                        role="alert"
                        className="alert alert-success alert-soft w-full mt-4 mb-2"
                    >
                        <span>{successMessage}</span>
                    </div>
                ) : null}

                {loading ? (
                    <div className="mt-4 mb-2">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : null}

                {/* Title */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Title</legend>
                    <input
                        disabled={loading || successMessage ? true : false}
                        type="text"
                        placeholder={'Video Title'}
                        value={formData.title}
                        className="input w-full"
                        onChange={handleChange}
                        name="title"
                    />
                    <p className="fieldset-label"></p>
                </fieldset>

                {/* Description */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Description</legend>
                    <input
                        disabled={loading || successMessage ? true : false}
                        type="text"
                        placeholder={'Video Description'}
                        value={formData.description}
                        className="input w-full"
                        onChange={handleChange}
                        name="description"
                    />
                    <p className="fieldset-label"></p>
                </fieldset>

                {/* Thumbnail */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Thumbnail</legend>
                    <input
                        disabled={loading || successMessage ? true : false}
                        type="file"
                        className="file-input w-full"
                        onChange={handleChange}
                        name="thumbnail"
                        accept="image/*"
                    />
                    <span className="text-yellow-400/70">
                        maximum file size allowed: {MAX_THUMBNAIL_SIZE / (1024 * 1024)}mb
                    </span>
                </fieldset>

                {/* Video */}
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Video</legend>
                    <input
                        disabled={loading || successMessage ? true : false}
                        type="file"
                        className="file-input w-full"
                        onChange={handleChange}
                        name="video"
                        accept="video/*"
                    />
                    <span className="text-yellow-400/70">
                        maximum file size allowed: {MAX_VIDEO_SIZE / (1024 * 1024)}mb
                    </span>
                </fieldset>

                <span className="w-full mt-4 flex">
                    <button
                        type="submit"
                        className="btn btn-primary ml-auto"
                        disabled={loading || successMessage ? true : false}
                    >
                        {loading ? 'loading' : 'Post'}
                    </button>
                </span>
            </form>
        </div>
    );
};

export default Post;
