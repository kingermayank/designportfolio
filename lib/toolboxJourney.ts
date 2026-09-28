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
        caption: "Legacy unified critical dealership workflows but could not scale.",
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
        caption: "NextGen unified the core experience across web and mobile.",
      },
    ],
  },
  {
    label: "02 Navigating disruption",
    title: "Stepping into the gaps when ownership changed.",
    blocks: [
      {
        kind: "text",
        text: "NextGen was still being built when performance issues led to changes across product and design leadership. I had joined as a designer supporting development, but the transition created gaps in ownership at the same time that Legacy still demanded daily attention.",
      },
      {
        kind: "text",
        text: "I volunteered to step into a more strategic role. I kept NextGen moving while helping manage the operational chaos around Legacy, translating urgent requests into clear priorities, writing tickets and pull requests, coordinating across engineering, operations, sales, and leadership, and managing expectations around what the team could deliver.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/data.webp",
        alt: "External and internal data sources supporting the Toolbox platform",
        caption: "Turning connected data into useful dealership intelligence.",
      },
      {
        kind: "text",
        text: "The work was often less about producing another polished screen and more about creating enough clarity for the organization to move. I used data to challenge assumptions, helped define success metrics, supported migration planning, and balanced immediate customer commitments with the long-term direction of the platform.",
      },
      {
        kind: "text",
        text: "This period taught me how to work through ambiguity, communicate with executives, coordinate teams with different incentives, and protect confidence in the product while the organization changed around it. **I was still a designer, but I had become someone the business could rely on to keep the product moving.**",
      },
    ],
  },
  {
    label: "03 Becoming a design super IC",
    title: "Returning to the craft with a wider operating range.",
    blocks: [
      {
        kind: "text",
        text: "After operating as a product management and design hybrid, I moved back toward an individual contributor role with a much broader view of the business. I am now helping evolve Toolbox from software that reports what is happening into an AI-native operating system that understands dealership activity, recommends what to do next, and can increasingly act on those insights.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/ai.png",
        alt: "AI-driven revenue orchestration across dealership data and communication channels",
        caption: "An AI-native model connects dealership data, decisions, and customer communication.",
      },
      {
        kind: "text",
        text: "The Ask AI feature brings that model into daily dealership operations. It uses telematics and operational data to surface the vehicles, customers, and revenue opportunities that need attention first.",
      },
      {
        kind: "image",
        src: "/toolbox/toolbox%20cases/atlas.png",
        alt: "Ask AI dashboard concept for dealership operations",
        caption: "Ask AI turns dealership signals into clear next steps.",
      },
      {
        kind: "text",
        text: "The service customer retention tool uses deterministic location signals to identify meaningful customer behavior, then helps dealerships send targeted outreach campaigns that bring customers back and recover service revenue.",
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
        text: "I returned to design as a stronger individual contributor, one who can understand the strategy, shape the experience, and help ship it.",
      },
    ],
  },
];
