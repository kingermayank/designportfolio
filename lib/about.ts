export type AboutSection = {
  nav: string;
  heading: string;
  body: string[];
  principles?: { title: string; text: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
};

export type AboutPhoto = {
  src: string;
  alt: string;
  ar: number; // width / height
};

export const ABOUT_INTRO = {
  greeting: "Hey there, I'm Mayank.",
  pronunciation: "{pronounced my-yunk}",
  summary:
    "I am a pi-shaped designer who specializes in 0 → 1, B2B2C, and SaaS products, with 5+ years of experience crafting web platforms, mobile apps, and design systems.",
  hero: {
    src: "/about/hero.jpg",
    alt: "Mayank Kinger",
    ar: 1984 / 1134,
  } satisfies AboutPhoto,
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kingermayank/" },
    { label: "X (Twitter)", href: "https://x.com/kingermayank" },
    { label: "GitHub", href: "https://github.com/kingermayank" },
    {
      label: "Resume",
      href: "https://drive.google.com/file/d/1ARMGtXzDuXnK0jrYjc3dxizeUVrlPWTF/view?usp=sharing",
    },
    { label: "Email", href: "mailto:kingermayank@gmail.com" },
  ],
};

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    nav: "Origin",
    heading: "Where it all began.",
    body: [
      "I've always been passionate about creating and about technology, so pursuing a degree in Computer Science felt like a natural choice. But I quickly realized I was more interested in the principles and rationale behind the code I was writing than the code itself.",
      "That led me to explore design and adjacent creative fields — visual design, AR/VR, game design, filmmaking — while working with student organizations and early-stage startups. Through those experiences I developed a deep appreciation for the creative problem-solving involved in design.",
      "This background shaped me into a designer who values scalability and embraces systems thinking, which lets me thrive in ambiguous environments alongside cross-functional teams.",
    ],
  },
  {
    nav: "AI",
    heading: "How my work is evolving with AI.",
    body: [
      "My goal this year is to transition from an AI-enabled designer to a design engineer — someone who not only ships what he designs, but can debug sloppy code and fully own the front end.",
      "I primarily iterate through code-based workflows using tools like Cursor and Claude Code, turning ideas directly into working prototypes. At work I'm building an LLM-aware design system that exposes tokens and components directly to the model, enabling context-aware, agentic development. That extends into a vibe-coding starter kit that lets product teams rapidly spin up production-quality proofs of concept.",
      "I've built a solid foundation in React and TypeScript, and I'm going deeper into motion with GSAP and Framer Motion. At the same time I'm intentionally pushing my visual craft, brand design, and creative direction. AI can get you to a 7/10 experience by default; the real leverage now is taking that to a 15/10. I've been experimenting with Rive and Figma Weave to go beyond static design into rich, expressive, interactive work.",
      "It's intense and sometimes exhausting, but it's unlocking a level of velocity and creative expression I couldn't reach before — and I'm all in.",
    ],
  },
  {
    nav: "Philosophy",
    heading: "My work philosophy.",
    body: [
      "I see design as a powerful strategic tool to solve complex business challenges and create lasting value. Designers owe a certain responsibility not just to their work, but to society and its people.",
    ],
    principles: [
      {
        title: "Beauty is in the details.",
        text: "Great design lives in the nuances. I put in the extra effort to make sure every interaction feels just right, guided by a sense of taste built over years.",
      },
      {
        title: "Stay hungry. Stay foolish.",
        text: "I never shy away from being vulnerable, admitting mistakes, and asking questions. I don't believe in pretending to be perfect — no one is.",
      },
      {
        title: "Bruce Lee's 'Be Water' approach.",
        text: "I prioritize quality, but I know when a tent is better than a castle. Like water, I shape myself to fit tight timelines and constraints while maintaining conviction.",
      },
      {
        title: "Teamwork makes the dream work.",
        text: "The best products are built through strong collaboration. I bring engineers into discovery early and partner closely with PMs to align on strategy.",
      },
      {
        title: "Feedback is a gift.",
        text: "Giving or receiving, candid feedback is the fastest route to growth — both for me and for the products I work on.",
      },
      {
        title: "Say what needs to be said.",
        text: "I don't like beating around the bush and wasting everyone's time. If something needs to be said, I'll speak up.",
      },
      {
        title: "Design without borders.",
        text: "I don't stay constrained by my job title. Whether it's writing PRDs, troubleshooting with developers, or creating training materials — if something needs doing, I'll step up.",
      },
      {
        title: "Ambiguity fuels creativity.",
        text: "The unknown doesn't intimidate me, it energizes me. I thrive when things are unclear — finding a path forward is what makes the process rewarding.",
      },
      {
        title: "Commitment to giving back.",
        text: "I'm passionate about helping others grow. I've received help from countless people I could never repay, and I'm committed to paying it forward.",
      },
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "From the beginning Mayank always impressed me with his drive to improve not only himself but the people, teams, products, and processes around them. He has a strong will to fight for the ideas he believes in but is open minded enough to accept other viewpoints and alternate solutions. There are few I've worked with that have as much dedication to the craft as Mayank has. He will benefit any team he joins.",
    name: "Jordan Detota",
    role: "Director of Product Design, Ikon Technologies",
    avatar: "/about/avatar-jordan.png",
  },
  {
    quote:
      "Mayank was an intern that I had the pleasure of working with while he was at PathAI. He showed a tremendous eagerness to learn as he learned all the different hats one needs to wear when designing a product. He was able to lead user research sessions, pushed designs iteratively, and ended up delivering production ready files to engineering. The amount of growth he showed was impressive and he'll be a great designer for whichever team is lucky to have him next.",
    name: "Sandy Zhu",
    role: "Staff Product Designer, PathAI",
    avatar: "/about/avatar-sandy.jpeg",
  },
  {
    quote:
      "Mayank was a great addition to our design team at bb. His eagerness to learn and passion for visual design was evident in the quality of the work he produced. He built a design system with the help of team members by quickly adapting and understanding of our design standards and bringing fresh ideas to the table. I have no doubt that Mayank will continue to excel in his career.",
    name: "Abhiteja Vulapu",
    role: "Head of Design, BigBasket",
    avatar: "/about/avatar-abhiteja.png",
  },
  {
    quote:
      "Mayank is a very talented and dedicated designer who brings storytelling and visual communication to the fore. His ability to clearly articulate his thoughts and think rationally made it a joy to work and have meaningful conversations with him. He is a quick learner and has an inquisitive mind that helped him learn and unlearn various concepts here at bigbasket — especially on the design system project.",
    name: "Raghav Vasudevan",
    role: "Senior Product Designer, BigBasket",
    avatar: "/about/avatar-raghav.jpeg",
  },
];

export const ABOUT_PTO: AboutPhoto[] = [
  {
    src: "/about/pto-1-austin.jpeg",
    alt: "Signing the finish line at Austin Grand Prix",
    ar: 2098 / 2560,
  },
  {
    src: "/about/pto-2.jpg",
    alt: "Travel photo",
    ar: 1024 / 768,
  },
  {
    src: "/about/pto-3.jpg",
    alt: "Travel photo",
    ar: 1696 / 2560,
  },
  {
    src: "/about/pto-4.png",
    alt: "Travel photo",
    ar: 1905 / 2267,
  },
  {
    src: "/about/pto-5-boston.jpeg",
    alt: "Seaside chillin' in Boston",
    ar: 1920 / 2560,
  },
  {
    src: "/about/pto-6.jpeg",
    alt: "Travel photo",
    ar: 2006 / 2560,
  },
];
