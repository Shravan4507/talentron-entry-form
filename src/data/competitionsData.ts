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
    name: "Raag Rhythem", 
    type: "Solo", 
    description: "Showcase your vocal talent with soulful Hindi melodies, from classical to contemporary hits.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years.",
      "A valid college ID or government ID is required for verification.",
      "Registration is mandatory for all participants.",
      "Round 1 Mode: Offline at the venue; shortlisted participants will proceed to the Final Round.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Performance tracks can be shared via email or submitted on the day of Round 1.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Please ensure content is suitable for a diverse college audience.",
      "Competition-Specific Rules",
      "Solo duration: Max 5 minutes (stage-to-stage).",
      "Participants are requested to bring their own instruments and accessories if needed.",
      "Please inform the Management Team about instrument requirements in advance.",
      "A maximum of 3 calls will be made for the participant to reach the stage."
    ],
    prize: "Trophies and Cash Prizes"
  },
  { 
    category: "Music", 
    name: "Duet Singing", 
    type: "Duet", 
    description: "Two voices, one harmony. Partner up and deliver a captivating vocal performance.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years.",
      "A valid college ID or government ID is required for verification.",
      "Registration is mandatory for both members of the duet.",
      "Round 1 Mode: Offline at the venue; shortlisted duets will proceed to the Final Round.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Performance tracks can be shared via email or submitted on the day of Round 1.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Competition-Specific Rules",
      "Duet duration: Max 6 minutes (stage-to-stage).",
      "Judging will focus on coordination and harmony between singers.",
      "Both participants must be active throughout the performance.",
      "Self-accompaniment with instruments is permitted."
    ],
    prize: "Best Duet Award"
  },

  // Dance
  { 
    category: "Dance", 
    name: "Mudra Mix (Solo)", 
    type: "Solo", 
    description: "Express your passion through movement in our high-stakes solo dance battle.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years with valid ID.",
      "Registration is mandatory for all performers.",
      "Round 1 Mode: Offline; criteria include rhythm, expression, and technique.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Performance tracks should be shared via email or provided on the day of Round 1.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Costumes and movements should be suitable for a diverse audience.",
      "Competition-Specific Rules",
      "Solo duration: Max 5 minutes.",
      "All dance styles are welcome (Classical, Western, Folk, etc.).",
      "Participants are responsible for managing and clearing their own props."
    ],
    prize: "Best Solo Performer Award"
  },
  { 
    category: "Dance", 
    name: "Mudra Mix (Group)", 
    type: "Group", 
    description: "Synchronization, energy, and creativity. Bring your crew and dominate the floor.",
    rules: [
      "Common Rules",
      "Eligibility: 16–27 years with valid identity proof.",
      "Registration for the entire group is mandatory.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Performance tracks should be shared via email or provided on the day of Round 1.",
      "We recommend keeping a backup of your track in a pendrive.",
      "Clean content and appropriate costumes are requested.",
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
    name: "Natyotrav", 
    type: "Group", 
    description: "Full-scale theatrical productions brought to life with intensity and emotion.",
    rules: [
      "Common Rules",
      "Age Limit: 16 to 27 years with valid ID verification.",
      "Registration is mandatory.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Creative expression is encouraged while maintaining sensitivity towards all audience members.",
      "Props and costumes must be arranged by the participants.",
      "Safety first: No fire, weapons, or hazardous materials allow.",
      "Competition-Specific Rules",
      "Performance time: 7–12 minutes.",
      "Total stage time (including setup/teardown): Max 15 minutes.",
      "Please coordinate technical requirements (lights/mic) with the Management Team in advance."
    ],
    prize: "Best Production Trophy"
  },

  // Band
  { 
    category: "Band", 
    name: "Band War", 
    type: "Group", 
    description: "Amplify your sound and compete against the best student bands in the city.",
    rules: [
      "Common Rules",
      "Age eligibility: 16–27 years with valid ID mandatory for all members.",
      "Registration is mandatory.",
      "Round 1 Mode: Online (Video submission required).",
      "Shortlisted bands will perform live in the Final Round.",
      "Participants must be present 45 minutes before their allotted live slot.",
      "Lyrics and presentation should be suitable for a general audience.",
      "Competition-Specific Rules",
      "Performance time: Max 15 minutes (including soundcheck).",
      "Bands must bring their own instruments, processors, and cables.",
      "Basic drum kit and PA system will be provided by the Management Team.",
      "Live vocals and instruments only; no pre-recorded backing tracks."
    ],
    prize: "Recording Opportunity & Cash Prize"
  },

  // Street Play
  { 
    category: "Street Play", 
    name: "Nukkad Natak", 
    type: "Group", 
    description: "Raw and socially relevant theatre performed in open spaces to awaken and inspire.",
    rules: [
      "Common Rules",
      "The competition is open to participants aged 16 to 27 years with valid ID.",
      "Registration is mandatory.",
      "Round 1 Mode: Offline at the venue; teams will be shortlisted for the Final Round.",
      "Participants must be present 30 minutes before the competition's Round 1.",
      "Inflammatory content is to be avoided to ensure a positive environment.",
      "Adherence to time limits and schedules is requested.",
      "Competition-Specific Rules",
      "Team size: 8 to 20 members.",
      "Performance duration: 10–15 minutes.",
      "Themes should focus on social awareness or relevant topics.",
      "No microphones or electronic amplification; physical instruments only.",
      "Performance area is a three-sided open arena."
    ],
    prize: "Best Street Play Award"
  }
];
