import Image from "next/image";

const DATA_SOURCES = [
  {
    src: "/ikon/data-dictionary-logos/source-01.png?v=2",
    position: "dataDictionaryNodeOuterTop",
    contain: false,
  },
  {
    src: "/ikon/data-dictionary-logos/source-02.png?v=2",
    position: "dataDictionaryNodeOuterLeft",
    contain: false,
  },
  {
    src: "/ikon/data-dictionary-logos/source-03.png?v=2",
    position: "dataDictionaryNodeOuterRight",
    contain: false,
  },
  {
    src: "/ikon/data-dictionary-logos/source-04.png?v=2",
    position: "dataDictionaryNodeInnerTop",
    contain: false,
  },
  {
    src: "/ikon/data-dictionary-logos/source-05.png?v=2",
    position: "dataDictionaryNodeInnerLeft",
    contain: true,
  },
  {
    src: "/ikon/data-dictionary-logos/source-06.png?v=2",
    position: "dataDictionaryNodeInnerRight",
    contain: false,
  },
] as const;

/**
 * A thumbnail-sized system map: six source systems resolve into one shared
 * dictionary. The source marks are exact exports from the supplied Figma node.
 */
export default function DataDictionaryThumbnail() {
  return (
    <span className="dataDictionaryVisual" aria-hidden="true">
      <span className="dataDictionaryOrbit dataDictionaryOrbitOuter" />
      <span className="dataDictionaryOrbit dataDictionaryOrbitInner" />

      {DATA_SOURCES.map(({ src, position, contain }) => (
        <span className={`dataDictionaryNode ${position}`} key={src}>
          <Image
            className={contain ? "dataDictionaryLogoContain" : undefined}
            src={src}
            width={80}
            height={80}
            sizes="48px"
            unoptimized
            alt=""
          />
        </span>
      ))}

      <span className="dataDictionaryHub">
        <svg
          className="dataDictionaryDatabaseIcon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z" />
        </svg>
      </span>
    </span>
  );
}
