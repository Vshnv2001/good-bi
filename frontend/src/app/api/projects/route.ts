import { NextResponse, NextRequest } from "next/server";
import SuperTokens from "supertokens-node";
import { withSession } from "supertokens-node/nextjs";
import { backendConfig } from "@/app/config/backend";
import { ProjectCardData } from "@/app/types/ProjectCardData";

SuperTokens.init(backendConfig());

export function GET(request: NextRequest) {
    return withSession(request, async (err, session) => {
        if (err) {
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        let userId = session!.getUserId();

        let formData = new FormData();
        formData.append('user_id', userId);
        let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
            method: 'POST',
            body: formData
        });

        let projects = await data.json()

        let mappedProjects: ProjectCardData[] = projects.map((data: { project_id: number, user_id: string, name: string, created_at: string, updated_at: string }) => {
            return {
                id: data.project_id.toString(),
                name: data.name,
                lastUpdated: Date.parse(data.created_at)
            };
        });
        
        return NextResponse.json(mappedProjects)
    });
}

export function POST(request: NextRequest) {
    return withSession(request, async (err, session) => {
        if (err) {
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        let userId = session!.getUserId();

        const req = await request.json();

        let formData = new FormData();
        formData.append('name', req['name'])
        formData.append('user_id', userId);
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/new`, {
            method: 'POST',
            body: formData
        });

        let data = await res.json()
        
        return NextResponse.json(data)
    });
}