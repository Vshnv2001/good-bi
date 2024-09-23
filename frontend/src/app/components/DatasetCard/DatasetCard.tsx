import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dataset } from "@/app/interfaces/dataset"
import { useEffect, useState } from "react"
import Papa from "papaparse"

interface DatasetCardProps {
    dataset: Dataset;
    
}

export function DatasetCard({ dataset }: DatasetCardProps) {
    const [headers, setHeaders] = useState<string[]>([])
    const [rows, setRows] = useState<string[][]>([])

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
                        headers = headers.filter(header => header !== 'user_id');
                        setHeaders(headers)
                        setRows(results.data.slice(0, 3)) // Get first 3 rows
                    }
                });
            } else {
                console.error("Dataset file is undefined");
            }
        };

        const parseJSON = async () => {
            if (dataset.datasetJson) { // Check if datasetJson is defined
                console.log("datasetJson:", dataset.datasetJson);
                console.log(Object.keys(dataset.datasetJson[0]));
                const data = dataset.datasetJson; // No need to parse
                let headers = Object.keys(data[0])
                headers = headers.filter(header => header !== 'user_id');
                setHeaders(headers)
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

    // console.log("Headers:", headers);
    // console.log("Rows:", rows);

    return (
        <Card className="w-full mb-4 mr-4">
            <CardHeader>
                <CardTitle>{dataset.datasetName}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Database: {dataset.datasetDescription}</p>
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