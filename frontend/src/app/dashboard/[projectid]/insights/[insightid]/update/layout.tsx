import { ReactNode } from "react";

export const metadata = {
  title: `Edit insight | ${process.env.APP_NAME}`,
  description: `Edit insight on ${process.env.APP_NAME}.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
