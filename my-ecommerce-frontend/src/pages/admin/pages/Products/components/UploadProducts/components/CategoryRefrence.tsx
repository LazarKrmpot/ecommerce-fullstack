import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks";
import { Clipboard, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CategoryReference() {
  const { categories, isLoadingCategories, fetchCategories } = useCategories();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);

    toast.success("Category ID copied to clipboard");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Category Reference</CardTitle>
        <CardDescription>
          Use these category IDs in your CSV file
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingCategories ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 rounded-md bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {category._id}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyId(category._id)}
                    className="h-8 px-2"
                  >
                    {copiedId === category._id ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
