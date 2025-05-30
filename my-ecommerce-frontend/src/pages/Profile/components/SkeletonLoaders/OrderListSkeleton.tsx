import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OrderListSkeleton = () => (
  <div className="space-y-6">
    <div className="h-6 w-48 bg-slate-200 rounded"></div>
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-slate-200 rounded"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-slate-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  <div className="h-6 w-24 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
