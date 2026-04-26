import React from "react";
import { Quote, Star, TrendingUp, Truck, Users } from "lucide-react";

const stats = [
  { label: "Active Transporters", value: "1,200+", icon: Users },
  { label: "Routes Optimized", value: "45,000+", icon: TrendingUp },
  { label: "Fleet Vehicles", value: "8,500+", icon: Truck },
];

const testimonials = [
  {
    name: "Aarav Logistics",
    role: "Fleet Owner, Delhi NCR",
    review:
      "CargoMatch helped us reduce route overlap and improved on-time delivery in the first week itself.",
    rating: 5,
  },
  {
    name: "NorthWay Carriers",
    role: "Operations Lead, Chandigarh",
    review:
      "The truck-wise route visibility is excellent. Our dispatch planning is cleaner and much faster now.",
    rating: 5,
  },
  {
    name: "Shakti Movers",
    role: "Regional Transport Partner",
    review:
      "Simple UI, practical validation, and merge suggestions actually save fuel and manual effort.",
    rating: 4,
  },
];

const marqueeTestimonials = [...testimonials, ...testimonials];

const SocialProof = () => {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="reveal-on-scroll mb-8 text-center">
          <h2 className="text-3xl font-bold text-base-content sm:text-4xl">
            Trusted By Growing Fleets
          </h2>
          <p className="mt-2 text-base text-base-content/70">
            Reliable route planning with measurable logistics outcomes.
          </p>
        </div>

        <div className="mb-14 grid gap-4 md:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="apple-glass apple-glass-hover reveal-on-scroll reveal-up rounded-2xl border border-base-300/70 bg-base-200/60 p-5"
                style={{ "--reveal-delay": `${index * 80}ms` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-base-content/80">{item.label}</p>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-base-content">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div
          className="reveal-on-scroll reviews-marquee pt-2 min-h-[230px]"
          style={{ "--marquee-duration": "28s" }}
        >
          <div className="reviews-marquee-track">
            {[0, 1].map((groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className="reviews-marquee-group"
                aria-hidden={groupIndex === 1}
              >
                {marqueeTestimonials.map((item, index) => (
                  <article
                    key={`${groupIndex}-${item.name}-${index}`}
                    className="apple-glass w-[320px] rounded-2xl border border-base-300/70 bg-base-200/60 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Quote className="h-5 w-5 text-primary" />
                      <div className="flex items-center gap-1 text-warning">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={`${groupIndex}-${item.name}-${i}`} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-base-content/85">"{item.review}"</p>
                    <div className="mt-4 border-t border-base-300/60 pt-3">
                      <p className="text-sm font-semibold text-base-content">{item.name}</p>
                      <p className="text-xs text-base-content/70">{item.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
