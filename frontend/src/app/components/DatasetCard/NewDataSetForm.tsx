import React, { useState } from 'react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';


export default function NewDataSetForm({dataSets, setDataSets, closeModal}: {dataSets: any, setDataSets: any, closeModal: () => void}) {
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('datasetName', datasetName);
    formData.append('datasetDescription', datasetDescription);
    if (file) {
      formData.append('datasetFile', file);
    }

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
          datasetFile: file
        }
        setDataSets([...dataSets, newDataset]);
        setDatasetName('');
        setDatasetDescription('');
        setFile(null);
        closeModal(); // Close the modal after submitting
      } else {
        console.error('Failed to submit dataset');
      }
    } catch (error) {
      console.error('Error submitting dataset:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
      <div className="mx-4 my-3">
        <h1>Create New Dataset</h1>
      </div>
      <div className="mx-4 my-3">
        {/* Dataset Name Input */}
        <h2>Dataset Name</h2>
        <input
          type="text"
          placeholder="Dataset Name"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {/* Dataset Description Textarea */}
        <Textarea
          placeholder="Dataset Description"
          value={datasetDescription}
          onChange={(e) => setDatasetDescription(e.target.value)}
          className="w-full p-2 mt-4 border border-gray-300 rounded"
        />
      </div>
      <form onSubmit={handleSubmit}>
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
        <div className="flex justify-end space-x-4 mt-4">
          <Button 
            type="submit" 
            disabled={!datasetName || !datasetDescription || !file}
            className="text-white bg-primary-700 hover:bg-primary-600"
          >
            Submit
          </Button>
        </div>
      </form>
    </main>
  );
};

