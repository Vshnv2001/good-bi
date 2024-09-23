import { NextResponse, NextRequest } from "next/server";
import SuperTokens from "supertokens-node";
import { withSession } from "supertokens-node/nextjs";
import { backendConfig } from "@/app/config/backend";

SuperTokens.init(backendConfig());

export function POST(request: NextRequest, { params }: { params: { projectid: string, insightid: string } }) {
    return withSession(request, async (err, session) => {
        if (err) {
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        let userId = session!.getUserId();

        let formData = new FormData();
        formData.append('insight_id', params.insightid);
        formData.append('project_id', params.projectid);
        formData.append('user_id', userId);
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/delete`, {
            method: 'POST',
            body: formData
        });

        let data = await res.json()
        
        return NextResponse.json(data)
    });
}