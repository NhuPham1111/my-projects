# HSK Remotion Project Plan

This is the source of truth for implementing and maintaining this project. Every future code, audio, layout, or render workflow change must be recorded in the **Change log** below in the same update.

## Project structure

```text
src/
├── Root.tsx                         # Creates a landscape and vertical Composition for every question
├── HskQuizVideo.tsx                 # Shared timeline, audio sequences, and phase selection
├── data/
│   └── questions.ts                 # Question data, Chinese number lookup, shared intro audio paths
├── components/
│   ├── HskIntroSlide.tsx            # Opening title card shown during intro1
│   ├── HskHeader.tsx                # Shared brand and vocabulary headers
│   ├── HskQuestionAndChoices.tsx    # Question heading and four answer cards
│   ├── HskVocabularyList.tsx        # Vocabulary, pinyin, meanings, and grammar examples
│   └── HskOutroSlide.tsx            # Shared closing / follow card
└── styles/
    ├── hskTheme.ts                  # Shared colors, fonts, dimensions, and layout tokens
    └── hskStyles.ts                 # Reusable surface styles for timeline panels
```

Audio, logo, and background image files are stored in `public/`. Rendering utilities are in `scripts/` at the project root.

## Render flow

1. `questions.ts` exports `hskQuestions`; each question contains its ID, prompt, four choices, answer, aligned transcript arrays, vocabulary arrays, and grammar examples.
2. `Root.tsx` creates two Remotion compositions per question: `HSK-Q01-Landscape` and `HSK-Q01-Vertical`. `calculateMetadata` reads the actual audio durations and derives the full video duration.
3. `HskQuizVideo.tsx` plays the shared intros and question audio, then selects the preview, listen, think, replay, answer, vocabulary, and outro phases from frame positions.
4. Reusable visual elements render through components in `components/`. The question content and timeline logic are shared across questions and both aspect ratios.
5. `hskTheme.ts` is the single source for visual tokens. `hskStyles.ts` holds reusable surface styles. Keep styles that depend on the current phase or aspect ratio in the component, and use the shared tokens/helper for repeated colors, borders, and surfaces.

The replay transcript and Vietnamese answer transcript use the same `transcript` panel surface from `getHskPanelSurface()` so their backgrounds remain visually consistent.

## Add another question

1. Put its audio file under `public/audio/` using a unique, descriptive filename.
2. Add one object to `hskQuestions` in `src/data/questions.ts`. Use a unique ID such as `Q03` and set the matching audio path.
3. Keep paired data arrays aligned by index:
   - `choices`, `choicePinyin`, and `choiceMeaning` must each have four matching entries.
   - `transcript`, `pinyin`, and `vietnameseMeaning` must have the same number of lines in the same order.
   - `vocabs`, `vocabsPinyin`, and `vocabsMeaning` must have equal lengths.
4. Make sure `answer` exactly matches one of the four `choices`.
5. `Root.tsx` automatically creates landscape and vertical compositions for the new question. The render script also discovers question IDs and audio paths from `questions.ts`.
6. Preview one output before starting a batch render.

## Useful commands

Run these from the `my-projects` directory. On Windows, use `npm.cmd` if PowerShell does not resolve `npm` correctly.

```powershell
# Open Remotion Studio
npm.cmd run dev

# Check ESLint and TypeScript
npm.cmd run lint

# Render one question in one format first
npm.cmd run render:hsk:one -- Q01 vertical
npm.cmd run render:hsk:one -- Q01 landscape

# Render all questions in one format, or both formats
npm.cmd run render:hsk:vertical
npm.cmd run render:hsk:landscape
npm.cmd run render:hsk:all
```

The batch script writes files under `out/vertical/` and `out/landscape/`.

## Styling and component maintenance rules

- Keep the green, cream, and beige palette, typography, and aspect-ratio dimensions centralized in `styles/hskTheme.ts`.
- Put repeated color/border/background combinations in `styles/hskStyles.ts`; do not repeat the same panel tone as separate inline literals.
- Use inline React styles for frame-dependent values and layout differences between vertical and landscape; Remotion renders these deterministically per frame.
- Extract a component when it has a clear reusable role or its markup makes a parent difficult to follow. Pass data through typed props; avoid copying a full component to make a small visual variant.
- Keep timeline calculations in `HskQuizVideo.tsx` and composition registration / audio metadata in `Root.tsx`.
- Before changing timing, verify every audio sequence has a duration based on the actual audio or an explicit minimum, so the render cannot cut off sound.
- Update this plan whenever any of these rules, files, flows, data requirements, or commands change.

## FFmpeg

This project renders through Remotion 4 CLI (`@remotion/cli` 4.0.538). Remotion supplies the platform compositor binaries, including FFmpeg support, for normal local renders. A separate system-wide FFmpeg installation is not part of this project workflow. Install or configure a separate binary only if a future external tool or deployment environment specifically requires one. See [Remotion's binaries directory documentation](https://www.remotion.dev/docs/options/binaries-directory).

## Completion checklist for a project change

- Review affected files before editing and preserve unrelated user changes.
- Reuse existing question data, timeline, components, and style tokens when they fit.
- Check for matching audio and image assets; do not assume a new asset exists.
- Run `npm.cmd run lint` after TypeScript or JSX changes.
- Render one landscape or vertical sample before rendering a full batch when a change affects video appearance or timing.
- Record the completed change and any changed commands or assumptions in the change log.

## Change log

- 2026-10-29: Added this project plan, centralized phase-panel surfaces and shared font/transcript size tokens, and aligned the answer translation panel background with the replay transcript panel. Confirmed lint/typecheck and documented that a separate system FFmpeg installation is not required for standard Remotion renders.
- 2026-10-29: Reduced the landscape header logo to fit within the pill, added a staged Remotion-driven outro entrance, and replaced the generated end chime with a short major-key melody. Outro animations use the local frame offset from the outro start, and the existing metadata calculation keeps the clip duration synchronized to the generated audio.
- 2026-10-29: Shortened the answer reveal to 3 seconds and set the full vocabulary phase to 5 seconds. Both the timeline and `Root.tsx` composition metadata use the same shared duration constant.
- 2026-10-29: Disabled the general page darkening overlay during the outro so the closing card keeps its intended bright palette.
- 2026-10-29: Changed the shared page overlay to a softer warm olive tint to better match the green-and-beige palette while keeping light text legible.
- 2026-10-29: Expanded the project `.gitignore` to exclude generated renders, dependencies, local environment files, and agent tooling while keeping the source audio and image assets versioned.
