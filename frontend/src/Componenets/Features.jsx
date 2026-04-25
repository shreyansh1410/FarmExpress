import React from "react";
import { featureData } from "../utils/features";

const FeatureCard = ({ image, title, description }) => {
  return (
    <div className="card glass-card apple-glass apple-glass-hover w-[320px] transition-all duration-300">
      <figure className="px-8 pt-8">
        <img
          src={image}
          alt={title}
          className="rounded-full w-[110px] h-[110px] ring-4 ring-primary/20 shadow-md"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-base-content">{title}</h2>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="feature" className="px-4 py-14 sm:px-6">
      <h1 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-2 flex justify-center mt-2 text-base-content">
        Our Features
      </h1>
      <div className="reveal-on-scroll w-24 h-1 bg-primary mx-auto mb-10 rounded-full"></div>
      <div
        className="reveal-on-scroll reviews-marquee"
        style={{ "--marquee-duration": "22s" }}
      >
        <div className="reviews-marquee-track">
          {[0, 1].map((groupIndex) => (
            <div
              key={`feature-group-${groupIndex}`}
              className="reviews-marquee-group"
              aria-hidden={groupIndex === 1}
            >
              {featureData.map((feature, index) => (
                <FeatureCard
                  key={`${groupIndex}-${feature.title}-${index}`}
                  image={feature.image}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
