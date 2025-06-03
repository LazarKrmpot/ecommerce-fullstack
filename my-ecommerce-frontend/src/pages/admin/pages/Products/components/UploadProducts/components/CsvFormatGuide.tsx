import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function CsvFormatGuide() {
  const headers = [
    "name",
    "description",
    "price",
    "stock",
    "isFeatured",
    "categoryId",
  ];

  const sampleData = [
    {
      name: "Product 1",
      description: "Description for Product 1",
      price: 19.99,
      stock: 100,
      isFeatured: "true",
      categoryId: "categoryId1",
    },
    {
      name: "Product 2",
      description: "Description for Product 2",
      price: 29.99,
      stock: 50,
      isFeatured: "false",
      categoryId: "categoryId2",
    },
  ];

  const generateCsvContent = () => {
    const headersRow = headers.join(",");
    const dataRows = sampleData.map((item) =>
      headers.map((header) => item[header as keyof typeof item]).join(",")
    );

    return [headersRow, ...dataRows].join("\n");
  };

  const downloadSampleCsv = () => {
    const csvContent = generateCsvContent();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      "Sample CSV file downloaded successfully. Check your downloads folder."
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>CSV Format Guide</CardTitle>
        <CardDescription>
          Your CSV file must include these columns in the correct order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell
                      key={`${index}-${header}`}
                      className="font-mono text-xs"
                    >
                      {row[header as keyof typeof row]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex sm:justify-end">
          <Button
            onClick={downloadSampleCsv}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download Sample CSV
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Column Requirements:</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <span className="font-semibold">name</span>: Product name (text)
            </li>
            <li>
              <span className="font-semibold">description</span>: Product
              description (text)
            </li>
            <li>
              <span className="font-semibold">price</span>: Product price
              (numeric, can include decimal places)
            </li>
            <li>
              <span className="font-semibold">stock</span>: Available quantity
              (integer)
            </li>
            <li>
              <span className="font-semibold">isFeatured</span>: Whether product
              should be featured (true/false)
            </li>
            <li>
              <span className="font-semibold">categoryId</span>: ID of the
              product category (see reference panel)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
