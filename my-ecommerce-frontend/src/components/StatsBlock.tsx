interface StatInfo {
  value: number;
  label: string;
  color: string;
  type?: number | string;
}

interface StatsBlockProps {
  statsInfo: StatInfo[];
  className?: string;
}

export const StatsBlock = ({ statsInfo, className }: StatsBlockProps) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
    >
      {statsInfo.map((info, key) => (
        <div
          key={key}
          className="text-left bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full"
        >
          <h3 className="text-gray-600 text-sm font-medium">{info.label}</h3>

          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-4">
              {info.value}
            </span>
            <div className={`w-6 h-2 ${info.color} rounded-full`}></div>
          </div>

          <p className="text-gray-400 text-sm">{info.label} last 30 days</p>
        </div>
      ))}
    </div>
  );
};
