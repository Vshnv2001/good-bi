import {motion} from 'framer-motion'
import {useState} from 'react'
import {DashboardCard} from "@/app/components/DashboardCard";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {ChartConfig} from "@/components/ui/chart";
import {Responsive, WidthProvider} from "react-grid-layout";
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const buttonShapeTabs = ['Dashboard', 'Dataset']

interface TabProps {
  text: string
  selected: boolean
  setSelected: (text: string) => void
}

const Tab = ({text, selected, setSelected}: TabProps) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? 'text-gray-800'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'
      } relative rounded-md px-3 py-1 text-base transition-colors`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{type: 'spring', duration: 0.4}}
          className="absolute inset-0 z-0 rounded-md bg-gray-200"
        ></motion.span>
      )}
    </button>
  )
}

const Tabs = ({selected, setSelected}: { selected: string, setSelected: (value: string) => void }) => {
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
  {i: 'a', x: 0, y: 0, w: 1, h: 1},
  {i: 'b', x: 1, y: 0, w: 1, h: 1},
  {i: 'c', x: 0, y: 1, w: 2, h: 1},
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

const chartData = [
  {month: "January", desktop: 186, mobile: 80},
  {month: "February", desktop: 305, mobile: 200},
  {month: "March", desktop: 237, mobile: 120},
  {month: "April", desktop: 73, mobile: 190},
  {month: "May", desktop: 209, mobile: 130},
  {month: "June", desktop: 214, mobile: 140},
]

const HeroDashboard = () => {
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{lg: layout}}
      cols={{lg: 2, md: 2, sm: 2, xs: 1, xxs: 1}}
      rowHeight={200}
      maxRows={2}
    >
      <DashboardCard key="a" cardTitle="Chart 1" chartConfig={chartConfig} className="[&_h3]:text-base">
        <BarChart accessibilityLayer data={chartData} margin={{
          left: -20,
        }}>
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
        </BarChart>
      </DashboardCard>
      <DashboardCard key="b" cardTitle="Chart 2" chartConfig={chartConfig} className="[&_h3]:text-base">
        <BarChart accessibilityLayer data={chartData} margin={{
          left: -20,
        }}>
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
        </BarChart>
      </DashboardCard>
      <DashboardCard key="c" cardTitle="Chart 3" chartConfig={chartConfig} className="[&_h3]:text-base">
        <BarChart accessibilityLayer data={chartData} margin={{
          left: -20,
        }}>
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
        </BarChart>
      </DashboardCard>
    </ResponsiveGridLayout>
  )
}

const HeroTabs = () => {
  const [selected, setSelected] = useState<string>('Dashboard')
  return (
    <div className="p-4 max-w-4xl mx-auto mt-12">
      <div className="bg-gray-50 h-svh p-2 rounded-2xl shadow-lg">
        <Tabs selected={selected} setSelected={(val) => setSelected(val)}/>
        {selected === 'Dashboard' && <HeroDashboard />}
      </div>
    </div>
  )
}

export default HeroTabs