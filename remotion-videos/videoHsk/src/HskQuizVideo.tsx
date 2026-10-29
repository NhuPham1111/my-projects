import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { hskIntroAudio, type HskQuestion } from "./data/questions";
import { HskHeader } from "./components/HskHeader";
import { HskQuestionAndChoices } from "./components/HskQuestionAndChoices";
import { HskIntroSlide } from "./components/HskIntroSlide";
import { HskOutroSlide } from "./components/HskOutroSlide";
import { HskVocabularyList } from "./components/HskVocabularyList";
import { HSK_THEME } from "./styles/hskTheme";
import { getHskPanelSurface } from "./styles/hskStyles";

export const FPS = 30;
export const REVEAL_SECONDS = 3;
export const REVEAL_FRAMES = REVEAL_SECONDS * FPS;
export const VOCABULARY_DURATION_SECONDS = 5;
export const VOCABULARY_DURATION_FRAMES = VOCABULARY_DURATION_SECONDS * FPS;
export const COUNTDOWN_AUDIO = "audio/sfx/countdownTimer.MP3";
export const CORRECT_AUDIO = "audio/sfx/correctSound.MP3";
export const OUTRO_AUDIO = "audio/sfx/outro-follow-chime.wav";
export const OUTRO_MIN_SECONDS = 6;

export type HskQuizVideoProps = {
  readonly question: HskQuestion;
  readonly intro1DurationInFrames: number;
  readonly intro2DurationInFrames: number;
  readonly audioDurationInFrames: number;
  readonly countdownDurationInFrames: number;
  readonly correctSoundDurationInFrames: number;
  readonly outroAudioDurationInFrames: number;
};

type QuizPhase =
  | "preview"
  | "listening"
  | "thinking"
  | "replay"
  | "answer"
  | "vocabulary"
  | "outro";

/** Match question lines by their speaker labels in the transcript data. */
const isQuestionTranscriptLine = (chinese: string, vietnamese = "") =>
  /^(问|問題|问题)\s*[:：]/.test(chinese.trim()) ||
  /^(hỏi|câu hỏi)\s*[:：]/i.test(vietnamese.trim());

// The components below keep the audio state logic in this file while reusable
// visual pieces (header and answer choices) live in src/components.
const AudioWaveform: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const barCount = vertical ? 23 : 35;
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;

  return (
    <div
      aria-label="Audio đang phát"
      style={{
        height: layout.waveformHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vertical ? 8 : 6,
      }}
    >
      {Array.from({ length: barCount }, (_, index) => {
        const wave = Math.abs(Math.sin(frame / 4 + index * 0.72));

        return (
          <div
            key={index}
            style={{
              width: vertical ? 8 : 6,
              height: 16 + wave * (vertical ? 54 : 44),
              borderRadius: 8,
              backgroundColor: HSK_THEME.colors.wave,
              opacity: 0.45 + wave * 0.55,
            }}
          />
        );
      })}
    </div>
  );
};

