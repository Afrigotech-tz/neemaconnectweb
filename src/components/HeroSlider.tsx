import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      title: "Worship in Unity",
      subtitle: "Join our vibrant choir family",
      description: "Experience the power of collective worship as we lift our voices together in praise and celebration."
    },
    {
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      title: "Inspiring Performances",
      subtitle: "Feel the spirit move",
      description: "Witness breathtaking performances that touch hearts and transform lives through the power of gospel music."
    },
    {
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      title: "Community & Faith",
      subtitle: "Building connections through music",
      description: "Be part of a community that celebrates faith, fellowship, and the joy of making music together."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <p className="text-lg font-medium text-primary mb-4 animate-fade-in">
                  {slide.subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed animate-fade-in">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                  <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    <Play className="mr-2 h-4 w-4" />
                    Join Our Choir
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-black hover:bg-white hover:text-foreground transition-all duration-300"
                    onClick={() => window.open('https://www.youtube.com/@NeemaGospelChoir', '_blank')}
                  >
                    Watch Performances
                  </Button>
                  <Link to="/partner">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Heart className="mr-2 h-4 w-4" />
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? "bg-primary scale-110" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;