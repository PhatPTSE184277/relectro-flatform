import Skeleton from "@/components/ui/Skereton";

const BarChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 transition-colors">
      <div className="mb-6">
        <Skeleton className="w-40 h-6 mb-2" variant="text" />
        <Skeleton className="w-32 h-4" variant="text" />
      </div>
      <div className="flex items-end gap-2 h-64">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            className="w-8"
            height={`${40 + Math.random() * 120}px`}
            variant="rectangular"
          />
        ))}
      </div>
    </div>
  );
};

export default BarChartSkeleton;