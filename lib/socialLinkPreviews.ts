/** Profile header captures. */
export const SOCIAL_LINK_PREVIEWS: Record<string, {
  previewImage: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  previewTitle: string;
  previewWidth?: number;
}> = {
  "X/Twitter": {
    previewImage: "/social/profiles/x.jpg",
    imageAlt: "Mayank Kinger on X",
    imageWidth: 600, imageHeight: 438, previewWidth: 277.2,
    previewTitle: "@kingermayank",
  },
  LinkedIn: {
    previewImage: "/social/profiles/linkedin.jpg",
    imageAlt: "Mayank Kinger on LinkedIn",
    imageWidth: 1200, imageHeight: 740, previewWidth: 277.2,
    previewTitle: "Mayank Kinger",
  },
  Substack: {
    previewImage: "/social/profiles/substack.jpg",
    imageAlt: "NextGen Designer on Substack",
    imageWidth: 1280, imageHeight: 690, previewWidth: 277.2,
    previewTitle: "NextGen Designer",
  },
  Github: {
    previewImage: "/social/profiles/github.jpg",
    imageAlt: "Mayank Kinger on GitHub",
    imageWidth: 1232, imageHeight: 610, previewWidth: 277.2,
    previewTitle: "kingermayank",
  },
  Resume: {
    previewImage: "/resume/mayank-kinger.webp",
    imageAlt: "Mayank Kinger’s résumé",
    imageWidth: 1563, imageHeight: 2200, previewWidth: 240,
    previewTitle: "Resume",
  },
};
