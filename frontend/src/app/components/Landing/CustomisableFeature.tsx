'use client'

import {Responsive, WidthProvider} from "react-grid-layout";
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
  {i: 'a', x: 0, y: 0, w: 1, h: 2},
  {i: 'b', x: 1, y: 0, w: 1, h: 1},
  {i: 'c', x: 1, y: 1, w: 1, h: 1},
];

const CustomisableFeature = () => {
  return (
    <div className="relative bg-gray-100 rounded-lg pt-2">
      <span className="pl-2 z-10 text-sm text-gray-500">
        Dashboard
      </span>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
        rowHeight={50}
        width={500}
        maxRows={2}
      >
        <div key="a" className="rounded-lg flex items-center justify-center bg-white border border-gray-200/70">
          Insight A
        </div>
        <div key="b" className="rounded-lg flex items-center justify-center bg-white border border-gray-200/70">
          Insight B
        </div>
        <div key="c" className="rounded-lg flex items-center justify-center bg-white border border-gray-200/70">
          Insight C
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}

export default CustomisableFeature