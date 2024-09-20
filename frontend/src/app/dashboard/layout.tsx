import { ReactNode } from "react";

export const metadata = {
  title: `Dashboard | ${process.env.APP_NAME}`,
  description: `GoodBI ${process.env.APP_NAME} dashboard.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
