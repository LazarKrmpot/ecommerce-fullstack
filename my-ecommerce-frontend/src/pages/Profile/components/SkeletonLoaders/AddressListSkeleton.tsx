import { Card, CardContent } from "@/components/ui/card";

export const AddressListSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-6 w-48 bg-slate-200 rounded"></div>
      <div className="h-4 w-32 bg-slate-200 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <div className="h-5 w-5 bg-slate-200 rounded"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-slate-200 rounded"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
