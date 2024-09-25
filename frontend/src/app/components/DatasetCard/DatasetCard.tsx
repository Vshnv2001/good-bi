import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dataset } from "@/app/types/Dataset";
import { useEffect, useState } from "react"
import Papa from "papaparse"
import axios from "axios";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash } from "lucide-react";
import { DatasetTable } from "@/app/components/DatasetCard/DatasetTable";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button";

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
            .then((res) => {
                console.log(res);
                setDatasets(datasets.filter(d => d.datasetName !== dataset.datasetName));
            })
            .catch((err) => {
                console.error(err);
            })
    }


    useEffect(() => {
        // console.log("Parsing CSV");
        if (!dataset.datasetJson) {
            console.error("datasetJson is undefined or null");
            return;
        }

        const parseJSON = async () => {
            if (dataset.datasetJson && dataset.datasetJson.length > 0) { // Check if datasetJson is defined and not empty
                console.log("datasetJson:", dataset.datasetJson);
                console.log(Object.keys(dataset.datasetJson[0]));
                const data = dataset.datasetJson; // No need to parse
                let headers = Object.keys(data[0])
                headers = headers.filter(header => !header.includes('user_id') && !header.includes('file_id') && !header.includes('description') && !header.includes('created_at'));
                setHeaders(headers);
                setRows(data.slice(0, 3));
            } else {
                console.error("Dataset JSON is undefined");
            }
        };
        if (dataset.datasetJson) {
            parseJSON()
        } else {
            console.error("Invalid data type");
        }
    }, [ dataset.datasetJson])

    const keys = [...headers] as const;
    type ColumnType = Record<string, string>;
    const columns: ColumnDef<ColumnType>[] = keys.map((key) => {
        return {
            accessorKey: key,
            header: ({column}) => {
                return (
                    <button
                        className="inline-flex hover:text-gray-800 transition-colors duration-100"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {key}
                        {!column.getIsSorted()
                            ? <ArrowUpDown className="ml-1 size-4"/>
                            : column.getIsSorted() === 'asc'
                                ? <ArrowUp className="ml-1 size-4"/>
                                : <ArrowDown className="ml-1 size-4"/>
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
                <Button variant="ghost" size="icon" className="[&_svg]:hover:text-red-500">
                    <Trash className="size-5" onClick={deleteFile}/>
                </Button>
            </CardHeader>
            <CardContent>
                {dataset.datasetDescription && <p className="mb-4 italic">{dataset.datasetDescription}</p>}
                <DatasetTable<ColumnType> columns={columns} data={rows}/>
            </CardContent>
        </Card>
    )
}