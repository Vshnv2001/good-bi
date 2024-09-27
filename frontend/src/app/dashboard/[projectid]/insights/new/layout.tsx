import { ReactNode } from "react";

export const metadata = {
  title: `New insight | ${process.env.APP_NAME}`,
  description: `Create new insight on ${process.env.APP_NAME}.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
