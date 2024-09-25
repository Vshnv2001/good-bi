import { ReactNode } from "react";

export const metadata = {
  title: `Datasets | ${process.env.APP_NAME}`,
  description: `GoodBI ${process.env.APP_NAME} projects.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
