import type { HskQuestion } from "../data/questions";
import { HSK_THEME } from "../styles/hskTheme";

type HskVocabularyListProps = {
  question: HskQuestion;
  vertical: boolean;
};

/** Maps each word to its pinyin and Vietnamese meaning in one reusable list. */
export const HskVocabularyList: React.FC<HskVocabularyListProps> = ({
  question,
  vertical,
}) => {
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;
  const vocabularyCount = question.vocabs.length;
  const landscape = !vertical;
  const countScale =
    vocabularyCount > 12 ? 0.72 : vocabularyCount > 8 ? 0.82 : 1;
  const fontScale = countScale * (landscape ? 0.75 : 1);
  const sectionGap = landscape ? 10 : layout.sectionGap;
  const panelPadding = landscape ? 12 : layout.panelPadding;
  const explanationFontSize = landscape
    ? layout.vocabularyMeaningFontSize * 0.78
    : layout.vocabularyMeaningFontSize;
  return (
    <section
      aria-label="Vocabulary lesson"
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: panelPadding,
        border: `2px solid ${HSK_THEME.colors.paperBorder}`,
        borderRadius: 24,
        backgroundColor: HSK_THEME.colors.page,
        color: HSK_THEME.colors.ink,
        display: "flex",
        flexDirection: "column",
        gap: sectionGap,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: `${panelPadding * 0.65}px ${panelPadding}px`,
          border: `2px solid ${HSK_THEME.colors.explanationBorder}`,
          borderLeft: `10px solid ${HSK_THEME.colors.explanationAccent}`,
          borderRadius: 16,
          backgroundColor: HSK_THEME.colors.explanation,
          color: HSK_THEME.colors.explanationAccent,
          fontSize: landscape
            ? layout.vocabularyTitleFontSize * 0.82
            : layout.vocabularyTitleFontSize,
          fontWeight: 800,
        }}
      >
        <span>Từ vựng</span>
        <span>{vocabularyCount} từ</span>
      </header>
      <div
        style={{
          display: "grid",
          // Keep each word on its own row so the two learning columns stay readable.
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: sectionGap,
        }}
      >
        {question.vocabs.map((word, index) => (
          <article
            key={`${question.id}-vocab-${index}`}
            style={{
              minWidth: 0,
              padding: panelPadding,
              border: `1px solid ${HSK_THEME.colors.paperBorder}`,
              borderRadius: 16,
              backgroundColor: HSK_THEME.colors.vocabularyCard,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              alignItems: "center",
              gap: sectionGap,
              textAlign: "left",
            }}
          >
            {/* Left column: Chinese word and its matching pinyin. */}
            <div
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: layout.vocabularyWordFontSize * fontScale,
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {index + 1}. {word}
              </div>
              <div
                style={{
                  fontSize: layout.vocabularyPinyinFontSize * fontScale,
                  color: HSK_THEME.colors.muted,
                  lineHeight: 1.25,
                }}
              >
                ({question.vocabsPinyin[index]})
              </div>
            </div>
            {/* Right column: Vietnamese meaning for the same array item. */}
            <div
              style={{
                minWidth: 0,
                fontSize: layout.vocabularyMeaningFontSize * fontScale,
                lineHeight: 1.6,
                paddingLeft: layout.sectionGap,
                borderLeft: `1px solid ${HSK_THEME.colors.paperBorder}`,
                fontWeight: 600,
                fontFamily: HSK_THEME.fonts.vietnamese,
              }}
            >
              {question.vocabsMeaning[index]}
            </div>
          </article>
        ))}
      </div>
      {/* Show every grammar structure as a numbered, separate study card. */}
      <section
        aria-label="Grammar explanations"
        style={{
          padding: panelPadding,
          border: `2px solid ${HSK_THEME.colors.explanationBorder}`,
          borderLeft: `10px solid ${HSK_THEME.colors.explanationAccent}`,
          borderRadius: 18,
          backgroundColor: HSK_THEME.colors.explanation,
          display: "grid",
          gridTemplateColumns:
            landscape && question.explanation.length > 1
              ? "repeat(2, minmax(0, 1fr))"
              : "minmax(0, 1fr)",
          gap: sectionGap,
          color: HSK_THEME.colors.ink,
        }}
      >
        <div
          style={{
            color: HSK_THEME.colors.explanationAccent,
            fontSize: landscape
              ? layout.vocabularyTitleFontSize * 0.9
              : layout.vocabularyTitleFontSize,
            fontWeight: 800,
            gridColumn:
              landscape && question.explanation.length > 1
                ? "1 / -1"
                : undefined,
          }}
        >
          Cấu trúc & Mẫu câu
        </div>
        {question.explanation.map((item, index) => (
          <article
            key={`${question.id}-explanation-${index}`}
            style={{
              padding: landscape ? 10 : layout.panelPadding * 0.75,
              border: `1px solid ${HSK_THEME.colors.explanationBorder}`,
              borderRadius: 14,
              backgroundColor: HSK_THEME.colors.vocabularyCard,
              display: "flex",
              flexDirection: "column",
              gap: landscape ? 5 : 8,
            }}
          >
            {/* <div
              style={{
                color: HSK_THEME.colors.explanationAccent,
                fontSize: explanationFontSize,
                fontWeight: 800,
              }}
            >
              Cấu trúc {index + 1}
            </div> */}
            <div
              style={{
                fontSize: explanationFontSize,
                lineHeight: 1.6,
                fontWeight: 600,
                color: HSK_THEME.colors.transcriptQuestion,
              }}
            >
              <strong> {index + 1}. </strong> {item.structure}
            </div>
            <div
              style={{
                fontSize: layout.vocabularyMeaningFontSize,
                lineHeight: 1.35,
                fontWeight: 600,
              }}
            >
              <strong>Ví dụ:</strong> {item.example}
            </div>
            <div
              style={{
                fontSize: landscape
                  ? layout.vocabularyPinyinFontSize * 0.58
                  : layout.vocabularyPinyinFontSize * 0.75,
                lineHeight: 1.3,
                color: HSK_THEME.colors.muted,
              }}
            >
              {item.examplePinyin}
            </div>
            <div
              style={{
                fontSize: explanationFontSize,
                lineHeight: 1.3,
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              {item.exampleMeaning}
            </div>
          </article>
        ))}
      </section>{" "}
    </section>
  );
};
