'use client'

import { Responsive, WidthProvider } from "react-grid-layout";
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
    <div className="relative bg-gray-50 rounded-lg pt-2">
      <div className="z-10 text-sm mx-auto max-w-fit text-gray-800 rounded-md px-3 py-1 bg-gray-200">
        Dashboard
      </div>
      <ResponsiveGridLayout
        className="layout [&_.react-grid-placeholder]:rounded-lg"
        layouts={{lg: layout}}
        cols={{lg: 2, md: 2, sm: 2, xs: 2, xxs: 2}}
        rowHeight={50}
        width={500}
        maxRows={2}
      >
        {["a", "b", "c"].map((letter) => {
          return (
            <div key={letter}
                 className="rounded-lg bg-white flex items-center justify-center border border-gray-200/70">
              Insight {letter.toUpperCase()}
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}

export default CustomisableFeature