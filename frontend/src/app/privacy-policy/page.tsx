"use client"

import LandingNavBar from "@/app/components/Landing/LandingNavBar";
import LandingFooter from "@/app/components/Landing/LandingFooter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doesSessionExist } from "@/lib/utils";

export default function PrivacyPolicy() {
  const router = useRouter();

  useEffect(() => {
    doesSessionExist().then((hasSession) => {
      if (hasSession) {
        router.replace("/dashboard");
      }
    })
  }, [router]);

  return (
    <>
      <LandingNavBar/>
      <article className="max-w-xl px-4 mx-auto">
        <h1 className="text-center font-bold text-4xl mt-12 md:text-5xl">Privacy Policy</h1>
        <p className="text-sm text-gray-700 mt-12 mb-8">Last updated 21 September 2024</p>
        <div className="prose text-gray-800">
          <div>
            <h2>About</h2>
            <p>
              At GoodBI, (&quot;GoodBI&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to
              protecting your privacy. This
              Privacy Policy outlines how we collect, use, share, and protect your information when you use our services
              (&quot;Services&quot;). This includes interactions such as:
            </p>
            <ul>
              <li>Visiting our website.</li>
              <li>Engage with us in other related ways, including any sales, marketing, or events.</li>
            </ul>
          </div>
          <div>
            <h2>Information we collect</h2>
            We may collect various types of information, including:
            <ul>
              <li>
                Information that identifies you, such as your name, email address, and contact details,
                which you provide voluntarily.
              </li>
              <li>
                Information about your device, browsing actions, and patterns, including your IP
                address, browser type, and access times.
              </li>
              <li>
                We may use cookies and similar technologies to enhance your
                experience on our Site. You can manage cookie preferences through your browser settings.
              </li>
            </ul>
          </div>
          <div>
            <h2>How we use your information</h2>
            <p>We may use your information for various purposes, including:</p>
            <ul>
              <li>To provide, maintain, and improve our Service.</li>
              <li>To personalize your experience.</li>
              <li>To communicate with you, including sending updates and marketing materials.</li>
              <li>To monitor usage and analyse trends.</li>
              <li>To ensure compliance with legal obligations.</li>
            </ul>
          </div>
          <div>
            <h2>Sharing your information</h2>
            <p>
              We do not sell your personal information. We may share your information in the following
              circumstances:
            </p>
            <ul>
              <li>
                With service providers who assist us in operating our Service and conducting our business, such as
                OpenAI to generate insights from your data.
              </li>
              <li>In response to legal obligations, such as a court order or subpoena.</li>
              <li>To protect the rights, property, or safety of GoodBI, our users, or others.</li>
            </ul>
          </div>
          <div>
            <h2>Data security</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, use, or
              disclosure. However, no method of transmission over the internet or method of electronic storage is
              completely secure, and we cannot guarantee its absolute security.
            </p>
          </div>
          <div>
            <h2>Your rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access and receive a copy of your personal data.</li>
              <li>The right to request corrections to inaccurate or incomplete data.</li>
              <li>The right to request deletion of your personal data.</li>
            </ul>
          </div>
          <div>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on our website. Your continued use of the Service after any modifications indicates your acceptance
              of the updated policy.
            </p>
          </div>
          <div>
            <h2>Contact</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us
              at: <a href="mailto:cs3216-staff@googlegroups.com">cs3216-staff@googlegroups.com</a>.
            </p>
          </div>
        </div>
      </article>
      <LandingFooter className="mt-12" />
    </>
  )
}