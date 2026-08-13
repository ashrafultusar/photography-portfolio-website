import React from "react";

const portfolioImages = [
  {
    id: 1,
    src: "/hero/1.jpg",
    alt: "Shondhikkhon Wedding Couple Walking in Outdoor Nature Setting",
  },
  {
    id: 2,
    src: "/hero/2.jpg",
    alt: "Happy Bride and Groom Smiling During Wedding Ceremony",
  },
  {
    id: 3,
    src: "/hero/3.jpg",
    alt: "Beautiful Wedding Photography and Details",
  },
  {
    id: 4,
    src: "/hero/4.jpg",
    alt: "Beautiful Wedding Photography and Details",
  },
  {
    id: 5,
    src: "/hero/4.jpg",
    alt: "Beautiful Wedding Photography and Details",
  }, {
    id: 6,
    src: "/hero/3.jpg",
    alt: "Beautiful Wedding Photography and Details",
  },
  {
    id: 7,
    src: "/hero/1.jpg",
    alt: "Shondhikkhon Wedding Couple Walking in Outdoor Nature Setting",
  },
  {
    id: 8,
    src: "/hero/2.jpg",
    alt: "Happy Bride and Groom Smiling During Wedding Ceremony",
  },
];

const Portfolio = () => {
  return (
    <section
      id="portfolio"
      className="w-full bg-neutral-900 py-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs tracking-[0.3em] uppercase text-red-600 font-sans">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white">
            Portfolio
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolioImages.map(({ id, src, alt }) => (
            <div
              key={id}
              className="relative aspect-square overflow-hidden group rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
