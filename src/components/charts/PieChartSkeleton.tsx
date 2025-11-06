import Skeleton from "@/components/ui/Skereton";

const PieChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 transition-colors">
      <div className="mb-6">
        <Skeleton className="w-40 h-6 mb-2" variant="text" />
        <Skeleton className="w-32 h-4" variant="text" />
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <Skeleton
            className="absolute left-0 top-0 w-48 h-48 rounded-full"
            variant="circular"
            animation="pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default PieChartSkeleton;