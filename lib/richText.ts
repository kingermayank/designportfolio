/** Splits a line on `**bold**` runs for renderers that emphasise a metric. */
export type TextRun = { text: string; bold: boolean };

export function boldRuns(line: string): TextRun[] {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**")
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
}
