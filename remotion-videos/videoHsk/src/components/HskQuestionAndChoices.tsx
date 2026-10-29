import { convertChineseNumber, type HskQuestion } from "../data/questions";
import { HSK_THEME } from "../styles/hskTheme";

/** Reusable question and four-choice area; highlights the answer only at reveal. */
export const HskQuestionAndChoices: React.FC<{
  question: HskQuestion;
  vertical: boolean;
  revealAnswer: boolean;
  showMeanings: boolean;
}> = ({ question, vertical, revealAnswer, showMeanings }) => {
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;

  return (
    <>
      <div style={{ paddingBottom: layout.mainGap }}>
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: layout.headingFontSize,
            fontFamily: HSK_THEME.fonts.chinese,
            lineHeight: 1.6,
            color: HSK_THEME.colors.textLight,
            letterSpacing: "8px",
          }}
        >
          模拟试卷{question.test}|第一部分|第
          {convertChineseNumber(question.id)}题
        </h1>
        <p
          style={{
            margin: 0,
            textAlign: "left",
            fontSize: layout.promptFontSize,
            color: HSK_THEME.colors.prompt,
            paddingTop: "15px",
            fontWeight: 600,
          }}
        >
          Câu {question.prompt}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: vertical ? "1fr" : "1fr 1fr",
          gap: layout.sectionGap,
        }}
      >
        {question.choices.map((choice, index) => {
          const correct = revealAnswer && choice === question.answer;

          return (
            <div
              key={choice}
              style={{
                minHeight: layout.choiceMinHeight,
                display: showMeanings ? "grid" : "flex",
                gridTemplateColumns: showMeanings
                  ? "minmax(0, 1.2fr) minmax(0, 1fr)"
                  : undefined,
                alignItems: "center",
                gap: 16,
                padding: vertical ? "10px 18px" : "10px 20px",
                borderRadius: 16,
                border: `2px solid ${correct ? HSK_THEME.colors.successBorder : HSK_THEME.colors.cardBorder}`,
                backgroundColor: correct
                  ? HSK_THEME.colors.success
                  : HSK_THEME.colors.card,
                boxSizing: "border-box",
                fontSize: layout.choiceFontSize,
                fontFamily: HSK_THEME.fonts.body,
                fontWeight: 400,
                letterSpacing: 2,
                color: correct
                  ? HSK_THEME.colors.successText
                  : HSK_THEME.colors.cardText,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: correct
                      ? HSK_THEME.colors.successText
                      : HSK_THEME.colors.cardLabel,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: 0,
                  }}
                >
                  <span>{choice}</span>
                  {showMeanings && (
                    <span
                      style={{
                        color: correct
                          ? HSK_THEME.colors.successText
                          : HSK_THEME.colors.muted,
                        fontSize: vertical ? 26 : 20,
                        lineHeight: 1.2,
                      }}
                    >
                      ({question.choicePinyin[index]})
                    </span>
                  )}
                </span>
              </div>
              {showMeanings && (
                <div
                  style={{
                    minWidth: 0,
                    paddingLeft: vertical ? 16 : 20,
                    borderLeft: `1px solid ${correct ? HSK_THEME.colors.successBorder : HSK_THEME.colors.cardBorder}`,
                    color: correct
                      ? HSK_THEME.colors.successText
                      : HSK_THEME.colors.muted,
                    fontSize: vertical ? 32 : 30,
                    fontWeight: 600,
                    fontFamily: HSK_THEME.fonts.vietnamese,
                    lineHeight: 1.4,
                  }}
                >
                  {question.choiceMeaning[index]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
