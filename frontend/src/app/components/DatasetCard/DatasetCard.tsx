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
        if (!dataset.datasetFile) {
            console.error("datasetFile is undefined or null");
            return;
        }
        console.log("datasetFile:", dataset.datasetFile);

        const parseCSV = async () => {
            Papa.parse(dataset.datasetFile, {
                header: true,
                complete: (results: Papa.ParseResult<any>) => {
                    setHeaders(Object.keys(results.data[0]))
                    setRows(results.data.slice(1, 4)) // Get first 3 rows
                }
            })
        }

        parseCSV()
    }, [dataset.datasetFile])

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