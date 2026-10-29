# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## HSK listening quiz

The project registers one independent composition for each question in
`src/data/questions.ts` and for each format. Each video contains just one question.
The data currently defines Q01. Add one record for every additional question.

### Add questions and audio

1. Put the new recording in `public/audio/hsk/tinhgiangtinhluyenhsk5/de3/`,
   for example `1.02.MP3`. Keep the existing shared intro files in place.
2. Add one object to the `hskQuestions` list in `src/data/questions.ts`.
   Give it the next unique ID (`Q02`), audio path, HSK level, prompt, exactly
   four choices and matching Vietnamese `choiceMeaning` values, correct answer,
   Chinese transcript, matching pinyin lines, matching Vietnamese meaning lines,
   explanation, and matching `vocabs`, `vocabsPinyin`, and `vocabsMeaning` arrays.
3. Check that the audio file name and `audio` path match exactly. The app reads
   the file's actual duration and creates both `HSK-Q02-Landscape` and
   `HSK-Q02-Vertical` automatically. Repeat the same steps for Q03, Q04, etc.;
   no changes to `Root.tsx` or the shared video template are needed.
4. Render one question to review it, then use a batch command for all questions.
   The render script discovers each ID and audio path from `questions.ts`.

Adding an MP3 by itself does not create a finished quiz: the question's text,
choices, answer, and aligned transcripts are also required in `questions.ts`.
The single-video render command accepts IDs from Q01 through Q99.

Each question's audio path is set in `src/data/questions.ts`; the current audio
is `public/audio/hsk/tinhgiangtinhluyenhsk5/de3/1.01.MP3`. Its recording should
match the Chinese transcript lines in that file. Shared intros are configured
there as well: `intro1.MP3` then `intro2.MP3`. The thinking sound is
`public/audio/sfx/countdownTimer.MP3`.

Intro 1 shows the title slide. Intro 2 previews the question and its four choices.
Then the question audio plays, followed by the complete countdown audio. The
composition reads the countdown file's duration so its sound is not cut off.
The question audio plays again while each Chinese transcript line appears
beside its pinyin. The answer and Vietnamese transcript lines appear after replay,
followed by vocabulary cards with Chinese, pinyin, and Vietnamese meanings.

Remotion reads the actual durations of both intros and the question recording.
It sets the composition length to both full intros, two full plays of the
question audio, the complete countdown audio, seven seconds to review, and four
seconds per vocabulary item. Each pinyin line is paired with its Chinese transcript.

Render a trial video for a newly added question before batch rendering:

```console
npm.cmd run render:hsk:one -- Q02 landscape
```

Use `vertical` instead of `landscape` for the vertical version. The script reads
the available question IDs and audio paths from `questions.ts`, then checks the
requested audio file before rendering.

Render all currently defined landscape videos, all vertical videos, or both sets:

```console
npm.cmd run render:hsk:landscape
npm.cmd run render:hsk:vertical
npm.cmd run render:hsk:all
```

Videos are written to `out/landscape/HSK-Q01.mp4` and
`out/vertical/HSK-Q01.mp4`. Additional files are generated for every other
question defined in `src/data/questions.ts`.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
