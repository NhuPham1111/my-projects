export type HskLevel = 4 | 5;

export const hskIntroAudio = {
  intro1: "audio/hsk/tinhgiangtinhluyenhsk5/de3/intro1.MP3",
  intro2: "audio/hsk/tinhgiangtinhluyenhsk5/de3/intro2.MP3",
} as const;

export type HskExplanation = {
  readonly structure: string;
  readonly example: string;
  readonly examplePinyin: string;
  readonly exampleMeaning: string;
};

export type HskQuestion = {
  readonly id: string;
  readonly test: number;
  readonly level: HskLevel;
  readonly audio: string;
  readonly prompt: string;
  readonly choices: readonly [string, string, string, string];
  readonly choicePinyin: readonly [string, string, string, string];
  readonly choiceMeaning: readonly [string, string, string, string];
  readonly answer: string;
  readonly transcript: string[];
  readonly pinyin: string[];
  readonly vietnameseMeaning: string[];
  readonly vocabs: readonly string[];
  readonly vocabsPinyin: readonly string[];
  readonly vocabsMeaning: readonly string[];
  readonly explanation: readonly HskExplanation[];
};

export const chineseNumbers = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
  10: "十",
  11: "十一",
  12: "十二",
  13: "十三",
  14: "十四",
  15: "十五",
  16: "十六",
  17: "十七",
  18: "十八",
  19: "十九",
  20: "二十",
};

/** Convert the numeric suffix in an ID such as Q01 into Chinese numerals. */
export const convertChineseNumber = (questionId: string): string => {
  const match = questionId.match(/(\d+)$/);
  const number = match ? Number(match[1]) : NaN;

  if (!Number.isInteger(number) || number < 1) {
    return questionId;
  }

  return (
    chineseNumbers[number as keyof typeof chineseNumbers] ?? String(number)
  );
};

// Intro audio is shared by every question; each question has its own audio.
export const hskQuestions: readonly HskQuestion[] = [
  {
    id: "Q01",
    test: 3,
    level: 5,
    audio: "audio/hsk/tinhgiangtinhluyenhsk5/de3/1.01.MP3",
    prompt: "1.1",
    choicePinyin: ["hěn lěngdàn", "yǒu nàixīn", "hěn gāoxìng", "bù nàifán"],
    choices: ["很冷淡", "有耐心", "很高兴", "不耐烦"],
    choiceMeaning: [
      "Rất lạnh nhạt",
      "Có kiên nhẫn",
      "Rất vui vẻ",
      "Mất kiên nhẫn",
    ],
    answer: "不耐烦",
    transcript: [
      "女:爸爸,明天我跟你一起去吧。",
      "男:去去去,小孩子凑什么热闹?",
      "问:男的是什么态度?",
    ],
    pinyin: [
      "Nǚ: Bàba, míngtiān wǒ gēn nǐ yīqǐ qù ba.",
      "Nán: Qù qù qù, xiǎo háizi còu shénme rènao?",
      "Wèn: Nán de shì shénme tàidù?",
    ],
    vietnameseMeaning: [
      "Nữ : Bố ơi, ngày mai con đi cùng bố nhé!",
      "Nam : Đi đi đi, trẻ con thì chen vào làm gì!",
      "Hỏi : Người đàn ông có thái độ như thế nào?",
    ],
    vocabs: ["耐心", "不耐烦", "凑热闹"],
    vocabsPinyin: ["nàixīn", "bù nàifán", "còu rènao"],
    vocabsMeaning: ["Kiên nhẫn", "Mất kiên nhẫn", "Góp vui; tham gia cho vui"],
    explanation: [
      {
        structure: "跟 + người + 一起 + động từ: Cùng ai làm việc gì.",
        example: "我想跟你一起学习中文。",
        examplePinyin: "Wǒ xiǎng gēn nǐ yìqǐ xuéxí Zhōngwén.",
        exampleMeaning: "Tôi muốn học tiếng Trung cùng bạn.",
      },
      {
        structure:
          "凑什么热闹？Xen vào làm gì? Tham gia làm gì cho thêm chuyện? ",
        example: "Ví dụ: 这是我们自己的事，你凑什么热闹？",
        examplePinyin: "Zhè shì wǒmen zìjǐ de shì, nǐ còu shénme rènao?",
        exampleMeaning:
          "Đây là chuyện riêng của chúng tôi, bạn xen vào làm gì?",
      },
    ],
  },
  {
    id: "Q02",
    test: 3,
    level: 5,
    audio: "audio/hsk/tinhgiangtinhluyenhsk5/de3/1.01.MP3",
    prompt: "1.2",
    choicePinyin: ["hěn lěngdàn", "yǒu nàixīn", "hěn gāoxìng", "bù nàifán"],
    choices: ["很冷淡", "有耐心", "很高兴", "不耐烦"],
    choiceMeaning: [
      "Rất lạnh nhạt",
      "Có kiên nhẫn",
      "Rất vui vẻ",
      "Mất kiên nhẫn",
    ],
    answer: "不耐烦",
    transcript: [
      "女:爸爸,明天我跟你一起去吧。",
      "男:去去去,小孩子凑什么热闹?",
      "问:男的是什么态度?",
    ],
    pinyin: [
      "Nǚ: Bàba, míngtiān wǒ gēn nǐ yīqǐ qù ba.",
      "Nán: Qù qù qù, xiǎo háizi còu shénme rènao?",
      "Wèn: Nán de shì shénme tàidù?",
    ],
    vietnameseMeaning: [
      "Nữ : Bố ơi, ngày mai con đi cùng bố nhé!",
      "Nam : Đi đi đi, trẻ con thì chen vào làm gì!",
      "Hỏi : Người đàn ông có thái độ như thế nào?",
    ],
    vocabs: ["耐心", "不耐烦", "凑热闹"],
    vocabsPinyin: ["nàixīn", "bù nàifán", "còu rènao"],
    vocabsMeaning: ["Kiên nhẫn", "Mất kiên nhẫn", "Góp vui; tham gia cho vui"],
    explanation: [
      {
        structure: "跟 + người + 一起 + động từ: Cùng ai làm việc gì.",
        example: "我想跟你一起学习中文。",
        examplePinyin: "Wǒ xiǎng gēn nǐ yìqǐ xuéxí Zhōngwén.",
        exampleMeaning: "Tôi muốn học tiếng Trung cùng bạn.",
      },
    ],
  },
];
