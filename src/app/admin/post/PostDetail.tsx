import SummaryCard from '@/components/ui/SummaryCard';

const PostDetail = () => {
    const postDetails = [
        {
            label: 'Điểm ước tính',
            value: '100 điểm',
            align: 'right', // Align value to the right
        },
        {
            label: 'Ngày tạo',
            value: '01/01/2023',
        },
        {
            label: 'Trạng thái',
            value: 'Đang hoạt động',
        },
    ];

    return (
        <div>
            <SummaryCard
                items={postDetails}
                label="Chi tiết bài viết"
            />
        </div>
    );
};

export default PostDetail;