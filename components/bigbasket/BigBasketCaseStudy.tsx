import CaseStudyLightboxMedia from "@/components/CaseStudyLightboxMedia";
import { bigbasketStory } from "@/lib/bigbasketStory";
import { boldRuns } from "@/lib/richText";

function emphasizedText(text: string) {
  return boldRuns(text).map((run, index) =>
    run.bold ? <strong key={index}>{run.text}</strong> : run.text,
  );
}

export default function BigBasketCaseStudy() {
  return (
    <article className="pathaiStory bigbasketStory" aria-label="BigBasket case study">
      {bigbasketStory.map((section) => (
        <section key={section.label} className="pathaiStorySection">
          <div className="pathaiStorySectionHead">
            <span className="pathaiStoryIndex">{section.label}</span>
            <h2>{section.title}</h2>
          </div>
          <div className="pathaiStorySectionBody">
            {section.blocks.map((block, index) => {
              if (block.kind === "text") return <p key={index}>{emphasizedText(block.text)}</p>;
              if (block.kind === "list") {
                return <ul key={index} className="bigbasketStoryList">{block.items.map((item) => <li key={item}>{emphasizedText(item)}</li>)}</ul>;
              }
              return (
                <figure key={index} className="pathaiStoryFigure">
                  <div className="pathaiStoryFrame">
                    <CaseStudyLightboxMedia
                      src={block.src}
                      alt={block.alt}
                      video={block.kind === "video"}
                      className="pathaiStoryAsset"
                    />
                  </div>
                  {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}
