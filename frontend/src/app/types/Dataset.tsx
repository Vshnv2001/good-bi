export type Dataset = {
    fileId: string;
    datasetName: string;
    datasetDescription: string;
    datasetFile?: File;
    datasetJson?: any;
}