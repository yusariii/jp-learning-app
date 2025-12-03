// models/test.model.js
const mongoose = require("mongoose");

/**
 * Cấu hình thời gian chuẩn JLPT cho từng level
 * - total: thời gian tổng đề
 * - sections: thời gian cho từng phần (đơn vị: phút)
 */
const JLPT_TIME_CONFIG = {
  N5: {
    total: 90,
    sections: {
      vocab:    { minutes: 20, title: "文字・語彙" },
      grammar:  { minutes: 40, title: "文法・読解" }, // grammar + reading
      listening:{ minutes: 30, title: "聴解" }
    }
  },
  N4: {
    total: 115,
    sections: {
      vocab:    { minutes: 25, title: "文字・語彙" },
      grammar:  { minutes: 55, title: "文法・読解" },
      listening:{ minutes: 35, title: "聴解" }
    }
  },
  N3: {
    total: 140,
    sections: {
      vocab:    { minutes: 30, title: "文字・語彙" },
      grammar:  { minutes: 70, title: "文法・読解" },
      listening:{ minutes: 40, title: "聴解" }
    }
  },
  N2: {
    total: 155,
    sections: {
      // 3 phần đầu thi chung 105 phút, ở đây chia để luyện tập
      vocab:    { minutes: 30, title: "文字・語彙" },
      grammar:  { minutes: 35, title: "文法" },
      reading:  { minutes: 40, title: "読解" },
      listening:{ minutes: 50, title: "聴解" }
    }
  },
  N1: {
    total: 165,
    sections: {
      vocab:    { minutes: 30, title: "文字・語彙" },
      grammar:  { minutes: 35, title: "文法" },
      reading:  { minutes: 45, title: "読解" },
      listening:{ minutes: 55, title: "聴解" }
    }
  }
};

/**
 * Question Schema – bám sát cấu trúc đề thi Nhật:
 * - section: vocab / kanji / grammar / reading / listening
 * - subtype: phân nhỏ dạng câu hỏi
 * - group/context: gom nhiều câu chung 1 đoạn đọc / 1 file audio
 */
const questionSchema = new mongoose.Schema(
  {
    // Dạng hiển thị / input
    type: {
      type: String,
      enum: [
        "mcq",          // chọn 1 đáp án
        "fill_blank",   // điền vào chỗ trống
        "reorder",      // 並び替え
        "true_false",
        "short_answer", // trả lời ngắn
      ],
      default: "mcq",
    },

    // Phần của đề
    section: {
      type: String,
      enum: ["vocab", "kanji", "grammar", "reading", "listening", "mixed", "other"],
      required: true,
    },

    // Dạng câu chi tiết
    subtype: {
      type: String,
      enum: [
        // Vocab & Kanji
        "kanji_reading",
        "kanji_writing",
        "word_meaning",
        "word_usage",
        "collocation",

        // Grammar
        "grammar_pattern",
        "sentence_completion",
        "reordering",

        // Reading
        "short_reading",
        "medium_reading",
        "long_reading",
        "info_reading",

        // Listening
        "short_listening",
        "dialog_listening",
        "long_listening",
        "announcement_listening",

        // Khác
        "generic",
      ],
      default: "generic",
    },

    // Câu hỏi chính
    promptJP: { type: String, required: true }, // câu hỏi tiếng Nhật
    promptEN: { type: String },                 // dịch / giải thích

    /**
     * Group & Context – đọc hiểu / nghe hiểu:
     * - groupId: id group (READ_N4_01, LIS_N5_03,...)
     * - groupOrder: thứ tự câu trong group
     * - contextJP/EN: đoạn văn / mô tả tình huống
     * - contextRef: liên kết sang collection readings/listenings (nếu dùng)
     */
    groupId: { type: String },
    groupOrder: { type: Number },

    contextJP: { type: String },
    contextEN: { type: String },

    contextRef: {
      readingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reading",
      },
      listeningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listening",
      },
    },

    /**
     * Media cho listening / hình ảnh:
     */
    mediaUrl: { type: String },
    mediaScriptJP: { type: String },
    mediaScriptEN: { type: String },

    /**
     * Options cho mcq / true_false / multi-select
     */
    options: [
      {
        label: { type: String }, // A / B / C / D (optional)
        text: { type: String },
        isCorrect: { type: Boolean, default: false },
      },
    ],

    /**
     * orderItems: dùng cho dạng reorder (並び替え)
     * answer: có thể là array index correct, ví dụ [2,0,1,3]
     */
    orderItems: [{ type: String }],

    /**
     * answer:
     * - mcq: index / value / id
     * - fill_blank: string hoặc array string
     * - reorder: array index
     * - true_false: true/false
     * - short_answer: string
     */
    answer: { type: mongoose.Schema.Types.Mixed },

    // Giải thích đáp án
    explanationJP: { type: String },
    explanationVI: { type: String },

    // Điểm số
    points: { type: Number, default: 1 },

    // Tag linh hoạt
    tags: [{ type: String }],
  },
  { _id: false }
);

