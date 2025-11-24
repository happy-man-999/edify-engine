import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

function Carousel({ className, opts, setApi, plugins, orientation = 'horizontal', children, ...props }) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div className={`relative ${className || ''}`} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, children, ...props }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={`flex ${orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col'} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function CarouselItem({ className, children, ...props }) {
  const { orientation } = useCarousel();

  return (
    <div
      className={`min-w-0 shrink-0 grow-0 basis-full ${orientation === 'horizontal' ? 'pl-4' : 'pt-4'} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CarouselPrevious({ className, ...props }) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      className={`absolute size-8 rounded-full border text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed top-1/2 -left-12 -translate-y-1/2 flex items-center justify-center transition-colors ${className || ''}`}
      style={{
        borderColor: 'oklch(0.25 0.05 285 / 0.5)',
        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)'
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
          e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.color = 'rgb(209, 213, 219)';
          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
        }
      }}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

function CarouselNext({ className, ...props }) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      className={`absolute size-8 rounded-full border text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed top-1/2 -right-12 -translate-y-1/2 flex items-center justify-center transition-colors ${className || ''}`}
      style={{
        borderColor: 'oklch(0.25 0.05 285 / 0.5)',
        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)'
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
          e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.color = 'rgb(209, 213, 219)';
          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
        }
      }}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="w-4 h-4" />
      <span className="sr-only">Next slide</span>
    </button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

