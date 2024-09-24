"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import Link from "next/link"

import { Search } from "lucide-react";

import { debounce } from "lodash";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { NavBar } from "@/app/components/NavBar";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { ProjectCardData } from "@/app/types/ProjectCardData"
import { ProjectCard } from "../components/ProjectCard";

import SessionCheck from "../components/SessionCheck";


export default function Projects() {
    const [filteredProjects, setFilteredProjects] = useState<ProjectCardData[]>([]);
    const [projects, setProjects] = useState<ProjectCardData[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);

            if (res.status == 200) {
                let data = await res.json();

                setProjects(data);
                setFilteredProjects(data);
            }
        }
        fetchProjects()
    }, []);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            const filtered = projects.filter((project) =>
                project.name.toLowerCase().includes(query.toLowerCase())
            );

            setFilteredProjects(filtered);
        }, 300),
        [projects]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        debouncedSearch(query);
    };

    async function deleteProject(projectId: string) {
        let formData = new FormData();
        formData.append('project_id', projectId);
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete`, {
            method: 'POST',
            body: formData
        });

        if (res.status == 200) {
            setProjects(projects => projects.filter(project => project.id != projectId));
            setFilteredProjects(filteredProjects => filteredProjects.filter(project => project.id != projectId));
            let responseData = await res.json()
        }
    }

    return (
        <SessionCheck>
            <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
                <NavBar />
                <main className="flex mb-3 flex-1 flex-col bg-gray-100 mx-4 mt-3 rounded-2xl border border-gray-200/70">
                    <div className="mx-4 my-3 flex flex-col gap-4 md:h-10 md:flex-row md:gap-0 md:items-center md:justify-between">
                        <h1 className="text-3xl font-normal text-gray-800">Projects</h1>
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
                            <Button asChild>
                                <Link href="/projects/new">
                                    Create New
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="mx-4 pb-4 flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {
                                filteredProjects.map((project) => {
                                    return (
                                        <ProjectCard key={project.id} project={project} deleteProject={deleteProject} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </main>
            </div>
        </SessionCheck>
    )
}
