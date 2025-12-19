import React, { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import { 
    Brain, Loader2, Sparkles, Trophy, Flame, Star, Zap, Lock, CheckCircle2, PlayCircle,
    Award, TrendingUp, Target, Rocket, Crown, Gift, ChevronRight, X
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';

const TOPICS = {
    science: { name: 'Science', icon: Sparkles, color: '#3B82F6', emoji: '🔬' },
    history: { name: 'History', icon: Star, color: '#F59E0B', emoji: '📜' },
    nature: { name: 'Nature', icon: Brain, color: '#22C55E', emoji: '🌿' },
    technology: { name: 'Technology', icon: Zap, color: '#8B5CF6', emoji: '💻' },
    space: { name: 'Space', icon: Rocket, color: '#EC4899', emoji: '🚀' }
};

const ACHIEVEMENTS = [
    { id: 'first_lesson', name: 'First Steps', icon: Star, requirement: 1, description: 'Complete your first lesson' },
    { id: 'streak_3', name: 'On Fire', icon: Flame, requirement: 3, description: 'Maintain a 3-day streak' },
    { id: 'streak_7', name: 'Unstoppable', icon: Trophy, requirement: 7, description: 'Maintain a 7-day streak' },
    { id: 'level_5', name: 'Knowledge Seeker', icon: Crown, requirement: 5, description: 'Reach level 5' },
    { id: 'level_10', name: 'Master Learner', icon: Award, requirement: 10, description: 'Reach level 10' }
];

export default function Intelligence() {
    const [user, setUser] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [lessonData, setLessonData] = useState(null);
    const [loadingLesson, setLoadingLesson] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswer, setQuizAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [showChallenge, setShowChallenge] = useState(false);

    useEffect(() => {
        initializeUser();
    }, []);

    const initializeUser = async () => {
        try {
            const userData = await base44.auth.me();
            setUser(userData);
            
            const progress = await base44.entities.UserProgress.filter({ created_by: userData.email });
            if (progress.length === 0) {
                const newProgress = await base44.entities.UserProgress.create({
                    xp: 0,
                    level: 1,
                    streak: 0,
                    completed_lessons: [],
                    achievements: []
                });
                setUserProgress(newProgress);
            } else {
                setUserProgress(progress[0]);
                checkStreak(progress[0]);
            }

            await loadDailyChallenge();
        } catch (error) {
            console.error('Failed to initialize user:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkStreak = async (progress) => {
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = progress.last_activity_date;
        
        if (!lastActivity) return;
        
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
            await base44.entities.UserProgress.update(progress.id, { streak: 0 });
            setUserProgress({ ...progress, streak: 0 });
        }
    };

    const loadDailyChallenge = async () => {
        const today = new Date().toISOString().split('T')[0];
        const challenges = await base44.entities.DailyChallenge.filter({ date: today });
        
        if (challenges.length > 0) {
            setDailyChallenge(challenges[0]);
        } else {
            const topics = Object.keys(TOPICS);
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            
            const challengeData = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a fun, engaging daily challenge question about ${TOPICS[randomTopic].name}. 
                Make it educational but entertaining. Include 4 multiple choice options.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correct_answer: { type: "number" }
                    }
                }
            });

            const newChallenge = await base44.entities.DailyChallenge.create({
                date: today,
                topic: randomTopic,
                ...challengeData,
                xp_reward: 50
            });
            
            setDailyChallenge(newChallenge);
        }
    };

    const startLesson = async (topicKey) => {
        setSelectedTopic(topicKey);
        setLoadingLesson(true);
        setShowQuiz(false);
        setShowResult(false);
        
        const topic = TOPICS[topicKey];
        const lessonId = `${topicKey}_${Date.now()}`;
        setCurrentLesson(lessonId);

        try {
            const data = await base44.integrations.Core.InvokeLLM({
                prompt: `Create a bite-sized, engaging lesson about ${topic.name}. 
                Make it fun, conversational, and easy to understand. Include:
                1. A catchy title (under 50 chars)
                2. A brief, engaging introduction (2-3 sentences)
                3. 3 key learning points (each under 100 chars)
                4. A fun fact
                5. A simple quiz question with 4 options
                Keep it light, motivating, and suitable for all ages!`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        intro: { type: "string" },
                        keyPoints: { type: "array", items: { type: "string" } },
                        funFact: { type: "string" },
                        quiz: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                options: { type: "array", items: { type: "string" } },
                                correctIndex: { type: "number" }
                            }
                        }
                    }
                }
            });

            setLessonData(data);
        } catch (error) {
            console.error('Failed to load lesson:', error);
        } finally {
            setLoadingLesson(false);
        }
    };

    const completeLesson = async (earnedXP) => {
        const today = new Date().toISOString().split('T')[0];
        const newXP = userProgress.xp + earnedXP;
        const newLevel = Math.floor(newXP / 100) + 1;
        
        let newStreak = userProgress.streak;
        if (userProgress.last_activity_date !== today) {
            newStreak = (userProgress.last_activity_date === new Date(Date.now() - 86400000).toISOString().split('T')[0]) 
                ? userProgress.streak + 1 
                : 1;
        }

        const updatedProgress = {
            xp: newXP,
            level: newLevel,
            streak: newStreak,
            last_activity_date: today,
            completed_lessons: [...userProgress.completed_lessons, currentLesson]
        };

        const newAchievements = [...userProgress.achievements];
        ACHIEVEMENTS.forEach(achievement => {
            if (!newAchievements.includes(achievement.id)) {
                if (achievement.id === 'first_lesson' && updatedProgress.completed_lessons.length === 1) {
                    newAchievements.push(achievement.id);
                    showAchievementUnlock(achievement);
                } else if (achievement.id === 'streak_3' && newStreak >= 3) {
                    newAchievements.push(achievement.id);
                    showAchievementUnlock(achievement);
                } else if (achievement.id === 'streak_7' && newStreak >= 7) {
                    newAchievements.push(achievement.id);
                    showAchievementUnlock(achievement);
                } else if (achievement.id === 'level_5' && newLevel >= 5) {
                    newAchievements.push(achievement.id);
                    showAchievementUnlock(achievement);
                } else if (achievement.id === 'level_10' && newLevel >= 10) {
                    newAchievements.push(achievement.id);
                    showAchievementUnlock(achievement);
                }
            }
        });

        updatedProgress.achievements = newAchievements;

        await base44.entities.UserProgress.update(userProgress.id, updatedProgress);
        setUserProgress({ ...userProgress, ...updatedProgress });

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const showAchievementUnlock = (achievement) => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 }
        });
    };

    const submitQuizAnswer = async () => {
        const isCorrect = quizAnswer === lessonData.quiz.correctIndex;
        setShowResult(true);
        
        if (isCorrect) {
            await completeLesson(25);
        }
    };

    const submitDailyChallenge = async (selectedAnswer) => {
        const isCorrect = selectedAnswer === dailyChallenge.correct_answer;
        
        if (isCorrect && !dailyChallenge.completed_by.includes(user.email)) {
            await base44.entities.DailyChallenge.update(dailyChallenge.id, {
                completed_by: [...dailyChallenge.completed_by, user.email]
            });
            await completeLesson(50);
        }
        
        setShowChallenge(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const progressToNextLevel = ((userProgress.xp % 100) / 100) * 100;
    const hasCompletedChallenge = dailyChallenge?.completed_by?.includes(user.email);

    return (
        <>
            <PageMeta 
                title="Intelligence - Learn & Grow"
                description="Master new skills with bite-sized lessons, daily challenges, and gamified learning"
                keywords="learning app, education, gamified learning, daily challenges"
            />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Stats */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h1>
                                <p className="text-gray-600">Keep learning, keep growing!</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-purple-600">Level {userProgress.level}</div>
                                <div className="text-sm text-gray-500">{userProgress.xp} XP</div>
                            </div>
                        </div>
                        
                        <Progress value={progressToNextLevel} className="h-3 mb-4" />
                        <p className="text-sm text-gray-600 text-center">{100 - (userProgress.xp % 100)} XP to next level</p>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                <div className="text-2xl font-bold text-orange-600">{userProgress.streak}</div>
                                <div className="text-xs text-orange-700">Day Streak</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                <div className="text-2xl font-bold text-blue-600">{userProgress.completed_lessons.length}</div>
                                <div className="text-xs text-blue-700">Lessons Done</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                                <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                <div className="text-2xl font-bold text-purple-600">{userProgress.achievements.length}</div>
                                <div className="text-xs text-purple-700">Achievements</div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge */}
                    {dailyChallenge && (
                        <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 mb-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => !hasCompletedChallenge && setShowChallenge(true)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            Daily Challenge {hasCompletedChallenge && <CheckCircle2 className="w-5 h-5" />}
                                        </h3>
                                        <p className="text-white/90">Earn 50 XP today!</p>
                                    </div>
                                </div>
                                {!hasCompletedChallenge && <ChevronRight className="w-6 h-6" />}
                            </div>
                        </Card>
                    )}

                    {/* Topics Grid */}
                    {!selectedTopic && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Adventure</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(TOPICS).map(([key, topic]) => {
                                    const Icon = topic.icon;
                                    return (
                                        <Card 
                                            key={key}
                                            className="p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all bg-white"
                                            onClick={() => startLesson(key)}
                                        >
                                            <div className="text-center">
                                                <div className="text-5xl mb-3">{topic.emoji}</div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.name}</h3>
                                                <Button className="w-full mt-3" style={{ backgroundColor: topic.color }}>
                                                    <PlayCircle className="w-4 h-4 mr-2" />
                                                    Start Learning
                                                </Button>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lesson View */}
                    {selectedTopic && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <button 
                                onClick={() => {
                                    setSelectedTopic(null);
                                    setLessonData(null);
                                    setShowQuiz(false);
                                }}
                                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                            >
                                ← Back to Topics
                            </button>

                            {loadingLesson ? (
                                <div className="text-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-purple-600" />
                                    <p className="text-gray-600">Preparing your lesson...</p>
                                </div>
                            ) : lessonData && (
                                <div>
                                    {!showQuiz ? (
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">{TOPICS[selectedTopic].emoji}</div>
                                                <h2 className="text-3xl font-bold text-gray-900 mb-3">{lessonData.title}</h2>
                                                <p className="text-lg text-gray-600">{lessonData.intro}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-xl font-bold text-gray-900">Key Takeaways</h3>
                                                {lessonData.keyPoints.map((point, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                                                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-gray-800">{point}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="w-5 h-5 text-yellow-600" />
                                                    <h4 className="font-bold text-yellow-900">Fun Fact!</h4>
                                                </div>
                                                <p className="text-gray-700">{lessonData.funFact}</p>
                                            </div>

                                            <Button 
                                                onClick={() => setShowQuiz(true)}
                                                className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                            >
                                                Take the Quiz! 🎯
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-gray-900">{lessonData.quiz.question}</h3>
                                            
                                            <div className="space-y-3">
                                                {lessonData.quiz.options.map((option, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => !showResult && setQuizAnswer(i)}
                                                        disabled={showResult}
                                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                                            showResult
                                                                ? i === lessonData.quiz.correctIndex
                                                                    ? 'bg-green-50 border-green-500'
                                                                    : i === quizAnswer
                                                                    ? 'bg-red-50 border-red-500'
                                                                    : 'bg-gray-50 border-gray-200'
                                                                : quizAnswer === i
                                                                ? 'bg-purple-50 border-purple-500'
                                                                : 'bg-white border-gray-200 hover:border-purple-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                                showResult && i === lessonData.quiz.correctIndex
                                                                    ? 'bg-green-500 text-white'
                                                                    : showResult && i === quizAnswer
                                                                    ? 'bg-red-500 text-white'
                                                                    : quizAnswer === i
                                                                    ? 'bg-purple-500 text-white'
                                                                    : 'bg-gray-200 text-gray-700'
                                                            }`}>
                                                                {String.fromCharCode(65 + i)}
                                                            </div>
                                                            <span className="flex-1">{option}</span>
                                                            {showResult && i === lessonData.quiz.correctIndex && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {!showResult && quizAnswer !== null && (
                                                <Button onClick={submitQuizAnswer} className="w-full py-6 text-lg bg-purple-600">
                                                    Submit Answer
                                                </Button>
                                            )}

                                            {showResult && (
                                                <div className={`p-6 rounded-xl ${
                                                    quizAnswer === lessonData.quiz.correctIndex
                                                        ? 'bg-green-50 border-2 border-green-500'
                                                        : 'bg-blue-50 border-2 border-blue-500'
                                                }`}>
                                                    <h4 className="text-xl font-bold mb-2">
                                                        {quizAnswer === lessonData.quiz.correctIndex ? '🎉 Correct!' : '💡 Keep Learning!'}
                                                    </h4>
                                                    <p className="text-gray-700 mb-4">
                                                        {quizAnswer === lessonData.quiz.correctIndex 
                                                            ? 'Great job! You earned 25 XP!' 
                                                            : 'Don\'t worry, every mistake is a learning opportunity!'}
                                                    </p>
                                                    <Button 
                                                        onClick={() => {
                                                            setSelectedTopic(null);
                                                            setLessonData(null);
                                                            setShowQuiz(false);
                                                            setShowResult(false);
                                                        }}
                                                        className="w-full"
                                                    >
                                                        Continue Learning
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Daily Challenge Modal */}
                {showChallenge && dailyChallenge && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Daily Challenge 🎯</h3>
                                <button onClick={() => setShowChallenge(false)}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-lg mb-6">{dailyChallenge.question}</p>
                            <div className="space-y-3">
                                {dailyChallenge.options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => submitDailyChallenge(i)}
                                        className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-left transition-all"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}