import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import { Carousel, CarouselContent, CarouselItem } from './Carousel';

const ReviewsSection = () => {
  const [api, setApi] = useState(null);

  const testimonials = [
    {
      quote: "Edify Engine transformed how I create. I went from concept to a fully deployed VR gallery in less than a week. The built-in monetization tools made selling effortless.",
      author: "Sarah Chen",
      role: "Digital Artist & Creator"
    },
    {
      quote: "As someone with zero coding experience, I was skeptical. But the visual scripting tools are incredibly intuitive. I built a multiplayer game world that my community loves.",
      author: "Marcus Johnson",
      role: "Community Builder"
    },
    {
      quote: "The asset library is a game-changer. Instead of spending weeks modeling, I focused on experience design. My virtual event space was ready in days, not months.",
      author: "Priya Patel",
      role: "Event Producer"
    },
    {
      quote: "I've tried other 3D builders, but Edify's performance is unmatched. Real-time multiplayer with in-world commerce works flawlessly. My users are blown away.",
      author: "Alex Rivera",
      role: "Experience Designer"
    },
    {
      quote: "The cross-platform deployment is seamless. I build once and my world runs perfectly on desktop, mobile, and Quest 2. This saves me countless hours.",
      author: "Emily Zhang",
      role: "XR Designer"
    },
    {
      quote: "Edify Engine democratizes 3D creation. My students with no technical background are building virtual museums and interactive learning spaces. It's incredible.",
      author: "Dr. James Mitchell",
      role: "Educator"
    }
  ];

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <section className="py-24 px-4 relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            What Creators Are Saying
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real feedback from builders creating immersive experiences
          </p>
        </motion.div>

        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewsSection;
