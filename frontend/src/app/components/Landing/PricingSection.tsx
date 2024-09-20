import {cn} from '@/lib/utils'
import {AnimatePresence, motion} from 'framer-motion'
import {
  LucideBrainCog,
  LucideCheck,
  LucideDatabase,
  LucideFile,
  LucideMail, LucideServer,
  LucideSparkles,
} from 'lucide-react'
import {useState} from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";

const pricingPlans = [
  {
    name: 'Basic',
    description: 'For small businesses and start-ups starting out.',
    monthlyPrice: 0,
    annualPrice: 0,
    link: '/signup',
    linkText: 'Join for free',
    features: [
      {text: '3 AI-powered KPIs', icon: LucideSparkles},
      {text: 'Integration with CSV and Excel files', icon: LucideFile},
      {text: '500MB data processing', icon: LucideDatabase},
      {text: 'Standard email support', icon: LucideMail}
    ],
  },
  {
    name: 'Pro',
    description: 'For small and medium size businesses.',
    monthlyPrice: 10,
    annualPrice: 10,
    link: '/signup',
    linkText: 'Coming soon',
    features: [
      {text: 'Everything in Basic', icon: LucideCheck},
      {text: '10 AI-powered KPIs', icon: LucideSparkles},
      {text: 'Integration with CRM tools files', icon: LucideFile},
      {text: '5GB data processing', icon: LucideDatabase},
      {text: 'Standard email and chat support', icon: LucideMail}
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large companies with many data sources.',
    monthlyPrice: 49,
    annualPrice: 49,
    link: '/signup',
    linkText: 'Coming soon',
    features: [
      {text: 'Everything in Pro', icon: LucideCheck},
      {text: 'Unlimited AI-powered KPIs', icon: LucideSparkles},
      {text: '50GB data processing', icon: LucideDatabase},
      {text: '24/7 priority support, onboarding and training', icon: LucideMail}
    ],
  },
  {
    name: 'Custom',
    description:
      'For companies requiring tailored usage needs.',
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    link: 'mailto:cs3216-staff@googlegroups.com',
    linkText: 'Enquire',
    features: [
      {text: 'Everything in Enterprise', icon: LucideCheck},
      {text: 'Unlimited data processing', icon: LucideDatabase},
      {text: 'Custom machine learning models', icon: LucideBrainCog},
      {text: 'On-premises and hybrid cloud support', icon: LucideServer},
    ],
  },
]

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'M' | 'A'>('M')

  const Heading = () => (
    <div className="relative z-10 my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <span className="text-primary-500 pt-28 -mt-28" id="pricing">Pricing</span>
        <h2 className="font-bold text-4xl mt-2 tracking-tight sm:text-5xl">
          Choose the right plan.
        </h2>
        <p className="text-md max-w-lg text-gray-700 md:text-center">
          Get started with GoodBI and take your business intelligence to the next level.
        </p>
      </div>
      {/*
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingCycle('M')}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === 'M'
              ? 'relative bg-red-500 text-white '
              : 'text-gray-700 hover:bg-red-100 dark:text-gray-300 dark:hover:text-black',
          )}
        >
          Monthly
          {billingCycle === 'M' && <BackgroundShift shiftKey="monthly" />}
        </button>
        <button
          onClick={() => setBillingCycle('A')}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === 'A'
              ? 'relative bg-red-500 text-white '
              : 'text-gray-700 hover:bg-red-100 dark:text-gray-300 dark:hover:text-black',
          )}
        >
          Annual
          {billingCycle === 'A' && <BackgroundShift shiftKey="annual" />}
        </button>
      </div>
      */}
    </div>
  )

  const PricingCards = () => (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className="w-full rounded-xl border border-gray-200/70 p-6 text-left dark:border-gray-600"
        >
          <p className="mb-1 mt-0 text-sm font-medium uppercase text-primary-600">
            {plan.name}
          </p>
          <p className="my-0 mb-6 text-sm text-gray-600">{plan.description}</p>
          <div className="mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={billingCycle === 'M' ? 'monthly' : 'annual'}
                initial={{y: -50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{type: 'spring', stiffness: 100}}
                className="my-0 text-3xl font-bold"
              >
                {plan.monthlyPrice === 'Custom'
                  ? (
                    <>Contact us</>
                  ) : (
                    <>
                      <span>
                        ${billingCycle === 'M' ? plan.monthlyPrice : plan.annualPrice}
                      </span>
                      <span className="text-sm font-normal">
                        {' '}/ user / {billingCycle === 'M' ? 'month' : 'year'}
                      </span>
                    </>
                  )}
              </motion.p>
            </AnimatePresence>
            <Button
              className={cn(
                "mt-8 text-sm w-full text-white rounded-xl px-4 py-2.5 shadow-none",
                plan.linkText === "Coming soon" ? "bg-gray-500 opacity-50" : "bg-primary-700 hover:bg-primary-600"
              )}
              disabled={plan.linkText === "Coming soon"}
              asChild={plan.linkText !== "Coming soon"}
            >
              {plan.linkText === "Coming soon"
                ? <>{plan.linkText}</>
                : <Link href={plan.link}>
                  {plan.linkText ? plan.linkText : 'Get started'}
                </Link>
              }

            </Button>
          </div>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              {feature.icon
                ? <feature.icon className="shrink-0 h-4.5 w-4.5 text-gray-700"/>
                : <LucideCheck className="shrink-0 text-gray-700 h-4.5 w-4.5"/>
              }
              <span className="text-sm text-gray-600">{feature.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <section className="relative w-full overflow-hidden text-black lg:px-2">
      <Heading/>
      <PricingCards/>
    </section>
  )
}

const BackgroundShift = ({shiftKey}: { shiftKey: string }) => (
  <motion.span
    key={shiftKey}
    layoutId="bg-shift"
    className="absolute inset-0 -z-10 rounded-lg bg-primary-600"
    initial={{opacity: 0, scale: 0.8}}
    animate={{opacity: 1, scale: 1}}
    exit={{opacity: 0, scale: 0.8}}
    transition={{type: 'spring', stiffness: 200, damping: 20}}
  />
)

export default function PricingSection() {
  return <Pricing/>
}