import CaseStudyLightboxMedia from "@/components/CaseStudyLightboxMedia";
import { boldRuns } from "@/lib/richText";
import {
  toolboxJourney,
  toolboxJourneyIntro,
  type ToolboxJourneyImage,
  type ToolboxJourneyVideo,
} from "@/lib/toolboxJourney";

function emphasizedText(text: string) {
  return boldRuns(text).map((run, index) =>
    run.bold ? <strong key={index}>{run.text}</strong> : run.text,
  );
}

function JourneyImage({ image }: { image: ToolboxJourneyImage }) {
  return (
    <figure className="pathaiStoryFigure toolboxJourneyFigure">
      <div className="pathaiStoryFrame">
        <CaseStudyLightboxMedia
          src={image.src}
          alt={image.alt}
          className="pathaiStoryAsset"
        />
      </div>
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

function JourneyVideo({ video }: { video: ToolboxJourneyVideo }) {
  return (
    <figure className="pathaiStoryFigure toolboxJourneyFigure">
      <div className="pathaiStoryFrame">
        <CaseStudyLightboxMedia
          src={video.src}
          alt={video.caption}
          video
          className="pathaiStoryAsset"
        />
      </div>
      {video.caption ? <figcaption>{video.caption}</figcaption> : null}
    </figure>
  );
}

export default function ToolboxProductJourney() {
  return (
    <article className="pathaiStory toolboxJourney" aria-label="Toolbox project background">
      <header className="toolboxJourneyIntro">
        <span className="pathaiStoryIndex">{toolboxJourneyIntro.label}</span>
        <h2>{toolboxJourneyIntro.title}</h2>
        <div>
          <p>{toolboxJourneyIntro.paragraphs[0]}</p>
          <JourneyImage image={toolboxJourneyIntro.image} />
          <p>{toolboxJourneyIntro.paragraphs[1]}</p>
        </div>
      </header>
      {toolboxJourney.map((section) => (
        <section key={section.label} className="pathaiStorySection">
          <div className="pathaiStorySectionHead">
            <span className="pathaiStoryIndex">{section.label}</span>
            <h2>{section.title}</h2>
          </div>
          <div className="pathaiStorySectionBody">
            {section.blocks.map((block, index) => {
              if (block.kind === "text") {
                return <p key={index}>{emphasizedText(block.text)}</p>;
              }
              if (block.kind === "list") {
                return (
                  <ul key={index} className="bigbasketStoryList toolboxJourneyList">
                    {block.items.map((item) => <li key={item}>{emphasizedText(item)}</li>)}
                  </ul>
                );
              }
              if (block.kind === "video") {
                return <JourneyVideo key={block.src} video={block} />;
              }
              return <JourneyImage key={block.src} image={block} />;
            })}
          </div>
        </section>
      ))}
    </article>
  );
}
