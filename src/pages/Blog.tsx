import { Calendar, User, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Worship Music in Healing",
      excerpt: "Discover how gospel music has the unique ability to heal hearts, restore faith, and bring communities together in times of need.",
      author: "Pastor Sarah Johnson",
      date: "December 15, 2024",
      category: "Inspiration",
      readTime: "5 min read",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      featured: true
    },
    {
      id: 2,
      title: "Behind the Scenes: Preparing for Christmas Concert",
      excerpt: "Take a look at the months of preparation, practice, and passion that go into creating our annual Christmas celebration.",
      author: "Music Director Mike Chen",
      date: "December 10, 2024",
      category: "Behind the Scenes",
      readTime: "3 min read",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png"
    },
    {
      id: 3,
      title: "How to Join Our Choir: A Beginner's Guide",
      excerpt: "Everything you need to know about becoming a member of Neema Gospel Choir, from auditions to weekly commitments.",
      author: "Choir Coordinator Lisa White",
      date: "December 5, 2024",
      category: "How-To",
      readTime: "4 min read",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png"
    },
    {
      id: 4,
      title: "The History of Gospel Music in Our Community",
      excerpt: "Exploring the rich tradition of gospel music in our city and how it has shaped our cultural and spiritual landscape.",
      author: "Dr. Robert King",
      date: "November 28, 2024",
      category: "History",
      readTime: "7 min read",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"
    },
    {
      id: 5,
      title: "Vocal Tips for Gospel Singers",
      excerpt: "Professional advice on developing your gospel singing voice, from breathing techniques to emotional expression.",
      author: "Voice Coach Maria Rodriguez",
      date: "November 20, 2024",
      category: "Education",
      readTime: "6 min read",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png"
    },
    {
      id: 6,
      title: "Community Outreach: Music That Makes a Difference",
      excerpt: "Stories from our community service initiatives and how music continues to transform lives across our city.",
      author: "Outreach Director Jane Smith",
      date: "November 15, 2024",
      category: "Community",
      readTime: "5 min read",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png"
    }
  ];

  const categories = [
    "All Posts",
    "Inspiration",
    "Behind the Scenes", 
    "How-To",
    "History",
    "Education",
    "Community"
  ];

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
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="mb-12 overflow-hidden hover:shadow-warm transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={post.image} 
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
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                      <span>{post.readTime}</span>
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
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-warm transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
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
                    {post.excerpt}
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
                      {post.date}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.readTime}
                  </div>
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