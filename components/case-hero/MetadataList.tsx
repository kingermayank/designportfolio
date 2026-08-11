export type MetadataItem = {
  label: string;
  value: string;
};

export type MetadataTags = {
  label: string;
  values: string[];
};

export type MetadataListProps = {
  /** Label/value rows, rendered in order and separated by hairlines. */
  items: MetadataItem[];
  /** Optional full-width trailing row for list-shaped values. */
  tags?: MetadataTags;
  className?: string;
};

/**
 * Definition list for the case metadata (role, timeframe, tools…).
 * Each item stacks its label above its value, left-aligned.
 */
export default function MetadataList({ items, tags, className }: MetadataListProps) {
  if (!items.length && !tags?.values.length) return null;

  return (
    <dl className={"chMeta" + (className ? ` ${className}` : "")}>
      {items.map((item) => (
        <div className="chMetaRow" key={item.label}>
          <dt className="chMetaLabel">{item.label}</dt>
          <dd className="chMetaValue">{item.value}</dd>
        </div>
      ))}

      {tags?.values.length ? (
        <div className="chMetaTags">
          <dt className="chMetaTagsLabel">{tags.label}</dt>
          <dd>
            <ul className="chMetaTagsList">
              {tags.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
