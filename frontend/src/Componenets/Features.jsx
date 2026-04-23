import React from 'react'
import { featureData } from '../utils/features';

const FeatureCard = ({ image, title, description }) => {
  return (
    <div className="card glass-card apple-glass apple-glass-hover w-full max-w-xs transition-all duration-300">
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex justify-center mt-2 text-base-content">
        Our Features
      </h1>
      <div className="w-24 h-1 bg-primary mx-auto mb-10 rounded-full"></div>
      <div className="flex flex-wrap justify-center gap-6">

        {featureData.map((feature, index) => (
          <FeatureCard 
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};


export default Features