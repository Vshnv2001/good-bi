"use client"

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const PrivacyModal = ({children}: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription className="prose text-gray-800 max-h-[600px] overflow-scroll">
            <div>
              <p>
                Welcome to GoodBI (&quot;GoodBI&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By
                accessing
                or using
                GoodBI, you agree to comply with and be bound by these Terms of Service. If you do not agree to these
                terms, please do not use GoodBI.
              </p>
            </div>
            <div>
              <h2>Acceptance of terms</h2>
              <p>
                By using GoodBI, you confirm that you are at least [insert age, e.g., 13 or 18] years old and have the
                legal capacity to enter into these Terms. If you are using GoodBI on behalf of an organization, you
                represent that you have the authority to bind that organization to these Terms.
              </p>
            </div>
            <div>
              <h2>Changes to terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                posting
                on this page. Your continued use of GoodBI after changes are made constitutes your acceptance of the
                new
                Terms.
              </p>
            </div>
            <div>
              <h2>Use of GoodBI</h2>
              <p>
                You agree to use GoodBI only for lawful purposes and in accordance with these Terms. You must not:
              </p>
              <ul>
                <li>
                  Use GoodBI in any way that violates applicable laws or regulations.
                </li>
                <li>Engage in any conduct that restricts or inhibits anyone&apos;s use of GoodBI.</li>
                <li>Transmit any advertisements or promotional materials without our prior written consent.
                </li>
              </ul>
            </div>
            <div>
              <h2>Intellectual Property</h2>
              <p>
                All content, including text, graphics, logos, and software, is the property of GoodBI or our licensors
                and
                is protected by copyright, trademark, and other intellectual
                property laws. You may not reproduce, distribute, or create derivative works without our express
                permission.
              </p>
            </div>
            <div>
              <h2>Disclaimers</h2>
              <p>
                GoodBI is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties
                or
                representations
                about the accuracy or reliability of the content on GoodBI. To the fullest extent permitted by law, we
                disclaim all warranties, whether express or implied.
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
                In no event shall GoodBI, its affiliates, or its employees be liable for any
                indirect, incidental, special, or consequential damages arising out of or in connection with your use
                of
                the product.
              </p>
            </div>
            <div>
              <h2>Contact</h2>
              <p>
                If you have any questions or concerns about this Terms of Service, please contact us
                at: <a href="mailto:cs3216-staff@googlegroups.com">cs3216-staff@googlegroups.com</a>.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PrivacyModal
