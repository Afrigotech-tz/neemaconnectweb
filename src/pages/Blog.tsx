import { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlog } from "@/hooks/useBlog";

const Blog = () => {
  const { blogs, getPublishedBlogs, loading } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  useEffect(() => {
    getPublishedBlogs();
  }, [getPublishedBlogs]);

  // Extract unique categories from blogs
  const categories = ["All Posts", ...Array.from(new Set(blogs.map(blog => blog.category)))];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Stories, insights, and inspiration from our choir family. Discover the heart behind our music and ministry.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {blogs.filter(blog => blog.is_featured && blog.status === 'published' && (selectedCategory === 'All Posts' || blog.category === selectedCategory)).slice(0, 1).map((post) => (
                <Card key={post.id} className="mb-12 overflow-hidden hover:shadow-warm transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={post.image_url || "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"}
                        alt={post.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-gradient-primary">Featured</Badge>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.published_at || post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.filter(blog => !blog.is_featured && blog.status === 'published' && (selectedCategory === 'All Posts' || blog.category === selectedCategory)).map((post) => (
                  <Card key={post.id} className="group hover:shadow-warm transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image_url || "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center pt-3">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-hero rounded-2xl p-8 text-white">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our newsletter for the latest updates, stories, and inspirational content from Neema Gospel Choir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground"
              />
              <Button 
                size="lg" 
                className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;