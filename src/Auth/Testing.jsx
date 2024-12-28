import React, { useState } from 'react';
import { createUserMetadata } from '../lib/userMetadata'; // Adjust the import path

const UserMetadataForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        storage_used: 0,
        plan: '',
        created_at: '',
        otp: 0,
        avatar: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setResponse(null);

        try {
            const result = await createUserMetadata(
                formData.username,
                formData.storage_used,
                formData.plan,
                formData.created_at,
                formData.otp,
                formData.avatar
            );
            setResponse(result);
        } catch (err) {
            setError(err.message || 'Failed to create metadata');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create User Metadata</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Storage Used:</label>
                    <input
                        type="number"
                        name="storage_used"
                        value={formData.storage_used}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Plan:</label>
                    <input
                        type="text"
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Created At:</label>
                    <input
                        type="datetime-local"
                        name="created_at"
                        value={formData.created_at}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">OTP:</label>
                    <input
                        type="number"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Avatar URL:</label>
                    <input
                        type="text"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white rounded p-2 w-full"
                >
                    {isSubmitting ? 'Submitting...' : 'Create Metadata'}
                </button>
            </form>

            {response && (
                <div className="mt-4 text-green-600">
                    Metadata created successfully: {JSON.stringify(response)}
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-600">
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default UserMetadataForm;
