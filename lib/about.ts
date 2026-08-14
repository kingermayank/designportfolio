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
  pronunciation: "[pronounced my-yunk]",
  pronunciationHref: "https://www.youtube.com/watch?v=yisa-f1HAH4",
  summary:
    "I am a T-shaped designer who specializes in 0 → 1, B2B2C, and SaaS products w/ 5+ years of experience crafting web platforms, mobile apps, and design systems.",
  hero: {
    src: "/about/hero.jpg",
    alt: "Mayank Kinger",
    ar: 1984 / 1134,
  } satisfies AboutPhoto,
  links: [
    { label: "X/Twitter", href: "https://x.com/kingermayank" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kingermayank/" },
    {
      label: "Substack",
      href: "https://nextgendesigner.substack.com/",
    },
    { label: "Github", href: "https://github.com/kingermayank" },
    {
      label: "Resume",
      href: "https://drive.google.com/file/d/1ARMGtXzDuXnK0jrYjc3dxizeUVrlPWTF/view?usp=sharing",
    },
  ],
  email: "kingermayank@gmail.com",
  /** Same Drive file as the Resume social — used by the Option 1 fit CTA. */
  resumeHref:
    "https://drive.google.com/file/d/1ARMGtXzDuXnK0jrYjc3dxizeUVrlPWTF/view?usp=sharing",
};

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    nav: "Origin",
    heading: "Where it all began.",
    body: [
      "I've always been passionate about creating and technology, so pursuing a degree in Computer Science during my undergraduate studies felt like a natural choice. However, I quickly realized that I was more interested in understanding the underlying principles and rationale behind the code I was writing. This led me to explore the world of design and creative fields like visual design, AR/VR, game design, and filmmaking, while working with student organizations and early-stage startups. Through these experiences, I developed a deep appreciation for the creative problem-solving involved in design.",
      "This background has shaped me into a designer who values scalability and embraces a systems-thinking approach, enabling me to thrive in ambiguous environments while collaborating with cross-functional teams.",
    ],
  },
  {
    nav: "AI",
    heading: "How my work is evolving with AI.",
    body: [
      "My goal this year is to transition from an AI-enabled designer to a design engineer, someone who not only ships what he designs, but also debug sloppy code and fully own the front-end.",
      "I primarily iterate using code-based workflows using tools like Cursor and Claude Code, turning ideas directly into working prototypes. At work, I'm building an LLM-aware design system that exposes tokens and components directly to the model, enabling context-aware, agentic development. This extends into a \"vibe coding\" starter kit that allows product teams to rapidly experiment and spin up production-quality proofs of concept.",
      "I've built a solid foundation in React and TypeScript, and I'm going deeper into motion with GSAP and Framer Motion. At the same time, I'm intentionally pushing my visual craft, brand design, and creative direction. AI can get you to a 7/10 experience by default, but the real leverage now is in taking that to a 15/10. I've been experimenting with Rive and Figma Weave to go beyond static design into rich, expressive, and interactive visual experiences.",
      "It's intense and sometimes exhausting, but it's unlocking a level of velocity and creative expression I couldn't reach before and I'm all in.",
    ],
  },
  {
    nav: "Philosophy",
    heading: "My work philosophy.",
    body: [
      "I see design as a powerful strategic tool to solve complex business challenges and create lasting value. I feel that designers owe a certain amount of responsibility not just towards their work but also towards society and its people.",
    ],
    principles: [
      {
        title: "Beauty is in the details.",
        text: "I believe that great design is in the nuances, and I put in the extra effort to make sure every interaction feels just right. Over the years, I've developed a keen sense of taste that guides me in creating designs that are both refined and impactful.",
      },
      {
        title: "Stay hungry. Stay foolish.",
        text: "I never shy away from being vulnerable, admitting mistakes and asking questions. I don't believe in pretending to be perfect. No one is.",
      },
      {
        title: "Bruce Lee's 'Be Water' approach.",
        text: "I prioritize quality, but I know when a tent is better than a castle. Like water, I shape myself to fit tight timelines and constraints, staying flexible while maintaining my conviction. My experience across organizations of various sizes and maturity levels has taught me to unlearn, relearn, and find the most impactful ways to contribute.",
      },
      {
        title: "Teamwork makes the dream work.",
        text: "I believe that the best products are built through strong collaboration. I like bringing engineers into the discovery process early and partnering closely with product managers to align on strategy. It's all about creating a shared vision and working together to make it a reality.",
      },
      {
        title: "Feedback is a gift.",
        text: "Whether it's giving or receiving, I believe that candid feedback is the fastest route to growth, both for myself and the products I work on.",
      },
      {
        title: "Say what needs to be said.",
        text: "I don't like beating around the bush and wasting the time of everyone involved. I'm not one to hold back my thoughts, if something needs to be said, I'll speak up.",
      },
      {
        title: "Design without borders.",
        text: "I don't like to remain constrained by my job title. I bring my T-shaped skills and founder mentality to every project, understanding what it means to take full ownership. If something needs to be done, I'll step up, whether it's writing PRD's, troubleshooting with developers, or creating training materials, whatever helps the team succeed.",
      },
      {
        title: "Ambiguity fuels creativity.",
        text: "I believe that ambiguity is where the magic happens. The unknown doesn't intimidate me. It energizes and excites me. I embrace challenges, push through the initial overwhelm, and find clarity on the other side. I thrive when things are unclear. It's the challenge of finding a path forward that makes the process exciting and rewarding.",
      },
      {
        title: "Commitment to giving back.",
        text: "I'm passionate about helping others grow. I've been fortunate to receive help from countless people I could never fully repay, and I'm committed to giving back and supporting others to the best of my ability.",
      },
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "From the beginning Mayank always impressed me with his drive to improve not only himself but the people, teams, products, and processes around them. He has a strong will to fight for the ideas he believes in but is open minded enough to accept other viewpoints and alternate solutions. There are few I've worked with that have as much dedication to the craft as Mayank has. He will benefit any team he joins.",
    name: "Jordan Detota",
    role: "Director of Product Design at Ikon Technologies",
    avatar: "/about/avatar-jordan.png",
  },
  {
    quote:
      "Mayank was an intern that I had the pleasure of working with while he was at PathAI. He showed a tremendous eagerness to learn as he learned all the different hats one needs to wear when designing a product. He was able to lead user research sessions, pushed designs iteratively, and ended up delivering production ready files to engineering. The amount of growth he showed was impressive and he'll be a great designer for whichever team is lucky to have him next.",
    name: "Sandy Zhu",
    role: "Staff Product Designer at PathAI",
    avatar: "/about/avatar-sandy.jpeg",
  },
  {
    quote:
      "Mayank was a great addition to our design team at bb. His eagerness to learn and passion for visual design was evident in the quality of the work he produced. He built a design system with the help of team members by quickly adapting and understanding of our design standards and bringing fresh ideas to the table. I have no doubt that Mayank will continue to excel in his career and I highly recommend him for any design opportunities in the future.",
    name: "Abhiteja Vulapu",
    role: "Head of Design at BigBasket",
    avatar: "/about/avatar-abhiteja.png",
  },
  {
    quote:
      "Mayank is a very talented and dedicated designer who brings storytelling and visual communication to the fore. His ability to clearly articulate his thoughts and think rationally, made it a joy to work and have meaningful conversations with him. He is a quick learner and has an inquisitive mind that helped him learn and unlearn various concepts here at bigbasket - especially on the design system project.",
    name: "Raghav Vasudevan",
    role: "Senior Product Designer at BigBasket",
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
    alt: "My silhouette",
    ar: 1024 / 768,
  },
  {
    src: "/about/pto-3.jpg",
    alt: "Exploring the cenotes in Tulum",
    ar: 1696 / 2560,
  },
  {
    src: "/about/pto-4.png",
    alt: "Graduated with a smile",
    ar: 1905 / 2267,
  },
  {
    src: "/about/pto-5-boston.jpeg",
    alt: "Seaside chillin' in Boston",
    ar: 1920 / 2560,
  },
  {
    src: "/about/pto-6.jpeg",
    alt: "Trying to get one good picture at the end of the trip.",
    ar: 2006 / 2560,
  },
];
