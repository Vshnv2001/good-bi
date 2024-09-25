import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dataset } from "@/app/types/Dataset";
import { useEffect, useState } from "react"
import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EllipsisVerticalIcon,
  Trash
} from "lucide-react";
import { DatasetTable } from "@/app/components/DatasetCard/DatasetTable";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DatasetCardProps {
  dataset: Dataset;
  datasets: Dataset[];
  setDatasets: (datasets: Dataset[]) => void;
}


export function DatasetCard({dataset, datasets, setDatasets}: DatasetCardProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);

  function deleteFile() {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets/${dataset.datasetName}`)
      .then(() => {
        setDatasets(datasets.filter(d => d.datasetName !== dataset.datasetName));
        toast(`Deleted ${dataset.datasetName}`)
      })
      .catch((err) => {
        toast.error(err);
      })
  }


  useEffect(() => {
    if (!dataset.datasetJson) {
      toast.error("Error in data files.");
      return;
    }

    const parseJSON = async () => {
      if (dataset.datasetJson && dataset.datasetJson.length > 0) { // Check if datasetJson is defined and not empty
        const data = dataset.datasetJson; // No need to parse
        let headers = Object.keys(data[0])
        headers = headers.filter(header => !header.includes('user_id') && !header.includes('file_id') && !header.includes('description') && !header.includes('created_at'));
        setHeaders(headers);
        setRows(data);
      } else {
        toast.error("Error parsing data.");
      }
    };
    if (dataset.datasetJson) {
      parseJSON()
    } else {
      toast.error("Invalid data.");
    }
  }, [dataset.datasetJson])

  const keys = [...headers] as const;
  type ColumnType = Record<string, string>;
  const columns: ColumnDef<ColumnType>[] = keys.map((key) => {
    return {
      accessorKey: key,
      header: ({column}) => {
        return (
          <button
            className="inline-flex items-center gap-1 hover:text-gray-800 transition-colors duration-100"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {key}
            {!column.getIsSorted()
              ? <ArrowUpDown className="shrink-0 size-4"/>
              : column.getIsSorted() === 'asc'
                ? <ArrowUp className="shrink-0 size-4"/>
                : <ArrowDown className="shrink-0 size-4"/>
            }
          </button>
        )
      },
      cell: ({row}) => (
        <div>{row.getValue(key)}</div>
      ),
    }
  })

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl">{dataset.datasetName}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="size-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Trash className="size-4 mr-1.5" onClick={deleteFile}/>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </CardHeader>
      <CardContent>
        {dataset.datasetDescription && <p className="mb-4 italic">{dataset.datasetDescription}</p>}
        <DatasetTable<ColumnType> columns={columns} data={rows}/>
      </CardContent>
    </Card>
  )
}