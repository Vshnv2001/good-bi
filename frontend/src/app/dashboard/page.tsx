"use client";

import Link from "next/link"

import { Check, ChevronDown, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";

import { NavBar } from "@/app/components/NavBar";
import { DashboardCard } from "@/app/components/DashboardCard";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

import { usePathname, useRouter } from "next/navigation";
import { DashboardCardData } from "@/app/types/DashboardCardData";

import { useState, useEffect, useCallback } from "react";

import { debounce } from "lodash";

import { doesSessionExist } from "supertokens-web-js/recipe/session";
import SessionCheck from "@/app/components/SessionCheck";
import { ProjectCardData } from "../types/ProjectCardData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


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

export default function Dashboard() {
  const router = useRouter();

  const [open, setOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState("");

  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectCardData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);

  const [insights, setInsights] = useState<DashboardCardData[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<DashboardCardData[]>([]);
  const [layouts, setLayouts] = useState<Layouts>({ sm: [], md: [], lg: [] });

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);

      if (res.status == 200) {
        const data: ProjectCardData[] = await res.json();

        setProjects(data);
        setFilteredProjects(data);

        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      }
    }
    fetchProjects()
  }, []);

  useEffect(() => {
    async function fetchInsights(projectId: string) {
      const formData = new FormData();
      formData.append('project_id', projectId);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`, {
        method: 'POST',
        body: formData
      });

      if (res.status == 200) {
        const data = await res.json()

        setInsights(data);
        setFilteredInsights(data);
      }
    }

    if (selectedProject) {
      fetchInsights(selectedProject.id)
    }
  }, [selectedProject]);

  useEffect(() => {
    const smLayouts = filteredInsights.map((data: DashboardCardData, index: number) => {
      return {
        i: data.key,
        x: 0,
        y: index,
        w: 1,
        h: 1,
        minH: 1,
        minW: 1
      }
    });

    const mdLayouts = filteredInsights.map((data: DashboardCardData, index: number) => {
      return {
        i: data.key,
        x: index % 2,
        y: Math.floor(index / 2),
        w: 1,
        h: 1,
        minH: 1,
        minW: 1
      }
    });

    const lgLayouts = filteredInsights.map((data: DashboardCardData, index: number) => {
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

    setLayouts({ sm: smLayouts, md: mdLayouts, lg: lgLayouts });
  }, [filteredInsights])

  useEffect(() => {
    setFilteredProjects(projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));

  }, [searchQuery]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const filtered = insights.filter((insight) =>
        insight.title.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredInsights(filtered);
    }, 300),
    [insights]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  const handleGridLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {

  }

  async function deleteProject(projectId: string) {
    const formData = new FormData();
    formData.append('project_id', projectId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      const updatedFilteredProjects = filteredProjects.filter(project => project.id != projectId);
      setProjects(projects => projects.filter(project => project.id != projectId));
      setFilteredProjects(updatedFilteredProjects);

      if (updatedFilteredProjects.length > 0) {
        setSelectedProject(updatedFilteredProjects[0]);
      } else {
        setSelectedProject(null);
        setFilteredInsights([]);
      }

      const responseData = await res.json()
    }
  }

  async function deleteInsight(projectId: string, insightId: string) {
    const formData = new FormData();
    console.log(projectId)
    formData.append('insight_id', insightId);
    formData.append('project_id', projectId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/delete`, {
      method: 'POST',
      body: formData
    });

    if (res.status == 200) {
      setInsights(insights => insights.filter(insight => insight.id != insightId));
      setFilteredInsights(filteredInsights => filteredInsights.filter(insight => insight.id != insightId))
      const responseData = await res.json()
    }
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
        <NavBar />
        <main className="flex flex-1 flex-col bg-gray-100 mx-4 my-3 rounded-2xl border border-gray-200/70">
          <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex flex-row gap-3 text-gray-800 items-center">
                  <h1 className="text-3xl font-normal">{selectedProject ? selectedProject.name : "Select Project"}</h1>
                  <ChevronDown className="h-6 w-6" />
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[200px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Search projects" />
                  <CommandList>
                    <CommandGroup>
                      {
                        filteredProjects.length === 0 ?
                          <div className="text-center text-sm px-1 py-2">
                            <span>No projects found.</span>
                          </div>
                          :
                          filteredProjects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={project.id}
                              onSelect={() => {
                                setSelectedProject(project);
                                setOpen(false);
                              }}
                            >
                              {project.name}
                            </CommandItem>
                          ))
                      }
                    </CommandGroup>
                  </CommandList>
                  <CommandSeparator />
                  <CommandList>
                    <CommandGroup>
                      {selectedProject && <CommandItem onSelect={() => {
                        router.push(`/dashboard/${selectedProject?.id}/update`);
                        setOpen(false);
                      }}>
                        <Pencil className="size-4 mr-1.5" />
                        Edit project
                      </CommandItem>}
                      {selectedProject && <CommandItem className="text-destructive" onSelect={() => {
                        deleteProject(selectedProject!.id);
                        setOpen(false);
                      }}>
                        <Trash2 className="size-4 mr-1.5" />
                        Delete project
                      </CommandItem>}
                      <CommandItem onSelect={() => {
                        router.push('/dashboard/new');
                        setOpen(false);
                      }}>
                        <Plus className="size-4 mr-1.5" />
                        New project
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <form>
                <div className="relative flex flex-col justify-center">
                  <Search className="absolute left-3 h-4.5 w-4.5 text-gray-900 " />
                  <Input
                    type="search"
                    placeholder="Search"
                    onChange={handleInputChange}
                    className="pl-10 md:w-56"
                  />
                </div>
              </form>
              <Button asChild={selectedProject != null} disabled={selectedProject == null}>
                <Link href={`/dashboard/${selectedProject?.id}/insights/new`}>
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
              onLayoutChange={handleGridLayoutChange}
              draggableCancel=".react-resizable-handle-custom"
            >
              {
                filteredInsights.map((data) => {
                  return (
                    <DashboardCard key={data.key} data={data} deleteInsight={deleteInsight} />
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
