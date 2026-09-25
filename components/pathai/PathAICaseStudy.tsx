import DeferredImage from "@/components/DeferredImage";
import DeferredVideo from "@/components/DeferredVideo";
import type { ReactNode } from "react";

const archive = "/pathai/archive";
const caseStudyAssets = "/pathai/pathai-case study";

function Figure({
  src,
  alt,
  caption,
  video = false,
}: {
  src: string;
  alt: string;
  caption: string;
  video?: boolean;
}) {
  const assetSrc = src.startsWith("/") ? src : `${archive}/${src}`;
  return (
    <figure className="pathaiStoryFigure">
      <div className="pathaiStoryFrame">
        {video ? (
          <DeferredVideo src={assetSrc} activation="visible" className="pathaiStoryAsset" />
        ) : (
          <DeferredImage src={assetSrc} alt={alt} className="pathaiStoryAsset" />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pathaiStorySection">
      <div className="pathaiStorySectionHead">
        <span className="pathaiStoryIndex">{label}</span>
        <h2>{title}</h2>
      </div>
      <div className="pathaiStorySectionBody">{children}</div>
    </section>
  );
}

export default function PathAICaseStudy() {
  return (
    <article className="pathaiStory" aria-label="PathAI case study">
      <Section label="Problem" title="Pathologists lack a fast, reliable way to get second opinions.">
        <p>
          Pathologists currently lack an efficient, reliable way to collaborate when they need a second opinion, especially on complex cases. Cases like these still rely heavily on expert judgment to ensure accuracy, but without a dedicated workflow for collaboration, they are forced to rely on slow workarounds. Today, the most common method is sending screenshots over email or sharing accession numbers, a manual, disconnected process that delays critical decisions and increases the risk of miscommunication.
        </p>
        <p>
          In high-stakes cases (e.g. possible cancer), delays in diagnosis can directly affect patient outcomes, making speed and accuracy critical.
        </p>
        <Figure src={`${caseStudyAssets}/Problem.png`} alt="PathAI problem statement and diagnostic workflow" caption="Such delays can put patient lives at risk." />
      </Section>

      <Section label="Research" title="Understanding how pathologists seek second opinions today.">
        <p>
          To understand how pathologists collaborate today, I began with organizational research and aligned with my PM on the problem scope. We decided to focus on informal (curbside) consultations, since they are the most frequent and high-friction part of the workflow.
        </p>
        <p>
          To learn how these consultations happen in the real world and how we might bring them into the platform, I partnered with a senior design researcher to create a decision guide and conducted five semi-structured interviews with pathologists. I captured key observations and workflow insights in Airtable so they could scale across teams and inform future design decisions.
        </p>
        <p>
          As patterns began to emerge from the interviews, it became clear that collaboration is a fundamental part of a pathologist&apos;s workflow, much like how we as designers seek feedback on our work. As I dug deeper, I was able to identify a few key insights in collaboration that directly informed design requirements for the solution.
        </p>
        <Figure src={`${caseStudyAssets}/research.png?v=2`} alt="PathAI research and user interview exploration" caption="" />
        <h3 className="pathaiStorySubhead">Key research insights.</h3>
        <Figure src={`${caseStudyAssets}/insights.png?v=3`} alt="Key research insights from pathologist interviews" caption="" />
        <p>These findings laid the foundation for the design direction and directly informed the trade-offs and product decisions that followed.</p>
      </Section>

      <Section label="Visual Explorations" title="Turning workflow insights into design direction.">
        <p>
          I began with interaction and visual exploration, gathering UI references for fast decision-making—quick actions, canned messaging, and inline commenting. This workflow research informed my initial design explorations and prototypes.
        </p>
        <p>
          I translated research insights into rapid UI explorations and prototypes, testing how different interaction models supported speed, context, and collaborative clarity.
        </p>
        <p>
          I explored with multiple card layouts, experimenting based on metadata such as author, slide number, timestamps, and titles). These explorations helped define what information needed to be prioritized to help pathologists quickly identify relevant comments.
        </p>
        <Figure src={`${caseStudyAssets}/visual exploration.png?v=2`} alt="PathAI visual exploration references" caption="" />
        <Figure src={`${caseStudyAssets}/Visual exploration cards.png?v=2`} alt="Early comment card explorations" caption="It took nearly 20 design iterations to make the comment card truly contextual and intuitive for pathologists." />
      </Section>

      <Section label="Key Design Decisions" title="Preserving context while designing for focus.">
        <div className="pathaiStoryDecision">
          <p>
            <strong>Initial assumption:</strong> A centered pop-up modal would create a focused commenting experience.
          </p>
          <p><strong>Insight from testing:</strong> Pathologists felt visually “disconnected” from the tissue while typing. They needed to keep the full slide visible to preserve diagnostic context.</p>
          <p><strong>Decision:</strong> Relocate the commenting experience into a left slide panel, anchoring it spatially to the viewer.</p>
          <p><strong>Impact:</strong> Preserved diagnostic context and reduced cognitive switching, leading to higher accuracy and smoother commenting flow.</p>
        </div>
        <Figure src={`${caseStudyAssets}/Iteration.png?v=4`} alt="Iterations from modal pop-ups to inline slide annotations" caption="Iterated from modal pop-ups to inline slide annotations based on usability testing." />
        <div className="pathaiStoryDecision">
          <h3>Pivoting the project direction to unlock new use cases.</h3>
          <p>
            <strong>Trigger:</strong> During a design review, my PM challenged the narrow focus on consults, asking whether the feature could serve other collaborative moments.
          </p>
          <p><strong>Decision:</strong> Expand the use cases to support QA, teaching, tumor boards, and research — all of which involved annotating regions and sharing insights.</p>
          <p><strong>Trade-off:</strong> This pivot meant revisiting the naming, structure, and UI model to ensure flexibility across workflows, delaying handoff slightly but creating longer-term scalability.</p>
          <p><strong>Impact:</strong> The feature evolved into Region Comments, a universal, region-anchored annotation tool which can be widely adopted beyond its original intent and used across multiple clinical teams.</p>
        </div>
        <Figure src={`${caseStudyAssets}/pivot.png?v=3`} alt="Evolution from consultations to region-based comments" caption="Pivoted from a chat-style consultation tool to a slide-specific annotation tool." />
        <div className="pathaiStoryDecision">
          <h3>Making trade-offs to ship on time.</h3>
          <p>
            <strong>Trade-off:</strong> Notification features like @mentions and email notifications depended on another team&apos;s stack and risked derailing our launch timeline.
          </p>
          <p><strong>Decision:</strong> Ship v1 with a simpler manual link-sharing flow, then schedule integrations for v1.1 once dependencies aligned.</p>
          <p><strong>Why:</strong> Our priority was to test adoption and value quickly rather than delay for full parity.</p>
          <p><strong>Impact:</strong> The lean release helped maintain momentum, gather real user feedback early, and prove measurable time-savings — strengthening the case for future investment. lso to meet our prompose of putting this in Q3 version</p>
        </div>
        <Figure src={`${caseStudyAssets}/Design Tradeoffs.png?v=4`} alt="Design trade-offs for the first release" caption="Design trade-offs; deferred @mentions and email integration to v1.1" />
      </Section>

      <Section label="Solution" title="Region Comments: fast, traceable, &amp; contextual collaboration at slide level.">
        <p>
          A contextual, traceable collaboration layer directly on digital slides. Pathologists could draw a region, leave a note, and start a discussion—all within the viewer.
        </p>
        <p><strong>For the sender:</strong> Quick markups replace lengthy emails.</p>
        <p><strong>For the receiver:</strong> Clicking the comment zooms to the exact tissue region.</p>
        <p><strong>Outcome:</strong> Faster decisions, less context loss, and higher diagnostic confidence.</p>
        <Figure src={`${caseStudyAssets}/Solution.png?v=3`} alt="Proposed solution workflow for creating and receiving region-based comments" caption="Proposed solution workflow: creating and receiving region-based comments." />
        <div className="pathaiStoryPair">
          <Figure src="workflow-create.mp4" alt="" caption="Creation workflow" video />
          <Figure src="workflow-receive.mp4" alt="" caption="Receiving workflow" video />
        </div>
        <h3>Handing off production-ready design files</h3>
        <p>
          During handoff, I documented detailed design specifications for engineering, including user flows, interaction behaviours, region magnification rules, and edge cases across single and multi-slide accessions—such as bounding while typing, comment limits, and handling incomplete comments when a user exits mid-action.
        </p>
        <div className="pathaiStoryPair">
          <Figure src={`${caseStudyAssets}/Edge cases.png?v=3`} alt="Region interaction edge cases" caption="Edge-cases; region interaction states" />
          <Figure src="spec-sheet.png" alt="Region Comments component specifications" caption="Card component spec sheet" />
        </div>
      </Section>

      <Section label="Impact" title="Reduced diagnostic turnaround time by 45%">
        <p>
          Region Comments became the foundation for collaborative review across PathAI&apos;s diagnostic product suite. After the Q4 2022 beta launch, the team noticed:
        </p>
        <p><strong>Faster diagnostic turnaround and higher throughput:</strong> Reduced consult and second-opinion turnaround time by ~45%, allowing pathologists to sign out more cases per day with less context switching. The efficiency gains freed up time for deeper review of complex specimens and improved overall department capacity.</p>
        <p><strong>Expanded product usage across workflows:</strong> Adoption quickly grew beyond consult workflows—teams began using it organically for QA, tumor boards, teaching sessions, and research review. The feature became a central part of multi-disciplinary collaboration.</p>
        <p><strong>Lowered barriers for junior pathologists:</strong> By making expert input more accessible and structured, the feature reduced the intimidation and friction of asking for help. Junior pathologists could get senior-level feedback faster, improving confidence and training quality.</p>
        <div className="pathaiStoryOutcomes">
          <div><strong>~45%</strong><span>Faster second opinions</span></div>
          <div><strong>More uses</strong><span>QA, tumor boards, teaching, and research</span></div>
          <div><strong>Less friction</strong><span>Easier access to senior feedback</span></div>
        </div>
      </Section>

      <Section label="Reflections" title="What I learned in a complex, specialized domain.">
        <p>
          In retrospect, my summer at PathAI was both challenging and fulfilling, preparing me for the "real world". My manager and mentor gave me the nudges I needed to continue moving forward while also giving me the autonomy to do my own research, iterations, prototyping, and design feature presentation. Here are some highlights:
        </p>
        <p><strong>Be people productive</strong> - Wherever you go, you’ll find people eager to share knowledge, give feedback, and connect. Some of my most memorable moments at PathAI came from one-on-one interactions. Seek feedback, ask questions, and stay curious—it’s a great way to grow.</p>
        <p><strong>Embrace ambiguity</strong> - The most challenging project I worked on pushed me to adapt to constant changes in a fast-paced environment. It taught me how to thrive amidst uncertainty, honing my ability to navigate shifting demands.</p>
        <p><strong>Manage expectations</strong> - Set clear expectations early, especially when the work expands beyond its original scope. Being transparent about trade-offs helped me build trust and keep the project moving.</p>
      </Section>
    </article>
  );
}
