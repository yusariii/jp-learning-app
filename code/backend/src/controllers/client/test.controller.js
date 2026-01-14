const Test = require('../../models/test.model');
const UserProgress = require('../../models/user.model');

// Get all published tests
exports.list = async (req, res) => {
  try {
    const { jlptLevel, limit = 10, offset = 0 } = req.query;
    const query = { published: true };
    
    if (jlptLevel) {
      query.jlptLevel = jlptLevel;
    }

    const total = await Test.countDocuments(query);
    const tests = await Test.find(query)
      .select('title jlptLevel description totalTime passingScorePercent')
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      tests,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get test detail with all questions
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json({ test });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit test answers and calculate score
exports.submit = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // answers = { [questionId]: selectedIndex, ... }
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Flatten all questions from all sections
    let allQuestions = [];
    let sectionScores = {
      vocab: 0,
      grammarReading: 0,
      listening: 0,
    };
    let totalScore = 0;
    let totalPoints = 0;

    // Process vocab section
    if (test.vocabSection?.vocabUnits) {
      test.vocabSection.vocabUnits.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          const qId = `vocab-${unit._id}-${idx}`;
          allQuestions.push({
            id: qId,
            section: 'vocab',
            points: q.points || 1,
            correctIndex: q.correctIndex,
          });
          totalPoints += q.points || 1;

          if (answers[qId] !== undefined && answers[qId] === q.correctIndex) {
            sectionScores.vocab += q.points || 1;
            totalScore += q.points || 1;
          }
        });
      });
    }

    // Process grammar & reading section
    if (test.grammarReadingSection?.grammarUnits) {
      test.grammarReadingSection.grammarUnits.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          const qId = `gram-${unit._id}-${idx}`;
          allQuestions.push({
            id: qId,
            section: 'grammarReading',
            points: q.points || 1,
            correctIndex: q.correctIndex,
          });
          totalPoints += q.points || 1;

          if (answers[qId] !== undefined && answers[qId] === q.correctIndex) {
            sectionScores.grammarReading += q.points || 1;
            totalScore += q.points || 1;
          }
        });
      });
    }

    if (test.grammarReadingSection?.readingUnits) {
      test.grammarReadingSection.readingUnits.forEach((unit) => {
        unit.passages?.forEach((passage) => {
          passage.questions?.forEach((q, idx) => {
            const qId = `read-${passage._id}-${idx}`;
            allQuestions.push({
              id: qId,
              section: 'grammarReading',
              points: q.points || 1,
              correctIndex: q.correctIndex,
            });
            totalPoints += q.points || 1;

            if (answers[qId] !== undefined && answers[qId] === q.correctIndex) {
              sectionScores.grammarReading += q.points || 1;
              totalScore += q.points || 1;
            }
          });
        });
      });
    }

    // Process listening section
    if (test.listeningSection?.listeningUnits) {
      test.listeningSection.listeningUnits.forEach((unit) => {
        unit.questions?.forEach((q, idx) => {
          const qId = `listen-${unit._id}-${idx}`;
          allQuestions.push({
            id: qId,
            section: 'listening',
            points: q.points || 1,
            correctIndex: q.correctIndex,
          });
          totalPoints += q.points || 1;

          if (answers[qId] !== undefined && answers[qId] === q.correctIndex) {
            sectionScores.listening += q.points || 1;
            totalScore += q.points || 1;
          }
        });
      });
    }

    const scorePercent = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;
    const passed = scorePercent >= (test.passingScorePercent || 70);

    // Save result to user progress (optional)
    // await UserProgress.updateOne(
    //   { userId },
    //   {
    //     $push: {
    //       testResults: {
    //         testId: id,
    //         score: scorePercent,
    //         passed,
    //         completedAt: new Date(),
    //       }
    //     }
    //   }
    // );

    res.json({
      testId: id,
      totalScore,
      totalPoints,
      scorePercent,
      passed,
      sectionScores,
      passingScore: test.passingScorePercent || 70,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
