export type ToolboxJourneyImage = {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
};

export type ToolboxJourneyVideo = {
  kind: "video";
  src: string;
  caption?: string;
};

export type ToolboxJourneyBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | ToolboxJourneyImage
  | ToolboxJourneyVideo;

export const toolboxJourneyIntro = {
  label: "Context",
  title: "Ikon connects vehicle data to inventory, asset protection, and daily dealership operations.",
  paragraphs: [
    "Ikon is a vehicle telematics company. Its hardware devices plug into dealership vehicles and continuously capture signals such as location, movement, mileage, battery health, diagnostic codes, and installation status.",
    "Toolbox is the software layer that turns those signals into something dealership teams can use. It helps them locate vehicles and keys, monitor inventory health, manage devices, support service operations, and act on customer opportunities from one platform.",
  ],
  image: {
    kind: "image" as const,
    src: "/toolbox/toolbox%20cases/context.png",
    alt: "Ikon GPS device connecting to a vehicle's OBD-II port",
    caption: "Ikon's connected hardware turns vehicle signals into operational data.",
  },
};

export const toolboxJourney: {
  label: string;
  title: string;
  blocks: ToolboxJourneyBlock[];
}[] = [
  {
    label: "01 Building the foundation",
    title: "From fragmented tools to one connected platform.",
    blocks: [
      {
        kind: "text",
        text: "Legacy split vehicle tracking, key management, device pairing, reporting, and administration across separate tools, slowing test drives and making inventory harder to protect.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/legacy.png",
        alt: "Ikon's Legacy dealership map interface",
        caption: "Ikon's legacy dealer portal, which had a lot of severe usability issues.",
      },
      {
        kind: "text",
        text: "As one of the early designers on NextGen, I learned the domain, spoke with dealership teams and internal stakeholders, mapped workflows, and turned recurring pain points into product experiences. **Legacy gave us the requirements of the business. It did not have to define the solution.**",
      },
      {
        kind: "text",
        text: "Managers needed administrative and tracking tools at their desks, while salespeople, technicians, and lot attendants needed mobile tools to find and pair vehicles and keys.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/process.png",
        alt: "Workflow mapping and dealership research sessions",
      },
      {
        kind: "text",
        text: "We brought those workflows together around one product model. Over time, I worked across inventory, maps, vehicle details, keys, devices, geofences, dashboards, reports, staff, installation, and administration. **It was not one redesign moment. It was hundreds of decisions that gradually became a platform.**",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/nextgen.png",
        alt: "Unified Toolbox experience across web and mobile",
        caption: "The NextGen platform unified the core experience across the web and mobile.",
      },
    ],
  },
  {
    label: "02 Navigating disruption",
    title: "Stepping into the gaps when ownership changed.",
    blocks: [
      {
        kind: "text",
        text: "When NextGen launched in beta, we piloted it with one dealership. The release exposed slow performance, unreliable data, and deeper technical issues across the platform. The poor response triggered a leadership reset across product, design, and engineering, followed by a major refactor from microservices to a monolith. With new engineering leadership focused on stabilizing the platform, net-new product work paused and my design role narrowed to development support.",
      },
      {
        kind: "text",
        text: "Rather than wait for design work to return, I stepped into the gaps. I took on a hybrid product and design role, working with engineering and data to triage urgent issues, translate ambiguity into priorities, write tickets and pull requests, coordinate across operations, sales, and leadership, and keep Legacy running while NextGen was rebuilt.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/data.webp",
        alt: "External and internal data sources supporting the Toolbox platform",
        caption: "Turning connected data into useful dealership intelligence.",
      },
      {
        kind: "text",
        text: "During this phase, I worked wherever the business had gaps:",
      },
      {
        kind: "list",
        items: [
          "Unified company data across teams and uncovered roughly $72K in annual savings by identifying duplicate vendor spend.",
          "Mapped the device lifecycle across accounting, operations, the warehouse, and dealerships, creating the blueprint consultants used to begin our warehouse transformation.",
          "Aligned sales, operations, leadership, and product around one definition of success by mapping and instrumenting web and mobile workflows against shared HEART goals.",
          "Partnered with Stella AI to automate service outreach from customer identification through live scheduling and booking, with people handling only the exceptions.",
        ],
      },
      {
        kind: "text",
        text: "This work expanded my understanding of Ikon beyond its users and product into the technical architecture, data ecosystem, and the way internal teams operated across the business. I increasingly worked as a business analyst, connecting systems, processes, people, and priorities to uncover gaps and opportunities. That perspective earned me influence beyond design. I managed stakeholders and executive expectations, created clarity across teams, and protected the team from organizational noise so it could keep delivering.",
      },
    ],
  },
  {
    label: "03 Becoming a design super IC",
    title: "Returning to the craft with a wider operating range.",
    blocks: [
      {
        kind: "text",
        text: "Six months later, the refactor was complete and NextGen relaunched. With a stable platform in market, the conversation shifted from recovery to what came next: which features to build, which opportunities to pursue, and how the product should evolve.",
      },
      {
        kind: "text",
        text: "We also brought in dedicated product leadership. By then, the organizational knowledge and credibility I had earned gave me the leverage to transition back into a product designer and builder role, partnering with the new leadership to shape the next phase of Toolbox.",
      },
      {
        kind: "text",
        text: "At the same time, AI models were becoming far more capable, and vibe coding had become part of my daily practice. That combination led me to take on Ikon's research and innovation initiatives, using AI to prototype new workflows and explore how Toolbox could move from reporting what was happening to recommending and eventually taking the next action.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/ai.png",
        alt: "AI-driven revenue orchestration across dealership data and communication channels",
        caption: "An AI-native model connects dealership data, decisions, and customer communication.",
      },
      {
        kind: "text",
        text: "One of the biggest new initiatives I led started with a simple question: Ikon already collected valuable vehicle data, but how could we use it to power data-driven marketing, improve customer retention, and generate service revenue for dealers?",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/atlas.png",
        alt: "Ask AI dashboard concept for dealership operations",
        caption: "Ask AI turns dealership signals into clear next steps.",
      },
      {
        kind: "text",
        text: "We combined deterministic location signals from Ikon's hardware with operational data and AI to surface the customers and revenue opportunities that needed attention, then help dealerships send targeted outreach designed to bring them back for service.",
      },
      {
        kind: "text",
        text: "As NextGen and its spin-off products spread across different front-end stacks, the UI began drifting toward the fragmentation we faced in Legacy. Dealer feedback also showed that the green navigation clashed with manufacturer identities such as Toyota and Honda, so we reskinned the product with a centralized system and a more neutral palette that preserved Ikon's brand.",
      },
      {
        kind: "text",
        text: "I led Shift Design System 2.0, rebuilding the shared tokens, React components, documentation, and agent guidance needed for NextGen's next phase.",
      },
      {
        kind: "video",
        src: "/toolbox/grid/shift-design-system.mp4",
        caption: "One product language for people, AI agents, and production.",
      },
      {
        kind: "text",
        text: "To move ideas like these from concept to implementation, I hand off working React prototypes instead of stopping at static frames. AI helps me move quickly from product thinking to functional interactions that teams can test, critique, and build from.",
      },
      {
        kind: "list",
        items: [
          "PMs can turn early ideas into realistic zero-to-one prototypes.",
          "Designers can explore and validate interactions with real product components.",
          "Engineers and AI agents can inspect behavior and build from the same shared system.",
        ],
      },
      {
        kind: "text",
        text: "I continue to build internal tools and the underlying infrastructure that help teams do their best work.",
      },
    ],
  },
  {
    label: "Learnings",
    title: "The culture is built in the details.",
    blocks: [
      {
        kind: "text",
        text: "My path at Ikon has been unconventional and nonlinear. I have introduced rituals, workflows, and processes, then learned when to evolve or let them go. I have worn different hats and worked with different leaders through every stage of the company, taking whatever steps were needed to create meaningful business impact. The experience has made me a stronger designer and builder.",
      },
      {
        kind: "list",
        items: [
          "**Know when to push:** Build the judgment and resilience to keep important work moving through uncertainty.",
          "**Lead and build at the same time:** Keep product direction grounded while staying close to execution and holding the bar for craft.",
          "**Vibe coding as a strategy alignment tool:** Build quick proofs of concept that give ideas visual conviction, then use tight feedback loops to pressure-test, rapidly iterate, and improve the product.",
        ],
      },
    ],
  },
];
