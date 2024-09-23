import { ReactNode } from "react";

export const metadata = {
  title: `Terms of Service | ${process.env.APP_NAME}`,
  description: `${process.env.APP_NAME} terms of service.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
