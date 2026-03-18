import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Heart, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSlider } from "@/hooks/useSlider";
import { getImageUrl } from "@/lib/utils";
import RotatingText from "@/components/ui/rotating-text";
import SplitText from "@/components/ui/SplitText";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { sliders, getActiveSliders, loading } = useSlider();

  useEffect(() => {
    getActiveSliders();
  }, [getActiveSliders]);

  // Fallback slides in case API doesn't return data
  const defaultSlides = [
    {
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      title: "Worship in Unity",
      head: "Join our vibrant choir family",
      description: "Experience the power of collective worship as we lift our voices together in praise and celebration.",
    },
    {
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      title: "Inspiring Performances",
      head: "Feel the spirit move",
      description: "Witness breathtaking performances that touch hearts and transform lives through the power of gospel music.",
    },
    {
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      title: "Community & Faith",
      head: "Building connections through music",
      description: "Be part of a community that celebrates faith, fellowship, and the joy of making music together.",
    }
  ];

  const slides = sliders.length > 0 ? sliders : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide 
              ? "opacity-100 scale-105" 
              : isAnimating 
                ? "opacity-0 scale-100" 
                : "opacity-0 scale-100"
          }`}
        >
          {/* Background Image */}
          <img
            src={getImageUrl(slide.image)}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          
          {/* Decorative gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl text-white">
                {/* Animated subtitle badge */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6 animate-fade-in animation-delay-100`}>
                  <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  <span className="text-primary font-medium">{slide.head}</span>
                </div>
                
                {/* Animated title */}
                <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up animation-delay-200`}>
                  <span className="block">{slide.title}</span>
                  <RotatingText
                    texts={["Praise", "Worship", "Faith", "Hope"]}
                    mainClassName="mt-4 inline-flex px-3 sm:px-3 md:px-4 bg-primary text-primary-content overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg shadow-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    auto={index === currentSlide}
                  />
                </h1>
                
                {/* Animated description */}
                <SplitText
                  key={`hero-desc-${index}-${currentSlide}`}
                  text={slide.description}
                  className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-2xl animate-slide-up animation-delay-300"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  onLetterAnimationComplete={() => {
                    // eslint-disable-next-line no-console
                    console.log("All letters have animated!");
                  }}
                  showCallback
                />
                
                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white hover:text-primary transition-all duration-300 text-lg px-8 bg-white/5 backdrop-blur-sm hover-lift"
                    onClick={() => window.open('https://www.youtube.com/@NeemaGospelChoir', '_blank')}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Performances
                  </Button>
                  <Link to="/partner">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/60 text-white hover:bg-primary hover:text-white transition-all duration-300 text-lg px-8 bg-primary/10 backdrop-blur-sm hover-lift"
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      Become a Partner
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary/80 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-primary/80 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide 
                ? "w-10" 
                : "w-3 hover:w-5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`absolute inset-0 rounded-full ${
              index === currentSlide 
                ? "bg-primary" 
                : "bg-white/40 hover:bg-white/70"
            }`} />
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-primary animate-pulse-glow" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-x-32 hidden lg:flex flex-col items-center text-white/70 scroll-indicator">
        <MousePointer2 className="h-5 w-5 mb-2" />
        <span className="text-xs uppercase tracking-wider">Scroll</span>
      </div>
    </div>
  );
};

export default HeroSlider;
