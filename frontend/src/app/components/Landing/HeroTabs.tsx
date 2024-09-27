import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChartConfig } from "@/components/ui/chart";
import { Responsive, WidthProvider } from "react-grid-layout";
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { BarChartData, ChartType, LineChartData, PieChartData } from '@/app/types/ChartData';
import { DashboardCardData } from '@/app/types/DashboardCardData';
import HeroCard from "@/app/components/Landing/HeroCard";
import { DatasetTable } from "@/app/components/DatasetCard/DatasetTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

const buttonShapeTabs = ['Dashboard', 'Datasets']

interface TabProps {
  text: string
  selected: boolean
  setSelected: (text: string) => void
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${selected
        ? 'text-gray-800'
        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'
        } relative rounded-md px-3 py-1 text-base transition-colors`}
    >
      <span className="relative z-[1]">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-md bg-gray-200"
        ></motion.span>
      )}
    </button>
  )
}

const Tabs = ({ selected, setSelected }: { selected: string, setSelected: (value: string) => void }) => {
  return (
    <div className="my-1 flex flex-wrap items-center justify-center gap-2">
      {buttonShapeTabs.map((tab) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
        />
      ))}
    </div>
  )
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 1 },
  { i: 'b', x: 1, y: 0, w: 1, h: 1 },
  { i: 'c', x: 0, y: 1, w: 2, h: 1 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

const browserData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const pieChartBrowserData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const barChartData = {
  chartConfig: chartConfig,
  data: browserData,
  xAxisDataKey: "month",
  dataKeys: ["desktop", "mobile"]
} as BarChartData;

const lineChartData = {
  chartConfig: chartConfig,
  data: browserData,
  xAxisDataKey: "month",
  dataKeys: ["desktop", "mobile"]
} as LineChartData;

const pieChartData = {
  chartConfig: pieChartConfig,
  data: pieChartBrowserData,
  nameKey: "browser",
  dataKey: "visitors"
} as PieChartData;

const cardData: DashboardCardData[] = [
  {
    id: "1",
    key: "a",
    title: "Chart 1",
    chartType: ChartType.Bar,
    chartData: barChartData,
    projectId: ""
  },
  {
    id: "2",
    key: "b",
    title: "Chart 2",
    chartType: ChartType.Line,
    chartData: lineChartData,
    projectId: ""
  },
  {
    id: "3",
    key: "c",
    title: "Chart 3",
    chartType: ChartType.Pie,
    chartData: pieChartData,
    projectId: ""
  },
]

const HeroDashboard = () => {
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      cols={{ lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 }}
      rowHeight={200}
      maxRows={2}
    >
      {
        cardData.map((data) => {
          return (
            <HeroCard key={data.key} data={data} deleteInsight={() => {}} />
          )
        })
      }
    </ResponsiveGridLayout>
  )
}

const HeroDatasets = () => {
  const data = [
    {
      "track_name": "Seven (feat. Latto) (Explicit Ver.)",
      "artist(s)_name": "Latto, Jung Kook",
      "artist_count": "2",
      "released_year": "2023",
      "released_month": "7",
      "released_day": "14",
      "in_spotify_playlists": "553",
      "in_spotify_charts": "147",
      "streams": "141381703",
      "in_apple_playlists": "43",
      "in_apple_charts": "263",
      "in_deezer_playlists": "45",
      "in_deezer_charts": "10",
      "in_shazam_charts": "826",
      "bpm": "125",
      "key": "B",
      "mode": "Major",
      "danceability_%": "80",
      "valence_%": "89",
      "energy_%": "83",
      "acousticness_%": "31",
      "instrumentalness_%": "0",
      "liveness_%": "8",
      "speechiness_%": "4",
      "cover_url": "Not Found",
      "user_id": "f40659b4-4812-4967-8ee5-2c9bfb273d4c",
      "file_id": "99aaf172-98b5-439c-bbe0-f33554662cdc",
      "description": "333",
      "created_at": "2024-09-25 12:56:14.257649"
    },
    {
      "track_name": "LALA",
      "artist(s)_name": "Myke Towers",
      "artist_count": "1",
      "released_year": "2023",
      "released_month": "3",
      "released_day": "23",
      "in_spotify_playlists": "1474",
      "in_spotify_charts": "48",
      "streams": "133716286",
      "in_apple_playlists": "48",
      "in_apple_charts": "126",
      "in_deezer_playlists": "58",
      "in_deezer_charts": "14",
      "in_shazam_charts": "382",
      "bpm": "92",
      "key": "C#",
      "mode": "Major",
      "danceability_%": "71",
      "valence_%": "61",
      "energy_%": "74",
      "acousticness_%": "7",
      "instrumentalness_%": "0",
      "liveness_%": "10",
      "speechiness_%": "4",
      "cover_url": "https://i.scdn.co/image/ab67616d0000b2730656d5ce813ca3cc4b677e05",
      "user_id": "f40659b4-4812-4967-8ee5-2c9bfb273d4c",
      "file_id": "99aaf172-98b5-439c-bbe0-f33554662cdc",
      "description": "333",
      "created_at": "2024-09-25 12:56:14.257649"
    },
    {
      "track_name": "vampire",
      "artist(s)_name": "Olivia Rodrigo",
      "artist_count": "1",
      "released_year": "2023",
      "released_month": "6",
      "released_day": "30",
      "in_spotify_playlists": "1397",
      "in_spotify_charts": "113",
      "streams": "140003974",
      "in_apple_playlists": "94",
      "in_apple_charts": "207",
      "in_deezer_playlists": "91",
      "in_deezer_charts": "14",
      "in_shazam_charts": "949",
      "bpm": "138",
      "key": "F",
      "mode": "Major",
      "danceability_%": "51",
      "valence_%": "32",
      "energy_%": "53",
      "acousticness_%": "17",
      "instrumentalness_%": "0",
      "liveness_%": "31",
      "speechiness_%": "6",
      "cover_url": "https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d",
      "user_id": "f40659b4-4812-4967-8ee5-2c9bfb273d4c",
      "file_id": "99aaf172-98b5-439c-bbe0-f33554662cdc",
      "description": "333",
      "created_at": "2024-09-25 12:56:14.257649"
    }
  ]

  const headers = [
    "track_name",
    "artist(s)_name",
    "artist_count",
    "released_year",
    "released_month",
    "released_day",
    "in_spotify_playlists",
    "in_spotify_charts",
    "streams",
    "in_apple_playlists",
    "in_apple_charts",
    "in_deezer_playlists",
    "in_deezer_charts",
    "in_shazam_charts",
    "bpm",
    "key",
    "mode",
    "danceability_%",
    "valence_%",
    "energy_%",
    "acousticness_%",
    "instrumentalness_%",
    "liveness_%",
    "speechiness_%",
    "cover_url",
    "user_id",
    "file_id",
    "description",
    "created_at"
  ]

  type ColumnType = Record<string, string>;
  const columns: ColumnDef<ColumnType>[] = headers.map((key) => {
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
    <div className="px-3 pt-2">
      <Card className="mb-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-base">Spotify Top Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <DatasetTable<ColumnType> columns={columns} data={data}/>
        </CardContent>
      </Card>
    </div>
  )
}

const HeroTabs = () => {
  const [selected, setSelected] = useState<string>('Dashboard')
  return (
    <div className="p-4 max-w-4xl mx-auto mt-12">
      <div className="bg-gray-50 h-svh p-2 rounded-2xl shadow-lg">
        <Tabs selected={selected} setSelected={(val) => setSelected(val)} />
        {selected === 'Dashboard' && <HeroDashboard />}
        {selected === 'Datasets' && <HeroDatasets />}
      </div>
    </div>
  )
}

export default HeroTabs
