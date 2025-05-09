import React, { useState, useEffect } from 'react'

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/chart11.jpg",
    "/chart2.jpg",
    "/chart10.jpg",
    "/chart3.jpg",
    "/chart9.jpg",
    "/chart5.jpg",

  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    // Set up auto-rotation every 3 seconds
    const autoPlayInterval = setInterval(nextSlide, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(autoPlayInterval);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div id="default-carousel" className="relative w-[50%] bg-[#070707]" data-carousel="slide">
      {/* Carousel wrapper */}
      <div className="relative h-screen overflow-hidden rounded-lg md:h-screen">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            data-carousel-item
          >
            <img 
              src={slide} 
              className="absolute block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {slides.map((_, index) => (
          <button 
            key={index}
            type="button" 
            className={`w-3 h-3 rounded-full ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
            aria-current={index === currentSlide}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
{/*       
      <button 
        type="button" 
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" 
        onClick={prevSlide}
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button 
        type="button" 
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" 
        onClick={nextSlide}
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button> */}
    </div>
  )
}

export default Carousel