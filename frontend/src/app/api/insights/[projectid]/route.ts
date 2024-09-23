import { NextResponse, NextRequest } from "next/server";
import SuperTokens from "supertokens-node";
import { withSession } from "supertokens-node/nextjs";
import { backendConfig } from "@/app/config/backend";
import { format } from "date-fns"
import { DashboardCardData } from "@/app/types/DashboardCardData";
import { ChartType, LineChartData, PieChartData } from "@/app/types/ChartData";
import { ChartConfig } from "@/components/ui/chart";

SuperTokens.init(backendConfig());

export function GET(request: NextRequest, { params }: { params: { projectid: string } }) {
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
        formData.append('project_id', params.projectid);
        let data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`, {
            method: 'POST',
            body: formData
        });

        let dashboards = await data.json()

        const chartConfig = {
            desktop: {
                label: "Desktop",
                color: "hsl(var(--chart-1))",
            },
            mobile: {
                label: "Mobile",
                color: "hsl(var(--chart-2))",
            },
        } satisfies ChartConfig

        const dbData = [
            { month: "January", desktop: 186, mobile: 80 },
            { month: "February", desktop: 305, mobile: 200 },
            { month: "March", desktop: 237, mobile: 120 },
            { month: "April", desktop: 73, mobile: 190 },
            { month: "May", desktop: 209, mobile: 130 },
            { month: "June", desktop: 214, mobile: 140 },
        ]

        const browserChartConfig = {
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

        const browserChartData = [
            { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
            { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
            { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
            { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
            { browser: "other", visitors: 90, fill: "var(--color-other)" },
        ]

        const otherChartData = {
            chartConfig: chartConfig,
            data: dbData,
            xAxisDataKey: "month",
            dataKeys: ["desktop", "mobile"]
        } as LineChartData;

        const pieChartData = {
            chartConfig: browserChartConfig,
            data: browserChartData,
            nameKey: "browser",
            dataKey: "visitors"
        } as PieChartData;

        let mappedDashboards: DashboardCardData[] = dashboards.map((data: { insight_id: string, user_id: string, project_id: string, dataset_id: string, title: string, kpi_description: string, chart_type: string, start_date: string, end_date: string, y_range_start: number, y_range_end: number, created_at: string, updated_at: string }) => {
            console.log(data)
            return {
                id: data.insight_id,
                key: data.insight_id,
                title: data.title,
                chartType: data.chart_type,
                chartData: data.chart_type == ChartType.Pie ? pieChartData : otherChartData 
            };
        });

        return NextResponse.json(mappedDashboards)
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

        formData.append('dataset_id', req['datasetId'])
        formData.append('chart_type', req['chartType']);
        formData.append('start_date', format(req['dateRange']['end'], "MM-dd-yyyy"))
        formData.append('end_date', format(req['dateRange']['end'], "MM-dd-yyyy"))
        // Replace y_range with actual values
        formData.append('y_range_start', '0')
        formData.append('y_range_end', '999')
        formData.append('title', req['title'])
        formData.append('kpi_description', req['kpiDescription'])
        formData.append('project_id', req['projectId'])
        formData.append('user_id', userId);
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insights/new`, {
            method: 'POST',
            body: formData
        });

        let data = await res.json()

        return NextResponse.json(data)
    });
}