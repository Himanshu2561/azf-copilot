'use client';

import { useState, useRef, useEffect, ReactNode, TouchEvent, MouseEvent } from 'react';

interface CarouselProps {
  children: ReactNode[];
  className?: string;
}

export default function Carousel({ children, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exactPage, setExactPage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartTimeRef = useRef<number>(0);

  const totalSlides = children.length;
  const totalPages = Math.ceil(totalSlides / cardsPerView);

  // Update cards per view based on window size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      setCardsPerView(width >= 640 ? 2 : 1);
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Update current index and scroll progress based on scroll position
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollPosition = containerRef.current.scrollLeft;
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = containerWidth / cardsPerView;
      const exactIndex = scrollPosition / cardWidth;
      const newIndex = Math.round(exactIndex);
      
      setCurrentIndex(Math.min(newIndex, Math.max(0, totalSlides - cardsPerView)));
      
      // Calculate exact page and progress for smooth pagination animation
      // exactPage is the current page (can be fractional during transition)
      const exactPageValue = exactIndex / cardsPerView;
      setExactPage(exactPageValue);
      
      // Progress is the fractional part (0 to 1) within the current page
      const progressInPage = exactPageValue - Math.floor(exactPageValue);
      setScrollProgress(Math.max(0, Math.min(1, progressInPage)));
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [totalSlides, cardsPerView]);

  const goToSlide = (index: number) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.offsetWidth / cardsPerView;
    const targetScroll = index * cardWidth;
    containerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
    setCurrentIndex(Math.min(index, Math.max(0, totalSlides - cardsPerView)));
  };

  const goToNext = () => {
    const nextIndex = Math.min(currentIndex + cardsPerView, Math.max(0, totalSlides - cardsPerView));
    goToSlide(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = Math.max(currentIndex - cardsPerView, 0);
    goToSlide(prevIndex);
  };

  const handleStart = (clientX: number) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(clientX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    dragStartTimeRef.current = Date.now();
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const x = clientX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    const newScrollLeft = scrollLeft - walk;
    
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    
    containerRef.current.scrollLeft = newScrollLeft;
  };

  const handleEnd = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    
    // Only snap if user actually dragged
    if (hasMoved) {
      const cardWidth = containerRef.current.offsetWidth / cardsPerView;
      const newIndex = Math.round(containerRef.current.scrollLeft / cardWidth);
      goToSlide(Math.max(0, Math.min(newIndex, totalSlides - cardsPerView)));
    }
    
    setHasMoved(false);
  };

  const handleTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].pageX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.touches[0].pageX);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleStart(e.pageX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.pageX);
    }
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };


  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalSlides - cardsPerView;
  const currentPage = Math.floor(exactPage);

  if (totalSlides === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container Wrapper - Clips overflow */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="shrink-0 snap-start flex items-stretch"
              style={{
                width: `${100 / cardsPerView}%`,
              }}
            >
              <div className="w-full flex flex-col">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {totalSlides > cardsPerView && (
        <>
          {/* Previous Button */}
          {canGoPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-1 sm:left-2 top-[45%] -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFFFFE5] backdrop-blur-sm shadow-lg flex items-center justify-center transition-all touch-manipulation"
              aria-label="Previous"
              style={{
                opacity: 0.9,
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#111827' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {canGoNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-1 sm:right-2 top-[45%] -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFFFFE5] backdrop-blur-sm shadow-lg flex items-center justify-center transition-all touch-manipulation"
              aria-label="Next"
              style={{
                opacity: 0.9,
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#111827' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageDistance = exactPage - index;
            const isActive = Math.abs(pageDistance) < 0.5;
            const isTransitioning = Math.abs(pageDistance) < 1;
            
            // Calculate width with liquid animation
            let dotWidth = 8;
            let bgColor = '#D1D5DB';
            let opacity = 0.3;
            
            if (isActive) {
              // Active dot: expands as we move away from center, shrinks as we approach next
              // When at exact page (pageDistance = 0), dot is full size (24px)
              // When at 0.5 (halfway to next), dot is small (8px)
              const distanceFromCenter = Math.abs(pageDistance);
              dotWidth = 24 - (distanceFromCenter * 32);
              bgColor = '#AE0775';
              opacity = 1 - (distanceFromCenter * 0.4); // Fade slightly as we transition
            } else if (isTransitioning) {
              // Transitioning dot: expands as we approach it
              if (pageDistance > 0) {
                // Next dot: expands as we approach (pageDistance goes from 1 to 0.5)
                const approachProgress = 1 - pageDistance;
                dotWidth = 8 + (approachProgress * 16);
                bgColor = approachProgress > 0.5 ? '#AE0775' : '#D1D5DB';
                opacity = 0.3 + (approachProgress * 0.7);
              } else {
                // Previous dot: shrinks as we leave (pageDistance goes from -0.5 to -1)
                const leaveProgress = Math.abs(pageDistance) - 0.5;
                dotWidth = 24 - (leaveProgress * 16);
                bgColor = leaveProgress < 0.5 ? '#AE0775' : '#D1D5DB';
                opacity = 1 - (leaveProgress * 0.7);
              }
            }
            
            // Clamp values to valid ranges
            dotWidth = Math.max(8, Math.min(24, dotWidth));
            opacity = Math.max(0.3, Math.min(1, opacity));
            
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index * cardsPerView);
                }}
                className="relative touch-manipulation p-1"
                aria-label={`Go to page ${index + 1}`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${dotWidth}px`,
                    height: '8px',
                    backgroundColor: bgColor,
                    opacity: opacity,
                    transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

