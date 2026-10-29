import type { CSSProperties } from "react";
import { HSK_THEME } from "./hskTheme";

/** Reusable panel surface variants shared by the quiz timeline. */
export type HskPanelSurface = "preview" | "thinking" | "transcript";

type PanelSurfaceStyle = Pick<CSSProperties, "backgroundColor" | "border">;

const panelSurfaces: Record<HskPanelSurface, PanelSurfaceStyle> = {
  preview: {
    backgroundColor: HSK_THEME.colors.panel,
    border: `2px solid ${HSK_THEME.colors.panelBorder}`,
  },
  thinking: {
    backgroundColor: "transparent",
    border: "none",
  },
  // Replay transcript and answer translation intentionally share one surface.
  transcript: {
    backgroundColor: HSK_THEME.colors.transcriptPanel,
    border: `2px solid ${HSK_THEME.colors.transcriptBorder}`,
  },
};

/** Return a shared surface style while each component controls its own layout. */
export const getHskPanelSurface = (
  surface: HskPanelSurface,
): PanelSurfaceStyle => panelSurfaces[surface];
