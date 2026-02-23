export interface Competition {
  category: string;
  name: string;
  type: string;
  description: string;
  image: string;
  rules?: string[];
  prize?: string;
}

export const competitionsData: Competition[] = [
  // Music
  { 
    category: "Music", 
    name: "Hindi Singing", 
    type: "Solo", 
    description: "Showcase your vocal talent with soulful Hindi melodies, from classical to contemporary hits.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    rules: ["Time limit: 3-5 minutes", "Backing tracks allowed", "No offensive lyrics"],
    prize: "Trophies and Cash Prizes"
  },
  { 
    category: "Music", 
    name: "Rap", 
    type: "Solo", 
    description: "Dominate the mic with your rhythm, flow, and lyrical prowess.",
    image: "https://images.unsplash.com/photo-1571453272461-93d36a928926?q=80&w=800&auto=format&fit=crop",
    rules: ["Original lyrics only", "No profanity"],
    prize: "Studio Recording Session"
  },

  // Dance
  { 
    category: "Dance", 
    name: "Non-Thematic Dance", 
    type: "Group", 
    description: "High-energy choreography focusing on synchronization and power.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    rules: ["Team size: 6-15 members", "Focus on energy and sync"],
    prize: "Best Group Performance Award"
  },
  { 
    category: "Dance", 
    name: "Thematic Dance", 
    type: "Group", 
    description: "Storytelling through movement. Narrative-driven performances.",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=800&auto=format&fit=crop",
    rules: ["Clear theme required", "Props allowed"],
    prize: "Most Creative Theme Award"
  },

  // Drama
  { 
    category: "Drama", 
    name: "Stage Play", 
    type: "Group", 
    description: "Full-scale theatrical productions brought to life with intensity.",
    image: "https://images.unsplash.com/photo-1503095396549-80703901828b?q=80&w=800&auto=format&fit=crop",
    rules: ["Max 20 minutes", "Scripts must be original or adapted"],
    prize: "Best Production Trophy"
  },
  { 
    category: "Drama", 
    name: "Silent Theatre", 
    type: "Group", 
    description: "The art of mime and physical expression.",
    image: "https://images.unsplash.com/photo-1514302240736-b1fee59ee562?q=80&w=800&auto=format&fit=crop",
    rules: ["No spoken words", "Focus on expressions"],
    prize: "Excellence in Mime Award"
  },

  // Band
  { 
    category: "Band", 
    name: "Battle of Bands", 
    type: "Group", 
    description: "Amplify your sound and compete against the best student bands in the city.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
    rules: ["4-8 members per band", "Own instruments required"],
    prize: "Recording Contract and Cash Prize"
  },

  // Street Play
  { 
    category: "Street Play", 
    name: "Nukkad Natak", 
    type: "Group", 
    description: "Raw and socially relevant theatre performed in open spaces to awaken and inspire.",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
    rules: ["Outdoor style", "Social relevance focus", "Minimum 8 performers"],
    prize: "Best Street Play Award"
  }
];
