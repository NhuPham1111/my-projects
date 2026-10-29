import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import type { HskQuestion } from "../data/questions";
import { HSK_THEME } from "../styles/hskTheme";

export const HskIntroSlide: React.FC<{ question: HskQuestion }> = ({
  question,
}) => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: vertical
          ? HSK_THEME.backgrounds.vertical
          : HSK_THEME.backgrounds.landscape,
        fontFamily: HSK_THEME.fonts.intro,
        color: HSK_THEME.colors.introText,
      }}
    >
      {/* Intro area: the central brown title band. */}
      <div
        style={{
          position: "absolute",
          top: vertical ? "18.2%" : "15%",
          left: 0,
          width: "100%",
          height: vertical ? "49.2%" : "70%",
          backgroundColor: HSK_THEME.colors.introBand,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Header: logo and bilingual brand name */}
          <div
            style={{
              position: "absolute",
              // Keep the title block away from the screen edges in TikTok's
              // vertical layout, where interface buttons can cover the sides.
              left: vertical ? "8%" : "18%",
              top: vertical ? "9.5%" : "10%",
              width: vertical ? "85%" : "64%",
              height: vertical ? "21%" : "23%",
              border: `${vertical ? 3 : 2}px solid ${HSK_THEME.colors.gold}`,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box",
              padding: vertical ? "0 1.5%" : "0 2%",
            }}
          >
            <Img
              src={staticFile("logo/logo-circle.png")}
              alt="Learn and Chill with Ami"
              style={{
                width: vertical ? "19%" : "15%",
                height: "auto",
                translate: vertical ? "-10px 0.2px" : "-40px 0.2px",
                scale: vertical ? 0.98 : 0.95,
              }}
            />
            <div style={{ flex: 1, textAlign: "center", padding: "0 1%" }}>
              <div
                style={{
                  fontSize: vertical ? 68 : 64,
                  fontWeight: 700,
                  letterSpacing: vertical ? 7 : 8,
                  whiteSpace: "nowrap",
                }}
              >
                精讲精练 HSK
                <span style={{ fontFamily: "ui-sans-serif" }}>5</span>
              </div>
              <div
                style={{
                  marginTop: vertical ? 4 : 2,
                  fontSize: vertical ? 36 : 38,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  lineHeight: "1.8",
                }}
              >
                TINH GIẢNG TINH LUYỆN HSK
                <span style={{ fontFamily: "ui-sans-serif" }}>5</span>
              </div>
            </div>
          </div>

          {/* Main: mock-test title and listening section */}
          <div
            style={{
              position: "absolute",
              top: vertical ? "36.5%" : "40%",
              width: "100%",
              textAlign: "center",
              color: HSK_THEME.colors.introGold,
              fontSize: vertical ? 86 : 64,
              fontWeight: 700,
              letterSpacing: vertical ? 14 : 8,
            }}
          >
            模拟试卷<span style={{ fontFamily: "ui-sans-serif" }}>3</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: vertical ? "46%" : "50%",
              width: "100%",
              textAlign: "center",
              fontSize: vertical ? 48 : 38,
              fontWeight: 700,
              letterSpacing: vertical ? 5 : 3,
              lineHeight: "1.8",
            }}
          >
            （第一部分～听力）
          </div>
          <div
            style={{
              position: "absolute",
              top: vertical ? "62%" : "64%",
              width: "100%",
              textAlign: "center",
              color: HSK_THEME.colors.introGold,
              fontSize: vertical ? 56 : 44,
              fontWeight: 700,
            }}
          >
            ĐỀ THI MÔ PHỎNG{" "}
            <span style={{ fontFamily: "ui-sans-serif" }}>3</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: vertical ? "72%" : "74%",
              width: "100%",
              textAlign: "center",
              fontSize: vertical ? 48 : 38,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            <span style={{ fontFamily: "ui-sans-serif" }}>Phần 01 ~ Nghe</span>
          </div>
        </div>
      </div>

      {/* Keep the current question number visible on the intro card. */}
      <div
        style={{
          position: "absolute",
          // Center the question badge on the same canvas axis as the header.
          left: "50%",
          transform: "translateX(-50%)",
          bottom: vertical ? "26%" : "7%",
          padding: vertical ? "10px 22px" : "8px 18px",
          border: `2px solid ${HSK_THEME.colors.gold}`,
          borderRadius: 999,
          backgroundColor: HSK_THEME.colors.introBand,
          color: HSK_THEME.colors.introText,
          fontSize: vertical ? 42 : 30,
          fontWeight: 700,
          fontFamily: HSK_THEME.fonts.vietnamese,
          lineHeight: 1.2,
          boxShadow: "0 4px 14px rgba(56, 39, 29, 0.2)",
        }}
      >
        Câu {question.prompt}
      </div>
    </AbsoluteFill>
  );
};
