const SecuritySection = () => {
  return (
    <div className="bg-white rounded-2xl py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="max-w-lg">
          <span className="text-primary-500" id="security">Security</span>
          <h2 className="text-4xl mt-2 tracking-tight sm:text-5xl">
            <span className="font-bold">You can count on us.</span> Reliable and secure by design.
          </h2>
        </div>
        <div
          className="mt-12 text-gray-600 flex flex-wrap justify-center lg:justify-between gap-x-8 gap-y-8 font-bold leading-5">
          <div className="w-36">
            Built with
            <div
              className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
            >
              SOC 2
            </div>
            compliance in mind.
          </div>
          <div className="w-36">
            World-class
            <div
              className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
            >
              99.9%
            </div>
            operational uptime.
          </div>
          <div className="w-36">
            Industry standard
            <div
              className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
            >
              AES-256
            </div>
            data encryption standards.
          </div>
          <div className="w-36">
            Deployed on
            <div
              className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
            >
              100+
            </div>
            edge locations globally.
          </div>
          <div className="w-36">
            Up to
            <div
              className="text-3xl bg-gradient-to-r from-primary-700 to-secondary-700 w-fit text-transparent bg-clip-text"
            >
              24/7
            </div>
            customer service support.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySection