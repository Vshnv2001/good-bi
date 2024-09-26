import { ReactNode } from "react";

export const metadata = {
  title: `New project | ${process.env.APP_NAME}`,
  description: `Create new project on ${process.env.APP_NAME}.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
