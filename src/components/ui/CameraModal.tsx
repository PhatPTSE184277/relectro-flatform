'use client';
import React, { useRef, useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import Toast from './Toast';

interface CameraModalProps {
    open: boolean;
    onClose: () => void;
    onCapture: (imageUrl: string, file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ open, onClose, onCapture }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setStream(null);
        }
    };

    const startCamera = async () => {
        setIsLoading(true);
        const tryGetStream = async (facingMode: 'environment' | 'user') => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: facingMode } },
                    audio: false,
                });
                const videoTracks = mediaStream.getVideoTracks();
                if (!videoTracks.length) {
                    throw new Error('Không tìm thấy camera.');
                }
                streamRef.current = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    try {
                        await videoRef.current.play();
                    } catch (playError) {
                        console.warn('Video play failed:', playError);
                    }
                }
                return true;
            } catch (err) {
                console.error(`Failed to get ${facingMode} camera:`, err);
                return false;
            }
        };
        let success = await tryGetStream('environment');
        if (!success) {
            success = await tryGetStream('user');
            if (!success) {
                setToast({
                    open: true,
                    message: 'Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera hoặc thử lại với trình duyệt khác.',
                });
                onClose();
            }
        }
        setIsLoading(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw current video frame to canvas
                ctx.drawImage(video, 0, 0);
                
                // Convert canvas to blob and create file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            onCapture(reader.result as string, file);
                        };
                        reader.readAsDataURL(file);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
        handleClose();
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };


    useEffect(() => {
        if (open) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4'>
                <div className='relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto'>
                    {/* Header */}
                    <div className='flex justify-between items-center p-4 border-b bg-gray-50'>
                        <h3 className='text-lg font-semibold text-gray-800'>Chụp ảnh sản phẩm</h3>
                        <button
                            onClick={handleClose}
                            className='text-gray-400 hover:text-red-500 transition'
                            aria-label='Đóng camera'
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* Video Preview */}
                    <div className='relative bg-black min-h-[400px] flex items-center justify-center'>
                        {isLoading && (
                            <div className='absolute inset-0 flex items-center justify-center z-10'>
                                <div className='text-white text-center'>
                                    <div className='w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
                                    <p>Đang mở camera...</p>
                                </div>
                            </div>
                        )}
                        {!stream && !isLoading && (
                            <div className='absolute inset-0 flex items-center justify-center z-10'>
                                <div className='text-white text-center px-4'>
                                    <Camera size={48} className='mx-auto mb-4 opacity-50' />
                                    <p>Không thể kết nối camera</p>
                                </div>
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className='w-full h-auto max-h-[60vh] object-contain'
                            style={{ display: stream ? 'block' : 'none' }}
                        />
                        <canvas ref={canvasRef} className='hidden' />
                    </div>
                    
                    {/* Actions */}
                    <div className='flex justify-center gap-4 p-4 bg-gray-50'>
                        <button
                            onClick={capturePhoto}
                            disabled={!stream || isLoading}
                            className='px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition cursor-pointer flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed'
                        >
                            <Camera size={20} />
                            Chụp ảnh
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Toast for errors */}
            <Toast
                open={toast.open}
                type="error"
                message={toast.message}
                onClose={() => setToast({ open: false, message: '' })}
                duration={4000}
            />
        </>
    );
};

export default CameraModal;