/**
 * Section Schema – mô tả từng phần của đề (文字・語彙, 文法・読解, 聴解,...)
 */
const sectionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["vocab", "kanji", "grammar", "reading", "listening", "mixed"],
      required: true,
    },
    title: { type: String },          // 文字・語彙, 文法・読解, ...
    instructionsJP: { type: String }, // hướng dẫn tiếng Nhật
    instructionsEN: { type: String }, // dịch nếu cần
    order: { type: Number, default: 1 },
    questionCount: { type: Number },
    timeLimitMinutes: { type: Number, default: 0 }, // thời gian phần này
  },
  { _id: false }
);

/**
 * Test Schema – 1 đề thi JLPT giả lập / đề kiểm tra
 */
const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // N5–N1
    level: {
      type: String,
      enum: ["N5", "N4", "N3", "N2", "N1"],
      required: true,
    },

    /**
     * type:
     * - vocab / grammar / reading / listening / mixed
     */
    type: {
      type: String,
      enum: ["listening", "reading", "vocab", "grammar", "mixed"],
      default: "mixed",
    },

    description: { type: String, default: "" },

    // Các phần của đề
    sections: [sectionSchema],

    // Danh sách câu hỏi
    questions: [questionSchema],

    // Thời gian tổng cho toàn đề (phút)
    timeLimitMinutes: { type: Number, default: 0 },

    // % để đậu
    passingScorePercent: { type: Number, default: 70 },

    published: { type: Boolean, default: false },

    // Ai tạo / sửa
    createdBy: { adminId: String },
    updatedBy: { adminId: String },
  },
  { timestamps: true }
);

/**
 * Middleware: tự fix cứng thời gian theo level (N5–N1)
 * - Nếu không truyền timeLimitMinutes ⇒ tự set total theo JLPT_TIME_CONFIG
 * - Nếu không truyền sections ⇒ tự generate sections chuẩn
 * - Nếu đã có sections nhưng thiếu title / timeLimitMinutes ⇒ auto fill
 */
testSchema.pre("validate", function (next) {
  const cfg = JLPT_TIME_CONFIG[this.level];
  if (!cfg) return next();

  // Thời gian tổng đề
  if (!this.timeLimitMinutes || this.timeLimitMinutes <= 0) {
    this.timeLimitMinutes = cfg.total;
  }

  // Nếu đã có sections: chỉ fill chỗ còn thiếu
  if (Array.isArray(this.sections) && this.sections.length > 0) {
    this.sections.forEach((sec, idx) => {
      const secCfg = cfg.sections[sec.section];
      if (!secCfg) return;

      if (!sec.title) {
        sec.title = secCfg.title;
      }
      if (!sec.timeLimitMinutes || sec.timeLimitMinutes <= 0) {
        sec.timeLimitMinutes = secCfg.minutes;
      }
      if (!sec.order) {
        sec.order = idx + 1;
      }
    });
  } else {
    // Không truyền sections → auto tạo sections chuẩn JLPT
    this.sections = [];
    let order = 1;
    Object.keys(cfg.sections).forEach((key) => {
      const info = cfg.sections[key];
      this.sections.push({
        section: key,              // vocab / grammar / reading / listening
        title: info.title,
        order,
        timeLimitMinutes: info.minutes,
      });
      order += 1;
    });
  }

  next();
});

const Test = mongoose.model("Test", testSchema, "tests");
module.exports = Test;
