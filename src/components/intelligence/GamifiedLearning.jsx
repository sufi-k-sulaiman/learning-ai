import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, Target, Zap, CheckCircle2, XCircle, 
    Sparkles, Star, Brain, Award, Loader2, RotateCcw
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import confetti from 'canvas-confetti';

export default function GamifiedLearning({ item, category }) {
    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [answered, setAnswered] = useState([]);

    useEffect(() => {
        fetchQuizData();
    }, [item]);

    const fetchQuizData = async () => {
        setLoading(true);
        setQuizComplete(false);
        setScore(0);
        setStreak(0);
        setCurrentQuestion(0);
        setAnswered([]);
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Create an engaging, educational quiz about "${item}" (${category?.name}). 

                Generate 10 bite-sized quiz questions:
- Mix multiple choice, true/false, and interactive formats
- Make them fun and engaging with friendly language
- Include a mix of difficulty levels (easy, medium, hard)
- Each question should teach something new
- Add interesting fun facts for each correct answer

For each question provide:
1. question: the question text
2. type: "multiple_choice" or "true_false"
3. options: array of 4 options for multiple choice, or ["True", "False"] for true/false
4. correctAnswer: the correct option text
5. explanation: why this is correct + interesting fact (2-3 sentences)
6. difficulty: "easy", "medium", or "hard"
7. points: 10 for easy, 20 for medium, 30 for hard`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    type: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctAnswer: { type: "string" },
                                    explanation: { type: "string" },
                                    difficulty: { type: "string" },
                                    points: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });
            
            setQuizData(response);
        } catch (error) {
            console.error('Failed to fetch quiz data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (option) => {
        if (showResult) return;
        setSelectedAnswer(option);
    };

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;
        
        const question = quizData.questions[currentQuestion];
        const correct = selectedAnswer === question.correctAnswer;
        
        setIsCorrect(correct);
        setShowResult(true);
        
        if (correct) {
            setScore(score + question.points);
            setStreak(streak + 1);
            
            // Trigger confetti for correct answers
            if (streak >= 2) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [category?.color || '#6209e6', '#FFD700', '#FF69B4']
                });
            }
        } else {
            setStreak(0);
        }
        
        setAnswered([...answered, { question: currentQuestion, correct, answer: selectedAnswer }]);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizComplete(true);
            if (score >= quizData.questions.reduce((sum, q) => sum + q.points, 0) * 0.8) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 }
                });
            }
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: category?.color }} />
                    <p className="text-gray-500">Generating fun learning challenges...</p>
                </div>
            </div>
        );
    }

    if (!quizData?.questions?.length) {
        return null;
    }

    if (quizComplete) {
        const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0);
        const percentage = Math.round((score / totalPoints) * 100);
        const correctCount = answered.filter(a => a.correct).length;

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
                <div className="text-center px-6 py-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color}15` }}
                    >
                        <Trophy className="w-12 h-12" style={{ color: category?.color }} />
                    </motion.div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Quiz Complete! 🎉</h3>
                    <p className="text-gray-600 text-lg mb-8">Great job learning about {item}!</p>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-8">
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                            <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: category?.color }}>{score}</div>
                            <div className="text-xs sm:text-sm text-gray-500 font-medium">Total Points</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{correctCount}/{quizData.questions.length}</div>
                            <div className="text-xs sm:text-sm text-gray-500 font-medium">Correct</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{percentage}%</div>
                            <div className="text-xs sm:text-sm text-gray-500 font-medium">Accuracy</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        {percentage >= 80 && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-50 text-yellow-800 rounded-full border-2 border-yellow-200">
                                <Award className="w-6 h-6" />
                                <span className="font-bold text-lg">Master Level!</span>
                            </div>
                        )}
                        {percentage >= 60 && percentage < 80 && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-800 rounded-full border-2 border-blue-200">
                                <Star className="w-6 h-6" />
                                <span className="font-bold text-lg">Well Done!</span>
                            </div>
                        )}
                        {percentage < 60 && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-800 rounded-full border-2 border-purple-200">
                                <Brain className="w-6 h-6" />
                                <span className="font-bold text-lg">Keep Learning!</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={fetchQuizData}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        style={{ backgroundColor: category?.color }}
                    >
                        <RotateCcw className="w-5 h-5" />
                        Try New Quiz
                    </button>
                </div>
            </motion.div>
        );
    }

    const question = quizData.questions[currentQuestion];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r p-6 text-white" style={{ background: `linear-gradient(135deg, ${category?.color}dd, ${category?.color}99)` }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6" />
                        <h3 className="text-lg font-bold">Interactive Learning</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                            <Zap className="w-4 h-4" />
                            <span className="font-bold">{streak}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                            <Trophy className="w-4 h-4" />
                            <span className="font-bold">{score}</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                    {quizData.questions.map((_, i) => (
                        <div 
                            key={i}
                            className={`h-2 flex-1 rounded-full ${
                                i < currentQuestion ? 'bg-white' : 
                                i === currentQuestion ? 'bg-white/60' : 
                                'bg-white/20'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-white/80 text-sm">Question {currentQuestion + 1} of {quizData.questions.length}</p>
            </div>

            {/* Question Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {question.points} points
                            </span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900">{question.question}</h4>
                    </div>
                    <Target className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mb-6">
                    <AnimatePresence>
                        {question.options.map((option, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showResult}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                    selectedAnswer === option
                                        ? `border-purple-500 shadow-md`
                                        : 'border-gray-200 hover:border-gray-300'
                                } ${
                                    showResult && option === question.correctAnswer
                                        ? 'bg-green-50 border-green-500'
                                        : showResult && selectedAnswer === option && !isCorrect
                                        ? 'bg-red-50 border-red-500'
                                        : 'bg-white'
                                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{option}</span>
                                    {showResult && option === question.correctAnswer && (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    )}
                                    {showResult && selectedAnswer === option && !isCorrect && (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Explanation */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl mb-6 ${
                                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <Sparkles className={`w-5 h-5 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-blue-600'}`} />
                                <div>
                                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
                                        {isCorrect ? '🎉 Correct!' : '💡 Good try!'}
                                    </p>
                                    <p className="text-sm text-gray-700">{question.explanation}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Button */}
                {!showResult ? (
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                        className={`w-full py-3 rounded-xl font-medium text-white transition-all ${
                            selectedAnswer
                                ? 'shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                                : 'opacity-50 cursor-not-allowed'
                        }`}
                        style={{ backgroundColor: category?.color }}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                        style={{ backgroundColor: category?.color }}
                    >
                        {currentQuestion < quizData.questions.length - 1 ? 'Next Question →' : 'See Results 🎯'}
                    </button>
                )}
            </div>
        </div>
    );
}