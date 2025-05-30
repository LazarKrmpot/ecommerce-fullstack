import { Card, CardContent } from "@/components/ui/card";

export const UserInfoSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="h-24 bg-slate-200"></div>
    <div className="relative px-6">
      <div className="absolute -top-12 w-24 h-24 rounded-full bg-slate-200 border-4 border-white"></div>
      <div className="ml-28 py-4">
        <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
      </div>
    </div>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-slate-200 rounded"></div>
              <div>
                <div className="h-3 w-20 bg-slate-200 rounded mb-1"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </CardContent>
  </Card>
);
