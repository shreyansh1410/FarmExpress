import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImageOne from '../public/images/one.jpg';
import heroImageTwo from '../public/images/two.jpg';

const slides = [
  {
    id: 1,
    image: heroImageOne,
    title: "Professional Trucking Solutions",
    subtitle: "Reliable Transportation Services Nationwide"
  },
  {
    id: 2,
    image: heroImageTwo,
    title: "Modern Fleet Management",
    subtitle: "Advanced Technology for Efficient Delivery"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Sustainable Logistics",
    subtitle: "Eco-friendly Transportation Solutions"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[620px] md:h-[700px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ${
                index === currentSlide ? 'scale-105' : 'scale-110'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/45 to-slate-950/70" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl rounded-2xl border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
                <div className="mb-4">
                  <Truck className="h-14 w-14 text-white" />
                </div>
                <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="mb-8 text-lg md:text-xl text-slate-200">{slide.subtitle}</p>
                <button
                  type="button"
                  onClick={() => navigate('/truck')}
                  className="rounded-full px-8 py-3 font-semibold transition-colors bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                >
                  Start Scheduling
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-5 left-0 right-0 z-30">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-9 bg-white'
                  : 'w-2.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
