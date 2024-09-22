import Image from "next/image";
import Marquee from "@/app/components/Landing/Marquee";

const logos = [
  {
    name: 'Tinder',
    url: '/logos/tinder.png'
  },
  {
    name: 'OkCupid',
    url: '/logos/okcupid.png'
  },
  {
    name: 'Hinge',
    url: '/logos/hinge.png'
  },
  {
    name: 'Coffee Meets Bagel',
    url: '/logos/cmb.png'
  },
  {
    name: 'Bumble',
    url: '/logos/bumble.png'
  },
  {
    name: 'cs3216',
    url: '/logos/cs3216.png'
  },
  {
    name: 'InternTwine',
    url: '/logos/interntwine.svg'
  },
  {
    name: 'National University of Singapore',
    url: '/logos/nus.png'
  }
]

const AnimatedLogoCloud = () => {
  return (
    <div
      className="relative flex py-16 w-full flex-col items-center justify-center overflow-hidden bg-background">
      <Marquee pauseOnHover className="[--duration:30s]">
        {logos.map((logo, key) => (
          <Image
            key={key}
            src={logo.url}
            className="h-10 w-auto px-2 brightness-0 dark:invert"
            width="100"
            height="100"
            alt={`${logo.name}`}
          />
        ))}
      </Marquee>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
    </div>

  )
}

export default AnimatedLogoCloud
