import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_UPLOAD_PRESET || 'mrpokwc5'
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'dqdporzhx';

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};