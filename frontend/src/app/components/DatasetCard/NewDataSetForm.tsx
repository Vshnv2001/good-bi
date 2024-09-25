import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Papa from "papaparse"
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function UploadCsvPage({datasetName, existingDatasetNames, setDatasetName, datasetDescription, setDatasetDescription}: {datasetName: string, existingDatasetNames: string[], setDatasetName: (datasetName: string) => void, datasetDescription: string, setDatasetDescription: (datasetDescription: string) => void}) {

  return (
      <div className="mx-4 my-3">
        {/* Dataset Name Input */}
        <h2 className="text-lg font-bold">Choose Dataset</h2>
        <Select onValueChange={(value) => { setDatasetName(value) }}>
          <SelectTrigger className="w-full p-2 my-2 border border-gray-300 rounded bg-white cursor-pointer">
            <SelectValue placeholder="Select a dataset" />
          </SelectTrigger>
          <SelectContent>
            {existingDatasetNames.map((datasetName: string) => (
              <SelectItem className="cursor-pointer" key={datasetName} value={datasetName}>
                {datasetName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    {datasetName === 'New Dataset' && (<div className="flex flex-col">
          <h2 className="text-lg font-bold">Dataset Name</h2>
          <Input
          placeholder="Dataset Name"
          value={datasetName === 'New Dataset' ? '' : datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          disabled={datasetName !== 'New Dataset'}
          className="w-full p-2 my-2 border border-gray-300 rounded bg-white"
        />
        {/* Dataset Description Textarea */}
        <h2 className="text-lg font-bold">Dataset Description</h2>
        <Textarea
          placeholder="Dataset Description"
          value={datasetDescription === 'New Dataset' ? '' : datasetDescription}
          onChange={(e) => setDatasetDescription(e.target.value)}
          disabled={datasetName !== 'New Dataset'}
          className="w-full p-2 my-2 border border-gray-300 rounded bg-white"
        />
        </div>)}
      </div>
    )
}



export default function NewDataSetForm({dataSets, setDataSets, closeModal}: {dataSets: any, setDataSets: any, closeModal: () => void}) {
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [existingDatasetNames, setExistingDatasetNames] = useState<string[]>(['New Dataset']);
  const [isNewDataset, setIsNewDataset] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [datasetJson, setDatasetJson] = useState<any>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/datasetnames`)
      .then((res) => {
        console.log(res.data.data);
        setExistingDatasetNames([ ...res.data.data, ...existingDatasetNames]);
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  function getColumns(file: File) {
    console.log("getting columns");
    Papa.parse(file, {
      header: true,
      complete: (results: Papa.ParseResult<any>) => {
          let headers = Object.keys(results.data[0])
          headers = headers.filter(header => header !== 'user_id');
          setColumns(headers);
          setDatasetJson(results.data); // Set the parsed JSON data
          setFile(file);
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('datasetName', datasetName);
    formData.append('datasetDescription', datasetDescription);
    if (file) {
      formData.append('datasetFile', file);
    }
    const file_id = uuidv4();
    formData.append('file_id', file_id);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/datasets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        const newDataset = {
          datasetName: datasetName,
          datasetDescription: datasetDescription,
          datasetJson: datasetJson,
          file_id: file_id
        }
        if (isNewDataset) {
          setDataSets([...dataSets, newDataset]);
        } 
        setDatasetName('');
        setDatasetDescription('');
        setFile(null);
        setDatasetJson(null); // Reset JSON data
        setSubmitted(true);
      } else {
        console.error('Failed to submit dataset');
      }
    } catch (error) {
      console.error('Error submitting dataset:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    if (e.target.files && e.target.files.length > 0) {
      getColumns(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      getColumns(files[0]);
    }
  };

  if (submitted) {
    return (
      <div className="mx-4 my-3">
        <h1 className="text-3xl font-bold">Dataset Submitted</h1>
        <p>Your dataset has been submitted for review. You will be notified when it is approved.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 p-4 mx-4 mt-3 rounded-2xl border border-gray-200/70">
      <div className="mx-4 my-3 mb-4 flex justify-center">
        <h1 className="text-3xl font-bold">Create New Dataset</h1>
      </div>
      <div className="mx-4 my-3">
        {/* Dataset Name Input */}
        <h2 className="text-lg font-bold">Choose Dataset</h2>
        <Select onValueChange={(value) => { setDatasetName(value); setIsNewDataset(value === 'New Dataset') }}>
          <SelectTrigger className="w-full p-2 my-2 border border-gray-300 rounded bg-white cursor-pointer">
            <SelectValue placeholder="Select a dataset" />
          </SelectTrigger>
          <SelectContent>
            {existingDatasetNames.map((datasetName: string) => (
              <SelectItem className="cursor-pointer" key={datasetName} value={datasetName}>
                {datasetName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    {isNewDataset && (<div className="flex flex-col">
          <h2 className="text-lg font-bold">Dataset Name</h2>
          <Input
          placeholder="Dataset Name"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          disabled={!isNewDataset}
          className="w-full p-2 my-2 border border-gray-300 rounded bg-white"
        />
        {/* Dataset Description Textarea */}
        <h2 className="text-lg font-bold">Dataset Description</h2>
        <Textarea
          placeholder="Dataset Description"
          value={datasetDescription === 'New Dataset' ? '' : datasetDescription}
          onChange={(e) => setDatasetDescription(e.target.value)}
          disabled={!isNewDataset}
          className="w-full p-2 my-2 border border-gray-300 rounded bg-white"
        />
        </div>)}
      </div>
      <form onSubmit={(event) => {handleSubmit(event); closeModal()}}>
        {/* File Upload Area */}
        <div 
            className="border-2 border-dashed border-gray-300 mx-4 rounded-lg p-6 mb-4 text-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              {file ? file.name : "Drag and drop a CSV file here, or click to select"}
            </label>
        </div>
        <h2 className="text-lg mx-4 my-2 font-bold">Column Descriptors</h2>
        {columns.length > 0 && 
        columns.map((column: string) => {
          return (
            <div key={column} className="flex flex-col mx-4">
              <p className="text-sm">{column}</p>
              <Input
                placeholder="Column Name"
                value={"Column Descriptor for " + column}
                onChange={(e) => setColumns(e.target.value.split(','))}
                className="w-full p-2 my-2 border border-gray-300 rounded bg-white"
              />
            </div>
          )
        })
        }
        <div className="flex justify-end space-x-4 mt-4">
          <Button 
            type="submit" 
            disabled={!datasetName || !file}
            className="text-white bg-primary-700 hover:bg-primary-600"
          >
            Submit
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};

