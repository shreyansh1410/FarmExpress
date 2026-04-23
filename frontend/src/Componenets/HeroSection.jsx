import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=2070",
    title: "Professional Trucking Solutions",
    subtitle: "Reliable Transportation Services Nationwide"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=2070",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <Truck className="mb-6 h-16 w-16 text-white" />
                <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="mb-8 text-lg md:text-xl text-slate-200">{slide.subtitle}</p>
                <button className="rounded-full px-8 py-3 font-semibold transition-colors bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prevSlide}
          className="rounded-full p-2 backdrop-blur-sm transition-colors bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="rounded-full p-2 backdrop-blur-sm transition-colors bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
