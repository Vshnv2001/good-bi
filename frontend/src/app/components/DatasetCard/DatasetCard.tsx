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
import { Trash } from "lucide-react";
interface DatasetCardProps {
    dataset: Dataset;
    datasets: Dataset[];
    setDatasets: (datasets: Dataset[]) => void;
}


export function DatasetCard({ dataset, datasets, setDatasets }: DatasetCardProps) {
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<string[][]>([]);
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
        if (!dataset.datasetFile && !dataset.datasetJson) {
            console.error("datasetFile is undefined or null");
            return;
        }
        console.log("datasetFile:", dataset.datasetFile);

        const parseCSV = async () => {
            if (dataset.datasetFile) { // Check if datasetFile is defined
                Papa.parse(dataset.datasetFile, {
                    header: true,
                    complete: (results: Papa.ParseResult<any>) => {
                        let headers = Object.keys(results.data[0])
                        headers = headers.filter(header => !header.includes('user_id') && !header.includes('file_id') && !header.includes('description') && !header.includes('created_at'));
                        setHeaders(headers);;
                        setRows(results.data.slice(0, 3)) // Get first 3 rows
                    }
                });
            } else {
                console.error("Dataset file is undefined");
            }
            
        };

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

        if (dataset.datasetFile) {
            parseCSV()
        } else if (dataset.datasetJson) {
            parseJSON()
        } else {
            console.error("Invalid data type");
        }
    }, [dataset.datasetFile, dataset.datasetJson])


    return (
        <Card className="m-4">
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-xl">{dataset.datasetName}</CardTitle>
                <Trash className="cursor-pointer size-5 mt-3 hover:text-red-500" onClick={deleteFile} />
            </CardHeader>
            <CardContent>
                <p className="mb-4 italic">{dataset.datasetDescription}</p>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                        {headers.map((header, index) => (
                                <th key={index} className="border p-2 text-left">{header}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, cellIndex) => (
                                    <td key={cellIndex} className="border p-2">{(row as any)[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}