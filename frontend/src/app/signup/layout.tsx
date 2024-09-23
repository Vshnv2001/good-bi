import { ReactNode } from "react";

export const metadata = {
  title: `Sign up | ${process.env.APP_NAME}`,
  description: `Create an account on ${process.env.APP_NAME}, the ultimate AI business intelligence platform.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
