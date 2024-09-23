import { ReactNode } from "react";

export const metadata = {
  title: `Login | ${process.env.APP_NAME}`,
  description: `Login to ${process.env.APP_NAME}, the ultimate AI business intelligence platform.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
