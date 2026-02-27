export interface Competition {
  category: string;
  name: string;
  type: string;
  description: string;
  image?: string;
  rules?: string[];
  prize?: string;
}

export const competitionsData: Competition[] = [
  // Music
  { 
    category: "Music", 
    name: "Raag Rhythem (Singing)", 
    type: "Solo", 
    description: "Showcase your vocal talent with soulful Hindi melodies, from classical to contemporary hits.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 30 years.",
      "A valid college ID or government ID is required for verification.",
      "Registration is mandatory for all participants.",
      "Round 1 Mode: Offline at the venue; shortlisted participants will proceed to the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Performance tracks can be shared via email or submitted on the day of Round 1.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Please ensure content is suitable for a diverse college audience.",
      
      "Competition-Specific Rules",
      "Round 1 duration: Max 3 minutes.",
      "Final Round duration: Max 4 minutes.",
      "Participants are requested to bring their own instruments and accessories if needed.",
      "Please inform the Management Team about specific requirements in advance. (if any)",
      "A maximum of 3 calls will be made for the participant to reach the stage."
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  },
  { 
    category: "Music", 
    name: "Duet Singing", 
    type: "Duet", 
    description: "Two voices, one harmony. Partner up and deliver a captivating vocal performance.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 30 years.",
      "A valid college ID or government ID is required for verification.",
      "Registration is mandatory for both participants of the duet.",
      "Round 1 Mode: Offline at the venue; shortlisted duets will proceed to the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Performance tracks can be shared via email or submitted on the day of Round 1.",
      "We recommend keeping a backup of your track your device or in a pendrive.",
      
      "Competition-Specific Rules",
      "Round 1 duration: Max 3 minutes.",
      "Final Round duration: Max 4 minutes.",
      "Self-accompaniment with instruments is permitted."
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  },

  // Dance
  { 
    category: "Dance", 
    name: "Mudra Mix (Solo)", 
    type: "Solo", 
    description: "Express your passion through movement in our high-stakes solo dance battle.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 30 years with valid ID.",
      "Registration is mandatory for all performers.",
      "Round 1 Mode: Offline at the venue; shortlisted performers will proceed to the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Performance tracks should be shared via email.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Costumes and movements should be suitable for a diverse audience.",
      
      "Competition-Specific Rules",
      "Round 1 duration: Max 3 minutes.",
      "Final Round duration: Max 5 minutes.",
      "All dance styles are welcome (Classical, Western, Folk, etc.).",
      "Participants are responsible for managing and clearing their own props."
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  },
  { 
    category: "Dance", 
    name: "Mudra Mix (Group)", 
    type: "Group", 
    description: "Synchronization, energy, and creativity. Bring your crew and dominate the floor.",
    rules: [
      "Common Rules",
      "Eligibility: 16–30 years with valid identity proof.",
      "Registration for the entire group is mandatory.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Performance tracks should be shared via email.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Clean content and appropriate costumes are requested.",
      
      "Competition-Specific Rules",
      "Round 1 duration: Max 3 minutes.",
      "Final Round duration: Max 5 minutes.",
      "Group size: mini 3 to max 10 participants.",
      "Judging criteria: Coordination, formations, energy, and overall impact."
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  },

  // Drama
  { 
    category: "Drama", 
    name: "Natyotrav (Drama)", 
    type: "Group", 
    description: "Full-scale theatrical productions brought to life with intensity and emotion.",
    rules: [
      "Common Rules",
      "Age Limit: 16 to 30 years with valid ID verification.",
      "Registration is mandatory.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Creative expression is encouraged while maintaining sensitivity towards all audience members.",
      "Props and costumes must be arranged by the participants.",
      "Safety first: No fire, weapons, or hazardous materials allow.",
      
      "Competition-Specific Rules",
      "Round 1 duration: Max 5 minutes.",
      "Final Round duration: Max 8 minutes.",
      "Please coordinate technical requirements (lights/mic) with the Management Team in advance.",
      "Language: Performances are permitted in English, Hindi, or regional languages. For mixed-language pieces, ensure the narrative remains accessible to the judges.",
      "Technical Coordination: One team representative must coordinate cues at the technical console. Soundtracks (MP3) must be submitted to the Tech Team of the Event One hour before the event.",
      "Script Submission: A soft copy of the script or a detailed synopsis must be provided during registration for content vetting."
    ],  
    prize: "Certificates, Trophies and Cash Prizes"
  },

  // Band
  { 
    category: "Band", 
    name: "Band War", 
    type: "Group", 
    description: "Amplify your sound and compete against the best student bands in the city.",
    rules: [
      "Common Rules",
      "Age eligibility: 16–30 years with valid ID mandatory for all members.",
      "Round 1 Mode: Online (Video submission required).",
      "Shortlisted bands will perform live in the Final Round.",
      "(if selected) Participants must be present 45 minutes before their allotted live slot for Final Round.",
      "Lyrics and presentation should be suitable for a general audience.",
      "Language: Performances are permitted in English, Hindi, or any regional languages.",
      "Competition-Specific Rules",
      "Team Size: mini 3 to max 10 members.",
      "Round 1 (Online) duration: (Video Duration) Max 4 minutes.",
      "Participant should submit their recent performance video as well for the Round 1 (without any EDITING)",
      "Final Round (Live) duration: Max 10 minutes",
      "Bands must bring their own instruments, and accessories.",
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  },

  // Street Play
  { 
    category: "Street Play", 
    name: "Nukkad Natak", 
    type: "Group", 
    description: "Raw and socially relevant theatre performed in open spaces to awaken and inspire.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 30 years with valid ID.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Early Check-in : All participants must be present at the venue 30 minutes prior to the scheduled reporting time",
      "Inflammatory content is to be avoided to ensure a positive environment.",
      "Adherence to time limits and schedules is requested.",
      
      "Competition-Specific Rules",
      "Team size: min 8 to max 20 members.",
      "Performance duration: 20 minutes. (empty space to empty space)",
      "No microphones, electronic amplification, open flames or live animals are not allowed.",
      "No props will be provided by the management.",
      "Any props or other materials will be managed by the participanting team itself.",
    ],
    prize: "Certificates, Trophies and Cash Prizes"
  }
];
