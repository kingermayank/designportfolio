export const PATHAI_PRESS_URL = "https://www.pathai.com/news/pathai-launches-new-pathologist-centric-features-on-aisight-to-enable-efficient-case-review-through-intelligent-case-prioritization-and-real-time-multi-institut";

const WEBSITE_PREVIEW_SIZE = { previewWidth: 288, previewAspectRatio: 16 / 9 };

const previews: Record<string, { previewImage: string; imageAlt: string; imageWidth: number; imageHeight: number }> = {
  "https://www.warpbnb.com/": {
    previewImage: "/previews/websites/warpbnb-16x9.jpg",
    imageAlt: "WarpBnB website: time travel stays",
    imageWidth: 1280, imageHeight: 720,
  },
  "https://walkity.vercel.app/": {
    previewImage: "/previews/websites/walkity-16x9.jpg",
    imageAlt: "Walkity website: Feel your way forward",
    imageWidth: 1280, imageHeight: 720,
  },
  [PATHAI_PRESS_URL]: {
    previewImage: "/previews/websites/pathai-press-16x9.jpg",
    imageAlt: "PathAI press release announcing new pathologist-centric AISight features",
    imageWidth: 1280, imageHeight: 720,
  },
  "https://builtbydesigners.com/projects/warpbnb/": {
    previewImage: "/previews/websites/builtbydesigners-16x9.jpg",
    imageAlt: "WarpBnB featured on Built by Designers",
    imageWidth: 1280, imageHeight: 720,
  },
};

export function websiteLinkPreview(href: string) {
  const preview = previews[href];
  return preview ? { ...preview, ...WEBSITE_PREVIEW_SIZE } : undefined;
}
