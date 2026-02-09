import { Star, ShoppingCart, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Songs of Hope - Album",
      category: "Music",
      price: "$15.99",
      originalPrice: "$19.99",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png",
      rating: 5,
      reviews: 127,
      description: "Our latest collection of inspiring gospel songs that bring hope and healing to listeners. Features 12 powerful tracks including 'Amazing Grace Remix' and 'Joyful Noise'.",
      bestseller: true,
      onSale: true
    },
    {
      id: 2,
      name: "Faith & Harmony T-Shirt",
      category: "Apparel",
      price: "$24.99",
      originalPrice: null,
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      rating: 4.8,
      reviews: 89,
      description: "Premium quality cotton t-shirt with inspirational 'Faith & Harmony' design. Available in multiple colors and sizes. Perfect for concerts and everyday wear.",
      bestseller: false,
      onSale: false
    },
    {
      id: 3,
      name: "Neema Choir Hymnal",
      category: "Books",
      price: "$29.99",
      originalPrice: "$34.99",
      image: "/lovable-uploads/AIC-MAIN.png",
      rating: 4.9,
      reviews: 156,
      description: "Complete collection of traditional and contemporary hymns arranged by the Neema Gospel Choir. Includes sheet music, chord progressions, and spiritual reflections.",
      bestseller: true,
      onSale: true
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-4xl font-bold text-foreground">Featured Products</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our most popular inspirational products that help spread the message of faith and hope.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 group">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.bestseller && (
                    <Badge className="bg-gradient-warm text-white">
                      Bestseller
                    </Badge>
                  )}
                  {product.onSale && (
                    <Badge className="bg-red-500 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>

              <CardHeader>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  {renderStars(product.rating)}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{product.reviews} reviews</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{product.rating}/5</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-muted">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-warm hover:shadow-warm transition-all duration-300"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

