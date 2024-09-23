"use client";

import Link from "next/link"

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Responsive, WidthProvider } from "react-grid-layout";

import { NavBar } from "@/app/components/NavBar";
import { DashboardCard } from "@/app/components/DashboardCard";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

import { usePathname } from "next/navigation";
import { DashboardCardData } from "@/app/types/DashboardCardData";

import { useState, useEffect } from "react";
import { doesSessionExist } from "supertokens-web-js/recipe/session";
import SessionCheck from "@/app/components/SessionCheck";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts = {
  sm: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ],
  md: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ],
  lg: [
    { i: "a", x: 0, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "b", x: 1, y: 0, w: 1, h: 1, minH: 1, minW: 1 },
    { i: "c", x: 2, y: 0, w: 1, h: 1, minH: 1, minW: 1 }
  ]
};

export default function Dashboard({ params }: { params: { projectid: string } }) {
  const [dashboards, setDashboards] = useState<DashboardCardData[]>([]);
  const [layouts, setLayouts] = useState({lg: []});

  useEffect(() => {
    async function fetchDashboards() {
      let res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/projects/${params.projectid}/insights`)

      if (res.status == 200) {
        let data = await res.json()
        setDashboards(data);

        let lgLayouts = data.map((data: DashboardCardData, index: number) => {
          return {
            i: data.key,
            x: index % 3,
            y: Math.floor(index / 3),
            w: 1, 
            h: 1, 
            minH: 1, 
            minW: 1
          }
        });
        setLayouts({lg: lgLayouts});
      }
    }
    fetchDashboards()
  }, []);

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <main className="flex max-h-[calc(100vh_-_theme(spacing.20))] flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
          <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
            <h1 className="text-3xl font-normal text-gray-800">Dashboard</h1>
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <form>
                <div className="relative flex flex-col justify-center">
                  <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900 " />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="pl-10 md:w-56"
                  />
                </div>
              </form>
              <Button asChild>
                <Link href={`${usePathname()}/new`}>
                  Create New
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-4 pb-4 flex-grow overflow-y-auto">
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ sm: 640, md: 768, lg: 1024 }}
              cols={{ sm: 1, md: 2, lg: 3 }}
              containerPadding={[0, 0]}
              margin={[16, 16]}
              rowHeight={275}
              compactType="horizontal"
              draggableCancel=".react-resizable-handle-custom"
            >
              {
                dashboards.map((data) => {
                  console.log(data.key)
                  return (
                    <DashboardCard key={data.key} data={data} />
                  )
                })
              }
            </ResponsiveGridLayout>
          </div>
        </main>
      </div>
    </SessionCheck>
  )
}
