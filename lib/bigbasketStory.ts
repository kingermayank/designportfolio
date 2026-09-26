/** Case-study copy and media from https://kingermayank.framer.website/work/bigbasket. */
export type StoryBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "image" | "video"; src: string; alt: string; caption: string };

export const bigbasketStory: { label: string; title: string; blocks: StoryBlock[] }[] = [
  {
    "label": "Problem",
    "title": "The team needed a robust design system and organized structure.",
    "blocks": [
      {
        "kind": "text",
        "text": "BigBasket was rapidly shipping new features, but without a consistent design language. Repeated UI work, inconsistent patterns, and slow collaboration increased delivery time and hurt usability across the customer app."
      },
      {
        "kind": "image",
        "src": "https://framerusercontent.com/images/fZCQf2zBuh0CBjm2iGBLQNYlYXU.png?width=3840&height=2160",
        "alt": "Inconsistent screens and UI patterns across the BigBasket app",
        "caption": "No design system = disconnected user experience"
      }
    ]
  },
  {
    "label": "Audit",
    "title": "Mapping the app before building the system.",
    "blocks": [
      {
        "kind": "text",
        "text": "We ran a full visual audit of the BigBasket app, documenting every component and foundation—colors, typography, spacing, and iconography. This helped us map what existed, identify inconsistencies, and uncover gaps that needed standardization."
      },
      {
        "kind": "image",
        "src": "https://framerusercontent.com/images/F6yVApFJLFcf4bgk3Y1BA01hUY8.png?width=1840&height=536",
        "alt": "Visual audit of BigBasket components and foundations",
        "caption": ""
      }
    ]
  },
  {
    "label": "Componentization",
    "title": "Building blocks before screens.",
    "blocks": [
      {
        "kind": "text",
        "text": "After auditing every screen across the product, we started grouping what we found into a structure that could actually scale. We organized everything into three layers that became the backbone of the system:"
      },
      {
        "kind": "list",
        "items": [
          "**Foundations** – the visual language (typography, color, spacing, iconography) that gives the product its identity",
          "**Components** – reusable UI building blocks like buttons, inputs, and tooltips",
          "**Patterns** – repeatable interaction structures like bottom sheets, empty states, and dialogs"
        ]
      },
      {
        "kind": "text",
        "text": "We knew that if we didn’t define these layers clearly, the system would fall apart later. So before jumping into components, I focused on getting the **foundations right**—starting with typography, iconography, and spacing."
      },
      {
        "kind": "image",
        "src": "https://framerusercontent.com/images/pZeZ6kZwNFf1AJcPKqNsKzSg.png?width=1786&height=1286",
        "alt": "Componentization process and design examples",
        "caption": ""
      },
      {
        "kind": "text",
        "text": "After establishing the visual language, creating new components became simpler because of the basic rules that we previously laid out. Every component that was added came with its own guidelines, specs and behavior based on any previous components it was made up from. Taking button as an example, we utilized our typography styles for the text, our color palette to determine the colors for every state, and spacing presets to ensure scalability to different sizes."
      },
      {
        "kind": "image",
        "src": "https://framerusercontent.com/images/RPDrSA1culJepypyb5d9mlc2Lk.png?width=1920&height=857",
        "alt": "Componentization process and design examples",
        "caption": "Button variations and interaction states"
      },
      {
        "kind": "video",
        "src": "https://framerusercontent.com/assets/MltYPjzeW5Cdc7jnG8Or2mIsFQ.mp4",
        "alt": "Componentization process and design examples",
        "caption": "Had different variants for each component"
      },
      {
        "kind": "text",
        "text": "While most components were unified, we decided to keep the native properties to maintain the familiarity associated with each platform. An example of this is our custom top navigation that adheres to native guidelines for iOS and Android but utilizes Melon's typography and iconography."
      },
      {
        "kind": "image",
        "src": "https://framerusercontent.com/images/6UNvaKsMaI8B8Mi4b8ItV65tRy0.png?width=1920&height=857",
        "alt": "Componentization process and design examples",
        "caption": "iOS and Android top navigation"
      },
      {
        "kind": "video",
        "src": "https://framerusercontent.com/assets/QIIkKh3QxwWiHtGmIPEIYdtG900.mp4",
        "alt": "Componentization process and design examples",
        "caption": "Shared component library used for creating high fidelity designs"
      },
      {
        "kind": "text",
        "text": "I got inspired by a design video and Brad Frost’s Atomic Design framework, and used a watermelon analogy—breaking it into skin, flesh, and seeds—to explain how a system can scale from simple building blocks. Since watermelon is one of BigBasket’s top-selling items and matched the brand colors, I pitched **Melon** as the name of our design system through a fun slide deck that explained the philosophy."
      },
      {
        "kind": "video",
        "src": "https://framerusercontent.com/assets/UHPncwZUzhRggAW69rd5HUVjs.mp4",
        "alt": "Componentization process and design examples",
        "caption": "I ended up presenting this deck 20+ times across the organization."
      }
    ]
  },
  {
    "label": "Documentation",
    "title": "Standards only work when they’re written.",
    "blocks": [
      {
        "kind": "text",
        "text": "We knew that good documentation and clear guidelines were key to making our design system successful and sustainable. This part of the process called for a lot of empathy—after all, the goal was to make things easier for everyone using the system."
      },
      {
        "kind": "video",
        "src": "https://framerusercontent.com/assets/hMrZ12h44h3fNmEzd9oHtR8eWk.mp4",
        "alt": "Documentation process and design examples",
        "caption": "Template for documentation structure & guidelines"
      },
      {
        "kind": "text",
        "text": "To help, we created and regularly updated documentation right inside the Figma file. This included everything from design principles to quick-start guides and best practices for designing and testing components. While the details varied slightly for each component and pattern, the documentation was always clear, detailed, and easy to follow."
      },
      {
        "kind": "video",
        "src": "https://framerusercontent.com/assets/huKt7P3keTaP50sc4mnznPPnd3k.mp4",
        "alt": "Documentation process and design examples",
        "caption": "A clickable prototype of the documentation"
      }
    ]
  },
  {
    "label": "Impact",
    "title": "Adopted org-wide by 200+ engineers and product teams.",
    "blocks": [
      {
        "kind": "text",
        "text": "I built and launched the company’s first design system, improving design–dev collaboration, speeding up delivery, and creating a unified product experience across teams. Here are some key highlights:"
      },
      {
        "kind": "list",
        "items": [
          "Audited **250+** UI components across the product ecosystem.",
          "Designed and shipped v1 of the reusable component library + guidelines.",
          "Improved design-to-dev handoff efficiency by **~35%**.",
          "Increased UI consistency and reduced design debt.",
          "Led onboarding and training sessions for 15+ designers and engineers.",
          "Adopted by **200+** product and engineering team members."
        ]
      }
    ]
  },
  {
    "label": "Takeaways",
    "title": "The real work happens outside Figma.",
    "blocks": [
      {
        "kind": "text",
        "text": "This was my first official product design internship, working with a professional design team, and it challenged me to grow in ways no classroom or tutorial ever could. I learned that real product design isn’t just about creating interfaces—it’s about clarity, trust, and teamwork."
      },
      {
        "kind": "list",
        "items": [
          "**Design systems go beyond components** — Learned how to build and scale a design system, create flexible components, distribute a shared library, and drive adoption across teams.",
          "**Documentation is leverage** — Discovered the importance of leaving clear notes and decisions behind to prevent confusion, unblock teams, and scale knowledge.",
          "**Influence matters more than ideas** — Learned how to earn buy-in, defend design decisions, and communicate value to stakeholders to move work forward."
        ]
      }
    ]
  }
];
