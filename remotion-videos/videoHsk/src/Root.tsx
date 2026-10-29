import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition, Folder, staticFile } from "remotion";
import { hskIntroAudio, hskQuestions } from "./data/questions";
import {
  FPS,
  COUNTDOWN_AUDIO,
  CORRECT_AUDIO,
  OUTRO_AUDIO,
  OUTRO_MIN_SECONDS,
  HskQuizVideo,
  REVEAL_FRAMES,
  VOCABULARY_DURATION_FRAMES,
  type HskQuizVideoProps,
} from "./HskQuizVideo";

const getHskMetadata = async ({ props }: { props: HskQuizVideoProps }) => {
  const { question } = props;
  if (
    question.transcript.length !== question.pinyin.length ||
    question.transcript.length !== question.vietnameseMeaning.length
  ) {
    throw new Error(
      `${question.id} cần cùng số dòng transcript, pinyin và bản dịch tiếng Việt.`,
    );
  }
  if (
    question.vocabs.length === 0 ||
    question.vocabs.length !== question.vocabsPinyin.length ||
    question.vocabs.length !== question.vocabsMeaning.length
  ) {
    throw new Error(
      `${question.id} cần ít nhất một từ vựng và số dòng từ vựng, pinyin, nghĩa phải khớp nhau.`,
    );
  }
  if (
    question.choicePinyin.length !== question.choices.length ||
    question.choiceMeaning.length !== question.choices.length ||
    !question.choices.includes(question.answer)
  ) {
    throw new Error(
      `${question.id} cần đủ nghĩa cho bốn lựa chọn và đáp án phải nằm trong danh sách lựa chọn.`,
    );
  }

  const getDurationInFrames = async (audioPath: string, label: string) => {
    try {
      const duration = await getAudioDurationInSeconds(staticFile(audioPath));
      return Math.ceil(duration * FPS);
    } catch {
      throw new Error(
        `Không đọc được ${label}. Hãy kiểm tra file public/${audioPath}.`,
      );
    }
  };

  const [
    intro1DurationInFrames,
    intro2DurationInFrames,
    audioDurationInFrames,
    countdownDurationInFrames,
    correctSoundDurationInFrames,
    outroAudioDurationInFrames,
  ] = await Promise.all([
    getDurationInFrames(hskIntroAudio.intro1, "audio intro1"),
    getDurationInFrames(hskIntroAudio.intro2, "audio intro2"),
    getDurationInFrames(props.question.audio, `audio ${props.question.id}`),
    getDurationInFrames(COUNTDOWN_AUDIO, "audio countdown timer"),
    getDurationInFrames(CORRECT_AUDIO, "audio correct sound"),
    getDurationInFrames(OUTRO_AUDIO, "audio outro follow chime"),
  ]);
  const vocabularyDurationInFrames = VOCABULARY_DURATION_FRAMES;
  const outroDurationInFrames = Math.max(
    outroAudioDurationInFrames,
    OUTRO_MIN_SECONDS * FPS,
  );

  return {
    durationInFrames:
      intro1DurationInFrames +
      intro2DurationInFrames +
      audioDurationInFrames * 2 +
      countdownDurationInFrames +
      REVEAL_FRAMES +
      vocabularyDurationInFrames +
      outroDurationInFrames,
    props: {
      ...props,
      intro1DurationInFrames,
      intro2DurationInFrames,
      audioDurationInFrames,
      countdownDurationInFrames,
      correctSoundDurationInFrames,
      outroAudioDurationInFrames,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  const questionIds = hskQuestions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length) {
    throw new Error("Mỗi câu hỏi phải có một id duy nhất trong questions.ts.");
  }

  return (
    <Folder name="HSK-Listening-Quiz">
      {hskQuestions.flatMap((question) =>
        (["Landscape", "Vertical"] as const).map((layout) => {
          const vertical = layout === "Vertical";
          const id = `HSK-${question.id}-${layout}`;

          return (
            <Composition
              key={id}
              id={id}
              component={HskQuizVideo}
              durationInFrames={FPS * 30}
              fps={FPS}
              width={vertical ? 1080 : 1920}
              height={vertical ? 1920 : 1080}
              defaultProps={{
                question,
                intro1DurationInFrames: FPS,
                intro2DurationInFrames: FPS,
                audioDurationInFrames: FPS,
                countdownDurationInFrames: FPS,
                correctSoundDurationInFrames: FPS,
                outroAudioDurationInFrames: FPS,
              }}
              calculateMetadata={getHskMetadata}
            />
          );
        }),
      )}
    </Folder>
  );
};
