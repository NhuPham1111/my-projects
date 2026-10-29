import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HSK_THEME } from "../styles/hskTheme";

/** Shared end card shown after the vocabulary section in every video. */
export const HskOutroSlide: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const vertical = height > width;
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;
  const localFrame = frame - startFrame;
  const arrowBounce = Math.sin(localFrame / 8) * (vertical ? 7 : 5);
  const ctaSpring = spring({
    frame: localFrame - 30,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundImage: vertical
          ? HSK_THEME.backgrounds.vertical
          : HSK_THEME.backgrounds.landscape,
        color: HSK_THEME.colors.ink,
        fontFamily: HSK_THEME.fonts.vietnamese,
        alignItems: "center",
        justifyContent: "center",
        padding: vertical ? "8%" : "5% 10%",
        boxSizing: "border-box",
      }}
    >
      {/* Soft color panels add depth while keeping all text on a light surface. */}
      <div
        style={{
          position: "absolute",
          inset: vertical ? "3% 4%" : "4% 5%",
          border: `2px solid ${HSK_THEME.colors.gold}`,
          borderRadius: vertical ? 42 : 36,
          backgroundColor: "rgba(255, 253, 248, 0.3)",
          boxShadow: "0 18px 50px rgba(61, 54, 27, 0.16)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: layout.outroGap,
          padding: vertical ? "8% 4%" : "4% 7%",
          boxSizing: "border-box",
        }}
      >
        <Img
          src={staticFile("logo/logo-circle.png")}
          alt="Learn and Chill with Ami"
          style={{
            width: layout.outroLogoSize,
            height: layout.outroLogoSize,
            objectFit: "contain",
            borderRadius: "50%",
            backgroundColor: HSK_THEME.colors.white,
            boxShadow: "0 5px 18px rgba(61, 54, 27, 0.15)",
            opacity: interpolate(localFrame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(localFrame, [0, 12], [18, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px`,
          }}
        />

        <div
          style={{
            maxWidth: 1050,
            color: HSK_THEME.colors.ink,
            fontSize: layout.outroTitleFontSize,
            lineHeight: 1.25,
            fontWeight: 800,
            opacity: interpolate(localFrame, [10, 23], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(localFrame, [10, 23], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px`,
          }}
        >
          Cảm ơn bạn đã học cùng Ami!
        </div>
        <div
          style={{
            maxWidth: 1050,
            color: HSK_THEME.colors.muted,
            fontSize: layout.outroSubtitleFontSize,
            lineHeight: 1.4,
            fontWeight: 600,
            opacity: interpolate(localFrame, [16, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Hẹn gặp bạn ở bài tiếp theo nhé.
        </div>

        {/* The gentle moving arrow leads the eye to the follow call to action. */}
        <svg
          aria-label="Mũi tên hướng tới lời mời theo dõi"
          width={layout.outroArrowSize}
          height={layout.outroArrowSize}
          viewBox="0 0 64 64"
          style={{
            overflow: "visible",
            translate: `0px ${arrowBounce}px`,
            scale: `${1 + Math.sin(localFrame / 12) * 0.025}`,
            opacity: interpolate(localFrame, [22, 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <path
            d="M32 7v37M18 32l14 14 14-14"
            fill="none"
            stroke={HSK_THEME.colors.header}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: vertical ? "20px 44px" : "15px 38px",
            borderRadius: 999,
            backgroundColor: HSK_THEME.colors.panel,
            color: HSK_THEME.colors.white,
            border: `2px solid ${HSK_THEME.colors.gold}`,
            boxShadow: "0 8px 0 rgba(61, 80, 21, 0.18)",
            fontSize: layout.outroButtonFontSize,
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: 1,
            opacity: interpolate(localFrame, [26, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: `${0.82 + ctaSpring * 0.18}`,
          }}
        >
          <span
            aria-hidden="true"
            style={{ color: HSK_THEME.colors.introGold }}
          >
            ♥
          </span>
          Follow
        </div>
      </div>
    </AbsoluteFill>
  );
};
