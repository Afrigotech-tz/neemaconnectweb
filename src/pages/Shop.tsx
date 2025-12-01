import { ShoppingCart, Star, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Shop = () => {
  const products = [
    {
      id: 1,
      name: "Songs of Victory - Album",
      category: "Music",
      price: "$15.99",
      originalPrice: "$19.99",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      rating: 5,
      reviews: 42,
      description: "Our latest album featuring 12 inspiring tracks of contemporary gospel music.",
      bestseller: true,
      sale: true
    },
    {
      id: 2,
      name: "Neema Choir T-Shirt",
      category: "Apparel",
      price: "$24.99",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      rating: 4.8,
      reviews: 28,
      description: "Comfortable cotton t-shirt with our beautiful choir logo.",
      colors: ["Orange", "White", "Black"]
    },
    {
      id: 3,
      name: "Live at City Cathedral - DVD",
      category: "Video",
      price: "$12.99",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      rating: 4.9,
      reviews: 35,
      description: "Experience our powerful live performance from last year's Christmas concert."
    },
    {
      id: 4,
      name: "Traditional Harmonies - CD",
      category: "Music",
      price: "$13.99",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      rating: 4.7,
      reviews: 19,
      description: "Classic gospel songs reimagined with beautiful harmonies and arrangements."
    },
    {
      id: 5,
      name: "Choir Hoodie",
      category: "Apparel",
      price: "$39.99",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      rating: 4.6,
      reviews: 22,
      description: "Warm and cozy hoodie perfect for cool weather and showing your choir pride."
    },
    {
      id: 6,
      name: "Songbook Collection",
      category: "Books",
      price: "$18.99",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png",
      rating: 4.8,
      reviews: 15,
      description: "Sheet music and lyrics for 25 of our most beloved songs."
    }
  ];

  const categories = ["All", "Music", "Apparel", "Video", "Books"];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Choir Shop</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Take home a piece of our ministry. Browse our collection of music, merchandise, and memorabilia.
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Categories:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-muted-foreground">
              {products.length} products
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-warm transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.bestseller && (
                      <Badge className="bg-gradient-primary">Bestseller</Badge>
                    )}
                    {product.sale && (
                      <Badge className="bg-red-500">Sale</Badge>
                    )}
                  </div>
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                  </button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.colors && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Colors:</span>
                      <div className="flex gap-1">
                        {product.colors.map((color) => (
                          <div 
                            key={color}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          {product.originalPrice}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3">
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground">
              Limited edition items celebrating our 15 years of ministry
            </p>
          </div>
          
          <div className="bg-gradient-hero rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Anniversary Collection</h3>
            <p className="text-lg mb-6 opacity-90">
              Commemorate our journey with exclusive merchandise and recordings from our anniversary celebration.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
            >
              View Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-12 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">On orders over $50</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Ministry Support</h3>
              <p className="text-muted-foreground text-sm">All proceeds support our mission</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;