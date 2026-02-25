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
    name: "Solo Singing", 
    type: "Solo", 
    description: "Showcase your vocal talent with soulful Hindi melodies, from classical to contemporary hits.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years.",
      "Participants must carry a valid college ID or government ID for verification.",
      "Registration is mandatory for all participants.",
      "Audition Mode: Offline auditions; shortlisted participants will perform in the final round.",
      "Participants/teams must report at least 30 minutes before their allotted slot.",
      "All performances must strictly follow the given time limits.",
      "Tracks may be submitted on the audition day or uploaded during registration.",
      "Final track must be submitted at least 48 hours before the final performance via email.",
      "Vulgarity, abusive language, or obscene content is strictly prohibited.",
      "Judges' decisions are final and binding.",
      "Competition-Specific Rules",
      "Solo duration: Max 5 minutes (stage-to-stage).",
      "Participants must bring their own instruments (if any) and accessories.",
      "Instrument details must be informed to the organizers in advance.",
      "Stage call will be made a maximum of 3 times before disqualification.",
      "A backup of the performance track is highly recommended."
    ],
    prize: "Trophies and Cash Prizes"
  },
  { 
    category: "Music", 
    name: "Duet Singing", 
    type: "Duet", 
    description: "Two voices, one harmony. Partner up and deliver a captivating vocal performance.",
    image: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years.",
      "Participants must carry a valid college ID or government ID for verification.",
      "Registration is mandatory for both members of the duet.",
      "Audition Mode: Offline auditions; only shortlisted duets perform in finals.",
      "Report 30 minutes before your allotted timing.",
      "Performance time limits are strictly monitored.",
      "Track submission: MP3 via email only, 48 hours prior to finals.",
      "Vulgar or inappropriate content leads to immediate disqualification.",
      "Judges' decision is final.",
      "Competition-Specific Rules",
      "Duet duration: Max 6 minutes (stage-to-stage).",
      "Coordination and harmony between both singers will be a key judging criterion.",
      "Both participants must be active throughout the performance.",
      "Self-accompaniment with instruments is permitted."
    ],
    prize: "Best Duet Award"
  },

  // Dance
  { 
    category: "Dance", 
    name: "Solo Dance", 
    type: "Solo", 
    description: "Express your passion through movement in our high-stakes solo dance battle.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "Eligibility: 16–27 years with valid ID proof.",
      "Registration is mandatory.",
      "Audition Mode: Offline; criteria based on rhythm, expression, and technique.",
      "Punctuality is key; report 30 mins early.",
      "Track submission via email 48 hours before finals.",
      "Vulgarity in music, costumes, or movements is strictly forbidden.",
      "Competition-Specific Rules",
      "Solo duration: Max 5 minutes.",
      "All dance styles (Classical, Western, Folk, etc.) are welcome.",
      "Props must be managed and cleared by the participant immediately after the act."
    ],
    prize: "Best Solo Performer Award"
  },
  { 
    category: "Dance", 
    name: "Group Dance", 
    type: "Group", 
    description: "Synchronization, energy, and creativity. Bring your crew and dominate the floor.",
    image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "Participants must be between 16 and 27 years old.",
      "Valid identity proof (College/Govt ID) is required.",
      "Registration for the entire group is mandatory.",
      "Report at least 30 minutes before the scheduled time.",
      "Final tracks must be submitted via email 2 days before the performance.",
      "Clean content only; any obscenity leads to disqualification.",
      "Competition-Specific Rules",
      "Group duration: Max 7 minutes.",
      "Group size: 3 to 14 participants.",
      "Judging criteria: Coordination, formations, energy, and overall impact."
    ],
    prize: "Best Group Coordination Award"
  },

  // Drama
  { 
    category: "Drama", 
    name: "Drama", 
    type: "Group", 
    description: "Full-scale theatrical productions brought to life with intensity and emotion.",
    image: "https://images.unsplash.com/photo-1503095396549-80703901828b?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "Age Limit: 16 to 27 years.",
      "Participants must carry valid verification IDs.",
      "Offline auditions will be held to shortlist teams for finals.",
      "Strict content guidelines: No vulgarity, hate speech, or political insults.",
      "Props and costumes must be arranged by the participants.",
      "Fire, weapons, or hazardous materials are strictly prohibited.",
      "Competition-Specific Rules",
      "Performance time: 7–12 minutes.",
      "Gross stage time (including setup/teardown): Max 15 minutes.",
      "Use of microphones and lights must be coordinated with the technical team in advance."
    ],
    prize: "Best Production Trophy"
  },

  // Band
  { 
    category: "Band", 
    name: "Band War", 
    type: "Group", 
    description: "Amplify your sound and compete against the best student bands in the city.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "Age eligibility: 16–27 years.",
      "Valid ID is mandatory for all band members.",
      "Audition Mode: Online auditions (video submission required).",
      "Shortlisted bands will perform live in the final round.",
      "Reporting time: 45 minutes before the allotted slot.",
      "No offensive content in lyrics or presentation.",
      "Competition-Specific Rules",
      "Performance time: Max 15 minutes (including soundcheck).",
      "Bands must bring their own instruments, processors, and cables.",
      "Only a basic drum kit and PA system will be provided.",
      "Live vocals and instruments only; no pre-recorded tracks allowed."
    ],
    prize: "Recording Opportunity & Cash Prize"
  },

  // Street Play
  { 
    category: "Street Play", 
    name: "Nukkad Natak", 
    type: "Group", 
    description: "Raw and socially relevant theatre performed in open spaces to awaken and inspire.",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
    rules: [
      "Common Rules",
      "Open to participants aged 16 to 27 years.",
      "Valid identity verification is mandatory.",
      "Audition Mode: Online/Video submission for shortlisting.",
      "Final round will be held on-site in an open arena.",
      "Strict adherence to time limits and reporting schedules.",
      "Vulgarity or inflammatory content will lead to immediate disqualification.",
      "Competition-Specific Rules",
      "Team size: 8 to 20 members.",
      "Performance duration: 10–15 minutes.",
      "Must have a clear social or awareness-based theme.",
      "No microphones or electronic amplification; only live physical instruments are allowed.",
      "Performance area is three-sided open (arena style)."
    ],
    prize: "Best Street Play Award"
  }
];
