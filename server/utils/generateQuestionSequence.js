function generateQuestionSequence(questions) {
    const totalQuestions = questions.length;
    const questionSequence = Array.from({ length: totalQuestions }, (_, i) => i); // Create an array of indices

    // Fisher-Yates Shuffle
    for (let i = totalQuestions - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
        [questionSequence[i], questionSequence[j]] = [questionSequence[j], questionSequence[i]]; // Swap
    }

    return questionSequence;
}

module.exports = { generateQuestionSequence };