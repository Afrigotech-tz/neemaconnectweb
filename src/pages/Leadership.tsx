import { 
  User, 
  Users, 
  Wallet, 
  Mic, 
  Music, 
  Shield, 
  GraduationCap,
  Globe,
  Heart,
  ArrowDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LeadershipMember {
  id: number;
  name: string;
  role: string;
  roleSwahili: string;
  description: string;
  image: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  level: number;
}

const Leadership = () => {
  // Leadership data for UONGOZI NEEMA GOSPEL CHOIR - organized by levels
  const leadershipTeam: LeadershipMember[] = [
    // Level 1 - Top Leadership
    {
      id: 1,
      name: "Samuel Nkola",
      role: "Chairman",
      roleSwahili: "Mwenyekiti",
      description: "Provides overall leadership and guidance to the choir organization.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      icon: User,
      color: "from-amber-400 to-amber-600",
      colorBg: "bg-amber-500",
      level: 1
    },
    {
      id: 2,
      name: "Baraka Makaya",
      role: "Vice Chairman",
      roleSwahili: "Naibu Mwenyekiti",
      description: "Supports the chairman and assumes responsibilities when needed.",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      colorBg: "bg-blue-500",
      level: 1
    },
    {
      id: 3,
      name: "Alpha E. Makaya",
      role: "General Secretary",
      roleSwahili: "Katibu Mkuu",
      description: "Manages administrative tasks, correspondence, and official records.",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      icon: GraduationCap,
      color: "from-purple-400 to-purple-600",
      colorBg: "bg-purple-500",
      level: 1
    },
    // Level 2 - Deputy Secretaries
    {
      id: 4,
      name: "Esther Deus",
      role: "Deputy Secretary",
      roleSwahili: "Katibu Msaidizi",
      description: "Assists the general secretary in all administrative duties.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      icon: Shield,
      color: "from-teal-400 to-teal-600",
      colorBg: "bg-teal-500",
      level: 2
    },
    {
      id: 5,
      name: "Titus Alfred",
      role: "Deputy Secretary",
      roleSwahili: "Katibu Msaidizi",
      description: "Supports the secretariat with documentation and communication.",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      icon: Shield,
      color: "from-cyan-400 to-cyan-600",
      colorBg: "bg-cyan-500",
      level: 2
    },
    // Level 3 - Finance
    {
      id: 6,
      name: "Quillian Kilago",
      role: "Finance Director",
      roleSwahili: "Mkurugenzi wa Fedha",
      description: "Oversees all financial matters, budgeting, and resource management.",
      image: "/lovable-uploads/AIC-MAIN.png",
      icon: Wallet,
      color: "from-green-400 to-green-600",
      colorBg: "bg-green-500",
      level: 3
    },
    {
      id: 7,
      name: "Janesuzy Alfred",
      role: "Assistant Finance Director",
      roleSwahili: "Msaidizi wa Mkurugenzi wa Fedha",
      description: "Supports the finance director in managing financial operations.",
      image: "/lovable-uploads/neema.png",
      icon: Wallet,
      color: "from-emerald-400 to-emerald-600",
      colorBg: "bg-emerald-500",
      level: 3
    },
    // Level 4 - Technical & Music
    {
      id: 8,
      name: "Fredrick Kilago",
      role: "Technical Director",
      roleSwahili: "Mkurugenzi wa Teknolojia",
      description: "Manages technical aspects including sound systems and equipment.",
      image: "/lovable-uploads/NGC-Logo-2.png",
      icon: Mic,
      color: "from-orange-400 to-orange-600",
      colorBg: "bg-orange-500",
      level: 4
    },
    {
      id: 9,
      name: "Kepha Mdeme",
      role: "Music Director",
      roleSwahili: "Mkurugenzi wa Muziki",
      description: "Leads musical rehearsals, performances, and arranges music pieces.",
      image: "/lovable-uploads/NGC-Logo-22.png",
      icon: Music,
      color: "from-rose-400 to-rose-600",
      colorBg: "bg-rose-500",
      level: 4
    },
    // Level 5 - Discipline
    {
      id: 10,
      name: "Jesca Swalala",
      role: "Discipline Coordinator",
      roleSwahili: "Mratibu wa Disco",
      description: "Ensures adherence to choir rules and maintains discipline.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      icon: Shield,
      color: "from-red-400 to-red-600",
      colorBg: "bg-red-500",
      level: 5
    },
    {
      id: 11,
      name: "Emmanuel Magile",
      role: "Discipline Coordinator",
      roleSwahili: "Mratibu wa Disco",
      description: "Works to maintain order and resolve internal conflicts.",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png",
      icon: Shield,
      color: "from-rose-400 to-rose-600",
      colorBg: "bg-rose-500",
      level: 5
    },
    // Level 6 - PR
    {
      id: 12,
      name: "Mariam W. Protace",
      role: "Public Relations / Spokesperson",
      roleSwahili: "Mawasiliano / Msemaji",
      description: "Handles public communications and represents the choir externally.",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      icon: Globe,
      color: "from-indigo-400 to-indigo-600",
      colorBg: "bg-indigo-500",
      level: 6
    }
  ];

  // Group by level
  const levelLabels: { [key: number]: { title: string; swahili: string } } = {
    1: { title: "Top Leadership", swahili: "Uongozi wa Juu" },
    2: { title: "Secretariat", swahili: "Katiba" },
    3: { title: "Finance", swahili: "Fedha" },
    4: { title: "Technical & Music", swahili: "Teknolojia na Muziki" },
    5: { title: "Discipline", swahili: "Dhisipulini" },
    6: { title: "Public Relations", swahili: "Mawasiliano" }
  };

  const getLeadersByLevel = (level: number) => leadershipTeam.filter(l => l.level === level);

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section - Better Structured */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">UONGOZI</h1>
          <p className="text-xl md:text-2xl font-light mb-4">Neema Gospel Choir</p>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span className="text-lg">Leadership Structure</span>
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* Leadership Flow Chart - Better Organized */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/20 via-background to-muted/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Level 1 - Top Leadership */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                {levelLabels[1].title} • {levelLabels[1].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(1).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-xl ring-4 ring-white`}>
                      <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-white" />
                    </div>
                    <span className="mt-3 font-bold text-foreground text-sm md:text-base">{leader.role}</span>
                    <span className="text-xs md:text-sm text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
            {/* Connector */}
            <div className="flex justify-center my-4">
              <div className="h-8 w-0.5 bg-gradient-to-b from-amber-400 to-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Level 2 - Secretariat */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                {levelLabels[2].title} • {levelLabels[2].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(2).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg ring-3 ring-white`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="mt-2 font-semibold text-foreground text-sm">{leader.role}</span>
                    <span className="text-xs text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center my-4">
              <div className="h-8 w-0.5 bg-gradient-to-b from-purple-400 to-green-400 rounded-full"></div>
            </div>
          </div>

          {/* Level 3 - Finance */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                {levelLabels[3].title} • {levelLabels[3].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(3).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg ring-3 ring-white`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="mt-2 font-semibold text-foreground text-sm">{leader.role}</span>
                    <span className="text-xs text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center my-4">
              <div className="h-8 w-0.5 bg-gradient-to-b from-green-400 to-orange-400 rounded-full"></div>
            </div>
          </div>

          {/* Level 4 - Technical & Music */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                {levelLabels[4].title} • {levelLabels[4].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(4).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg ring-3 ring-white`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="mt-2 font-semibold text-foreground text-sm">{leader.role}</span>
                    <span className="text-xs text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center my-4">
              <div className="h-8 w-0.5 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></div>
            </div>
          </div>

          {/* Level 5 - Discipline */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                {levelLabels[5].title} • {levelLabels[5].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(5).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg ring-3 ring-white`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="mt-2 font-semibold text-foreground text-sm">{leader.role}</span>
                    <span className="text-xs text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center my-4">
              <div className="h-8 w-0.5 bg-gradient-to-b from-red-400 to-indigo-400 rounded-full"></div>
            </div>
          </div>

          {/* Level 6 - PR */}
          <div className="mb-4">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                {levelLabels[6].title} • {levelLabels[6].swahili}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {getLeadersByLevel(6).map((leader) => {
                const IconComponent = leader.icon;
                return (
                  <div key={leader.id} className="flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center shadow-lg ring-3 ring-white`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <span className="mt-2 font-semibold text-foreground text-sm">{leader.role}</span>
                    <span className="text-xs text-muted-foreground">{leader.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Leadership Cards Grid - Better Layout */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground">
              Dedicated servants guiding our choir ministry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {leadershipTeam.map((leader, index) => {
              const IconComponent = leader.icon;
              return (
                <Card 
                  key={leader.id} 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-b from-card to-card/80 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden h-44 sm:h-48">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${leader.colorBg} text-white text-xs font-medium`}>
                        <IconComponent className="h-3.5 w-3.5" />
                        {leader.role}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs text-primary font-medium mb-2">
                      {leader.roleSwahili}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {leader.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="h-10 w-10 mx-auto text-primary mb-3" />
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Together in Service</h3>
          <p className="text-md text-muted-foreground leading-relaxed">
            Our leadership team works collaboratively to ensure the choir runs smoothly, 
            maintains spiritual integrity, and continues to grow in grace and musical excellence.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Leadership;

