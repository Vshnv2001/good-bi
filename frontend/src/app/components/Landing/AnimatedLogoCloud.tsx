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
    <Marquee pauseOnHover className="py-16 [--duration:30s]" style={{
      maskImage:
        'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 100%)',
    }}>
      <div
        className="flex shrink-0 flex-row justify-around gap-6"
      >
        {logos.map((logo, key) => (
          <Image
            key={key}
            src={logo.url}
            className="h-10 w-auto px-2 brightness-0 dark:invert"
            width="112"
            height="40"
            alt={`${logo.name}`}
          />
        ))}
      </div>
    </Marquee>
  )
}

export default AnimatedLogoCloud