const PhasePanel: React.FC<{
  phase: QuizPhase;
  question: HskQuestion;
  vertical: boolean;
  secondsLeft: number;
  frame: number;
  answerStartsAt: number;
}> = ({ phase, question, vertical, secondsLeft, frame, answerStartsAt }) => {
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;

  if (phase === "preview") {
    return (
      <div
        style={{
          color: HSK_THEME.colors.gold,
          fontSize: layout.promptFontSize,
        }}
      >
        🎧 Chuẩn bị nghe câu hỏi
      </div>
    );
  }

  if (phase === "listening") {
    return null;
  }

  if (phase === "thinking") {
    return (
      <div
        aria-label={`Còn ${secondsLeft} giây suy nghĩ`}
        style={{
          position: "relative",
          width: vertical ? 150 : 120,
          height: vertical ? 150 : 120,
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            width: vertical ? 138 : 112,
            height: vertical ? 138 : 112,
            overflow: "visible",
            transform: `rotate(${(frame * 12) % 360}deg)`,
          }}
        >
          {/* Thin circular arrow stays legible over both background formats. */}
          <path
            // A long circular sweep follows the reference; the head is placed
            // on the lower-right end of the arc and points down the rotation.
            d="M72 84 A40 40 0 1 1 89 58"
            fill="none"
            stroke={HSK_THEME.colors.countdownArrow}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M79 56 L93 74 L99 52 Z"
            fill={HSK_THEME.colors.countdownArrow}
          />
        </svg>
        <span
          style={{
            position: "relative",
            color: HSK_THEME.colors.countdownArrow,
            fontSize: vertical ? 58 : 48,
            fontWeight: 800,
            textShadow: "0 1px 4px rgba(56, 39, 29, 0.55)",
          }}
        >
          {secondsLeft}
        </span>
      </div>
    );
  }

  if (phase === "replay") {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: layout.sectionGap,
          }}
        >
          {question.transcript.map((line, index) => (
            <div
              key={`transcript-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: layout.transcriptFontSize,
                  lineHeight: 1.4,
                  letterSpacing: 2,
                  color: isQuestionTranscriptLine(
                    line,
                    question.vietnameseMeaning[index],
                  )
                    ? HSK_THEME.colors.transcriptQuestion
                    : HSK_THEME.colors.ink,
                }}
              >
                {line}
              </div>
              <div
                style={{
                  fontSize: layout.pinyinFontSize,
                  lineHeight: 1.3,
                  color: HSK_THEME.colors.muted,
                }}
              >
                {question.pinyin[index]}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (phase !== "answer") {
    return null;
  }

  return (
    <div
      style={{
        opacity: interpolate(
          frame,
          [answerStartsAt, answerStartsAt + 12],
          [0, 1],
          { extrapolateRight: "clamp" },
        ),
        display: "flex",
        flexDirection: "column",
        gap: vertical ? 12 : 10,
      }}
    >
      <div
        style={{
          color: HSK_THEME.colors.answer,
          fontSize: layout.promptFontSize,
          fontWeight: 700,
        }}
      >
        ĐÁP ÁN: {question.answer}
      </div>
      {question.vietnameseMeaning.map((line, index) => (
        <div
          key={`meaning-${index}`}
          style={{
            // Vietnamese transcript translations are supporting study content,
            // so keep them large and bold enough to read on phone screens.
            fontSize: layout.answerTranslationFontSize,
            lineHeight: 1.4,
            fontWeight: 700,
            fontFamily: HSK_THEME.fonts.vietnamese,
            color: isQuestionTranscriptLine(question.transcript[index], line)
              ? HSK_THEME.colors.transcriptQuestion
              : HSK_THEME.colors.ink,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

export const HskQuizVideo: React.FC<HskQuizVideoProps> = ({
  question,
  intro1DurationInFrames,
  intro2DurationInFrames,
  audioDurationInFrames,
  countdownDurationInFrames,
  correctSoundDurationInFrames,
  outroAudioDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;

  // Each start frame is calculated from the real duration of the sound before it.
  const intro2StartsAt = intro1DurationInFrames;
  const questionStartsAt = intro1DurationInFrames + intro2DurationInFrames;
  const thinkingStartsAt = questionStartsAt + audioDurationInFrames;
  const replayStartsAt = thinkingStartsAt + countdownDurationInFrames;
  const answerStartsAt = replayStartsAt + audioDurationInFrames;
  const vocabularyStartsAt = answerStartsAt + REVEAL_FRAMES;
  const outroStartsAt = vocabularyStartsAt + VOCABULARY_DURATION_FRAMES;

  // One shared phase value controls both what learners see and when it appears.
  const phase: QuizPhase =
    frame < questionStartsAt
      ? "preview"
      : frame < thinkingStartsAt
        ? "listening"
        : frame < replayStartsAt
          ? "thinking"
          : frame < answerStartsAt
            ? "replay"
            : frame < vocabularyStartsAt
              ? "answer"
              : frame < outroStartsAt
                ? "vocabulary"
                : "outro";
  const countdownSeconds = Math.round(countdownDurationInFrames / FPS);
  const secondsLeft = Math.min(
    countdownSeconds,
    Math.ceil(Math.max(0, replayStartsAt - frame) / FPS),
  );
  const showAnswer = phase === "answer";
  const layout = vertical
    ? HSK_THEME.layout.vertical
    : HSK_THEME.layout.landscape;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: HSK_THEME.colors.page,
        color: HSK_THEME.colors.textLight,
        fontFamily: HSK_THEME.fonts.body,

        // TikTok overlays cover screen edges; vertical content stays inside
        // this generous safe area, with extra room below for the app controls.
        padding: layout.safeAreaPadding,

        boxSizing: "border-box",
      }}
    >
      {/* Use the matching artwork behind all non-intro phases. */}
      <Img
        src={staticFile(
          HSK_THEME.backgrounds[vertical ? "vertical" : "landscape"],
        )}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Darken the light artwork slightly so white text stays readable. */}
      {frame >= intro1DurationInFrames && phase !== "outro" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: HSK_THEME.colors.pageOverlay,
            zIndex: 1,
          }}
        />
      ) : null}

      {/* Audio timeline: shared intros, first listen, timed pause, and replay. */}
      <Sequence durationInFrames={intro1DurationInFrames}>
        <Audio src={staticFile(hskIntroAudio.intro1)} />
      </Sequence>
      <Sequence from={intro2StartsAt} durationInFrames={intro2DurationInFrames}>
        <Audio src={staticFile(hskIntroAudio.intro2)} />
      </Sequence>
      <Sequence
        from={questionStartsAt}
        durationInFrames={audioDurationInFrames}
      >
        <Audio src={staticFile(question.audio)} />
      </Sequence>
      <Sequence
        from={thinkingStartsAt}
        durationInFrames={countdownDurationInFrames}
        name="Countdown thinking break"
      >
        <Audio src={staticFile(COUNTDOWN_AUDIO)} volume={0.25} />
      </Sequence>
      <Sequence
        from={replayStartsAt}
        durationInFrames={audioDurationInFrames}
        name="Replay audio with Chinese transcript"
      >
        <Audio src={staticFile(question.audio)} />
      </Sequence>
      <Sequence
        from={answerStartsAt}
        durationInFrames={correctSoundDurationInFrames}
        name="correct sound effect"
      >
        <Audio src={staticFile(CORRECT_AUDIO)} volume={0.25} />
      </Sequence>
      <Sequence
        from={outroStartsAt}
        durationInFrames={outroAudioDurationInFrames}
        name="Thank you and follow chime"
      >
        <Audio src={staticFile(OUTRO_AUDIO)} volume={0.38} />
      </Sequence>

      {/* Intro 1: show only the title slide while the first intro audio plays. */}
      {frame < intro1DurationInFrames ? (
        <HskIntroSlide question={question} />
      ) : phase === "outro" ? (
        <HskOutroSlide startFrame={outroStartsAt} />
      ) : (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            minHeight: 0,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: layout.sectionGap,
          }}
        >
          {/* Header: consistent identity and question number. */}
          <HskHeader
            question={question}
            vertical={vertical}
            variant={phase === "vocabulary" ? "vocabulary" : "brand"}
          />

          {phase === "vocabulary" ? (
            // The vocabulary phase keeps only the shared header and mapped list.
            <HskVocabularyList question={question} vertical={vertical} />
          ) : (
            <>
              {/* Main: question, choices, and the current learning phase. */}
              <main
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: layout.mainGap,
                  flexShrink: 0,
                }}
              >
                <HskQuestionAndChoices
                  question={question}
                  vertical={vertical}
                  revealAnswer={showAnswer}
                  showMeanings={showAnswer}
                />

                {phase === "listening" || phase === "replay" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: HSK_THEME.colors.panel,
                        fontSize: vertical ? 36 : 30,
                        paddingBottom: layout.mainGap,
                        fontWeight: 600,
                      }}
                    >
                      {phase === "listening"
                        ? "🔊 Nghe lần 1"
                        : "🔊 Nghe lần 2"}
                    </div>
                    <AudioWaveform vertical={vertical} />
                  </div>
                ) : null}

                {/* Phase panel: preview, countdown, transcript, or answer. */}
                {phase !== "listening" && (
                  <section
                    style={{
                      ...getHskPanelSurface(
                        phase === "thinking"
                          ? "thinking"
                          : phase === "replay" || phase === "answer"
                            ? "transcript"
                            : "preview",
                      ),
                      minHeight:
                        phase === "preview"
                          ? layout.previewPanelMinHeight
                          : phase === "thinking"
                            ? layout.countdownPanelMinHeight
                            : undefined,
                      borderRadius: 20,
                      padding: phase === "thinking" ? 0 : layout.panelPadding,
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: phase === "thinking" ? "center" : undefined,
                      textAlign:
                        phase === "replay" || phase === "answer"
                          ? "left"
                          : "center",
                    }}
                  >
                    <PhasePanel
                      phase={phase}
                      question={question}
                      vertical={vertical}
                      secondsLeft={secondsLeft}
                      frame={frame}
                      answerStartsAt={answerStartsAt}
                    />
                  </section>
                )}
              </main>

              {/* Green footer reminder is hidden during the vocabulary-only phase. */}
              <footer
                style={{
                  color: HSK_THEME.colors.successAccent,
                  fontSize: layout.footerFontSize,
                  textAlign: "center",
                  flexShrink: 0,
                  paddingTop: "15px",
                  fontWeight: 600,
                }}
              >
                ✅ Nghe → Đáp án → Transcript → Từ vựng
              </footer>
            </>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
