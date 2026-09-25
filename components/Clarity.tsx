"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = "ynqxhvkhgx";

/** Microsoft Clarity session recordings and heatmaps. */
export default function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init(PROJECT_ID);
  }, []);

  return null;
}
