import { Img, staticFile } from "remotion";
import type { HskQuestion } from "../data/questions";
import { HSK_THEME } from "../styles/hskTheme";

type HskHeaderProps = {
  question: HskQuestion;
  vertical: boolean;
  /** Use the vocabulary title during the final learning phase. */
  variant?: "brand" | "vocabulary";
};

/** Keeps the Latin HSK label and its level number evenly aligned. */
const HskLevelLabel: React.FC<{ level: HskQuestion["level"] }> = ({
  level,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: "0.2em",
      marginLeft: "0.12em",
      whiteSpace: "nowrap",
      fontFamily: HSK_THEME.fonts.level,
      letterSpacing: "0.02em",
    }}
  >
    <span>HSK</span>
    <span
      style={{
        fontVariantNumeric: "lining-nums tabular-nums",
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {level}
    </span>
  </span>
);

/** Shared logo header with a brand and a vocabulary lesson title variant. */
export const HskHeader: React.FC<HskHeaderProps> = ({
  question,
  vertical,
  variant = "brand",
}) => {
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;
  const isVocabularyHeader = variant === "vocabulary";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: HSK_THEME.colors.panel,
        fontFamily: HSK_THEME.fonts.header,
        color: HSK_THEME.colors.white,
        padding: layout.headerPadding,
        border: `2px solid ${HSK_THEME.colors.goldStrong}`,
        borderRadius: 100,
        height: layout.headerHeight,
        boxSizing: "border-box",
      }}
    >
      <Img
        src={staticFile("logo/logo-circle.png")}
        alt="Learning channel logo"
        style={{
          width: layout.headerLogoSize,
          height: layout.headerLogoSize,
          objectFit: "contain",
          scale: layout.headerLogoScale,
          translate: vertical ? "6px 0px" : "-8px 0px",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          textAlign: "center",
          fontFamily: HSK_THEME.fonts.header,
          padding: isVocabularyHeader ? "0 24px" : 0,
          color: HSK_THEME.colors.white,
          fontSize: isVocabularyHeader ? (vertical ? 38 : 44) : undefined,
          fontWeight: isVocabularyHeader ? 800 : undefined,
          lineHeight: 1.25,
        }}
      >
        {isVocabularyHeader ? (
          <>
            <div
              style={{
                fontFamily: HSK_THEME.fonts.chinese,
                fontSize: vertical ? 50 : 56,
                lineHeight: 1.2,
                letterSpacing: vertical ? 6 : 12,
                fontWeight: 500,
              }}
            >
              值得记忆的词汇与结构
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: HSK_THEME.fonts.vietnamese,
                fontSize: vertical ? 28 : 32,
                lineHeight: 1.2,
                letterSpacing: vertical ? 0.5 : 1,
                fontWeight: 600,
              }}
            >
              TỪ VỰNG VÀ CẤU TRÚC ĐÁNG NHỚ
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: HSK_THEME.fonts.chinese,
                fontSize: vertical ? 50 : 56,
                fontWeight: 500,
                letterSpacing: vertical ? 8 : 16,
              }}
            >
              精讲精练
              <HskLevelLabel level={question.level} />
            </div>
            <div
              style={{
                fontFamily: HSK_THEME.fonts.vietnamese,
                fontSize: vertical ? 28 : 34,
                marginTop: 4,
                letterSpacing: vertical ? 1 : 2,
                lineHeight: 1.4,
                fontWeight: 500,
              }}
            >
              TINH GIẢNG TINH LUYỆN <HskLevelLabel level={question.level} />
            </div>
          </>
        )}
      </div>
    </header>
  );
};
