import { ReactNode } from "react";

export const metadata = {
  title: `Privacy Policy | ${process.env.APP_NAME}`,
  description: `${process.env.APP_NAME} privacy policy.`
}
export default function ClientLayout({ children }: { children: ReactNode }) {
  return children
}
