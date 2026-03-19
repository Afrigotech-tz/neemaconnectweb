import { Music, Play, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MusicPlatforms = () => {
  const platforms = [
    {
      name: "Spotify",
      icon: "🎵",
      description: "Stream our latest albums and worship sessions",
      followers: "12K+",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Apple Music",
      icon: "🍎",
      description: "Download high-quality gospel music",
      followers: "8K+",
      color: "from-gray-800 to-gray-900"
    },
    {
      name: "YouTube",
      icon: "📺",
      description: "Watch live performances and music videos",
      followers: "25K+",
      color: "from-red-500 to-red-600"
    },
    {
      name: "SoundCloud",
      icon: "☁️",
      description: "Listen to exclusive tracks and behind-the-scenes content",
      followers: "5K+",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const featuredTracks = [
    {
      title: "Hallelujah Praise",
      album: "Songs of Victory",
      duration: "4:32",
      plays: "50K+",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"
    },
    {
      title: "Amazing Grace Revival",
      album: "Traditional Harmonies", 
      duration: "5:18",
      plays: "35K+",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png"
    },
    {
      title: "Joyful Celebration",
      album: "Live at City Cathedral",
      duration: "6:45",
      plays: "28K+",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png"
    }
  ];

  return (
    <section className="landing-band landing-band-harmony py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Listen on Your Favorite Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our uplifting gospel music wherever you are. Stream, download, and share the joy.
          </p>
        </div>

        {/* Music Platforms */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <Card 
              key={platform.name}
              className="group cursor-pointer border-white/60 bg-card/85 backdrop-blur-sm hover:-translate-y-1 hover:shadow-warm transition-all duration-300"
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{platform.icon}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {platform.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {platform.description}
                </p>
                <div className="text-sm font-medium text-primary">
                  {platform.followers} followers
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Tracks */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Featured Tracks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTracks.map((track, index) => (
              <Card key={track.title} className="group border-white/60 bg-card/85 backdrop-blur-sm hover:shadow-warm transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={track.image} 
                    alt={track.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm">
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-2">{track.album}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{track.duration}</span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {track.plays}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-2xl border border-white/20 bg-gradient-primary p-8 text-center text-primary-foreground shadow-warm">
          <Music className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Download Neema Connect App</h3>
          <p className="text-lg mb-6 opacity-90">
            Stay connected with Neema Gospel Choir - Access music, events, and more on the go
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download on App Store
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-foreground transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Get it on Google Play
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlatforms;
