import { ReactNode } from "react";

export const metadata = {
  title: `Edit project | ${process.env.APP_NAME}`,
  description: `Edit project on ${process.env.APP_NAME}.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
