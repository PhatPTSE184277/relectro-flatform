import Skeleton from '@/components/ui/Skereton';

const LineChartSkeleton: React.FC = () => {
    return (
        <div className='bg-white p-6 rounded-xl border border-gray-200 transition-colors'>
            <div className='mb-6'>
                <Skeleton className='w-40 h-6 mb-2' variant='text' />
                <Skeleton className='w-32 h-4' variant='text' />
            </div>
            <div className='relative h-64 w-full flex items-center justify-center'>
                <svg width='100%' height='100%' viewBox='0 0 400 200'>
                    <polyline
                        points='20,180 60,160 100,170 140,120 180,100 220,130 260,110 300,140 340,120 380,150'
                        fill='none'
                        stroke='#e5e7eb'
                        strokeWidth='4'
                        strokeLinecap='round'
                        style={{ opacity: 0.7 }}
                    />
                    <polyline
                        points='20,150 60,130 100,140 140,90 180,80 220,110 260,90 300,120 340,100 380,130'
                        fill='none'
                        stroke='#3b82f6'
                        strokeWidth='4'
                        strokeLinecap='round'
                        style={{ opacity: 0.5 }}
                    />
                    {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map(
                        (x, i) => (
                            <circle
                                key={x}
                                cx={x}
                                cy={i % 2 === 0 ? 180 - i * 10 : 150 - i * 10}
                                r='6'
                                fill='#e5e7eb'
                                style={{ opacity: 0.7 }}
                            />
                        )
                    )}
                </svg>
            </div>
        </div>
    );
};

export default LineChartSkeleton;