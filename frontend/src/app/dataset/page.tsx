"use client";

import Link from "next/link"

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartConfig } from "@/components/ui/chart"

import { Responsive, WidthProvider } from "react-grid-layout";

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { DatasetCard } from "@/app/components/DatasetCard";
import { useState } from "react";
import NewDataSetForm from "@/app/components/DatasetCard/NewDataSetForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Dataset } from "@/app/interfaces/dataset"

export default function DatasetPage() {

    const [datasets, setDatasets] = useState<Dataset[]>([]);
    console.log(datasets);
    return (
        <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
            <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
            <h1 className="text-3xl font-normal text-gray-800">Datasets</h1>
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <form>
                <div className="relative flex flex-col justify-center">
                    <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900 " />
                    <Input
                    type="search"
                    placeholder="Search"
                    className="pl-10 rounded-xl text-base placeholder:text-gray-500 border border-gray-200/70 bg-white shadow-none md:w-56"
                    />
                </div>
                </form>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-base text-white rounded-xl bg-primary-700 px-4 py-2.5 shadow-none hover:bg-primary-600">
                            New Dataset
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <NewDataSetForm dataSets={datasets} setDataSets={setDatasets} closeModal={() => {}} />
                    </DialogContent>
                </Dialog>
            </div>
            </div>
            <div className="mx-4 pb-4 flex-grow overflow-y-auto">
                {datasets.map((dataset, index) => (
                    <DatasetCard key={index} dataset={dataset} />
                ))}
            </div>
        </main>
        </div>
    )
}
