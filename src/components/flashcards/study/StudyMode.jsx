import { useMemo, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../../../contexts/AuthContext';
import { useStudySession } from '../../../hooks/useStudySession';
import { useCardPreview } from '../../../hooks/useCardPreview';
import StudyCard from './StudyCard';
import StudyProgressBar from './StudyProgressBar';
import RatingButtons from './RatingButtons';
import StudyStats from './StudyStats';
import StudySearchBar from './StudySearchBar';
import NavButtons from './NavButtons';

/**
 * StudyMode - Main study session container
 * Orchestrates study flow with search/preview functionality
 */
const StudyMode = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const location = useLocation();

    const {
        session,
        deck,
        currentCard,
        currentCardIndex,
        setCurrentCardIndex,
        isFlipped,
        loading,
        error,
        cards,
        stats,
        localRatings,
        trackProgress,
        setTrackProgress,
        handleFlip,
        handleRating,
        saveSession,
        shuffleCards
    } = useStudySession(deckId, currentUser?.uid);

    // Search and preview mode logic
    const {
        searchTerm,
        setSearchTerm,
        filteredResults,
        clearSearch,
        previewMode,
        studyPosition,
        handleJumpToCard,
        handleReturnToStudy
    } = useCardPreview(cards, currentCardIndex, setCurrentCardIndex);

    const buttonsRef = useRef(null);

    // --- Review Again (Still Learning-only) ---
    const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
    const [isReviewingDifficult, setIsReviewingDifficult] = useState(false);
    const [difficultIndices, setDifficultIndices] = useState([]);
    const [difficultPtr, setDifficultPtr] = useState(0);

    // Visual feedback for the shuffle button
    const [isShuffling, setIsShuffling] = useState(false);

    // Quiz Study Mode
    const [mode, setMode] = useState('study');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const startQuizMode = () => {
        const cardsList = Array.isArray(cards) ? cards : Object.values(cards || {});

        if (cardsList.length === 0) {
            console.warn("No cards available to start quiz mode.");
            return;
        }

        clearSearch();

        const questions = cardsList.map((card, index) => {
            const otherCards = cardsList.filter((_, i) => i !== index);
            const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random());
            const distractors = shuffledOthers.slice(0, 3).map((c) => c.back);
            const options = [...distractors, card.back].sort(() => 0.5 - Math.random());

            return {
                question: card.front,
                correctAnswer: card.back,
                options: options,
            };
        });

        setQuizQuestions(questions);
        setQuizIndex(0);
        setQuizScore(0);
        setSelectedOption(null);
        setIsQuizFinished(false);
        setMode('quiz');
    };

    const handleQuizNext = () => {
        const currentQuestion = quizQuestions[quizIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setQuizScore((prevScore) => prevScore + 1);
        }
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex((prevIndex) => prevIndex + 1);
            setSelectedOption(null);
        } else {
            setIsQuizFinished(true);
        }
    };
    // Derive difficult cards from ratings — always in sync with whatever
    // is in localRatings, including restored ratings from a resumed session.
    const difficultCardIds = useMemo(() => {
        return new Set(
            (localRatings || [])
                .filter(r => r.rating === 'still learning')
                .map(r => r.cardId)
        );
    }, [localRatings]);

    const difficultCount = difficultCardIds.size;

    const buildDifficultIndices = useMemo(() => {
        return (cards || []).reduce((acc, c, idx) => {
            if (difficultCardIds.has(c?.id)) acc.push(idx);
            return acc;
        }, []);
    }, [cards, difficultCardIds]);

    const startDifficultReview = () => {
        const idxs = buildDifficultIndices;
        if (!idxs || idxs.length === 0) return;

        clearSearch();

        setIsReviewingDifficult(true);
        setDifficultIndices(idxs);
        setDifficultPtr(0);
        setShowCompletionPrompt(false);

        setCurrentCardIndex(idxs[0]);

        if (isFlipped) handleFlip();
    };

    const handleShuffleClick = async () => {
        if (isReviewingDifficult) return;

        clearSearch();

        setIsShuffling(true);
        try {
            await shuffleCards();
            if (isFlipped) handleFlip();
        } finally {
            setTimeout(() => setIsShuffling(false), 400);
        }
    };

    const goToResults = async (sessionId) => {
        navigate(`/flashcards/study/${deckId}/results`, {
            state: { sessionId, from: location.state?.from }
        });
    };

    const onRatingClick = async (rating) => {
        if (isReviewingDifficult) {
            await handleRating(rating);

            const nextPtr = difficultPtr + 1;

            if (isFlipped) handleFlip();

            if (nextPtr >= difficultIndices.length) {
                setIsReviewingDifficult(false);
                setDifficultIndices([]);
                setDifficultPtr(0);
                setShowCompletionPrompt(true);
                return;
            }



            setDifficultPtr(nextPtr);
            setCurrentCardIndex(difficultIndices[nextPtr]);
            return;
        }

        const result = await handleRating(rating);

        if (result?.completed) {
            if (difficultCardIds.size > 0 || rating === 'still learning') {
                setShowCompletionPrompt(true);
            } else {
                goToResults(result.sessionId);
            }
        }
    };

    const handleNextClick = () => {
        if (isFlipped) handleFlip();

        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const handlePrevClick = () => {
        if (isFlipped) handleFlip();

        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <ClipLoader color="var(--primary-400)" size={50} />
                    <p className="text-lg text-secondary">Loading study session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-content">
                <div className="max-w-md mx-auto mt-20">
                    <div className="card border-2 border-error text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gradient-primary">Error Loading Study Session</h2>
                        <p className="text-secondary">{error}</p>
                        <button
                            onClick={() => navigate(location.state?.from || '/dashboard')}
                            className="btn btn-primary"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!deck || !session || !currentCard) {
        return (
            <div className="dashboard-content ">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="card text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gradient-primary">Study Session Not Found</h2>
                        <button
                            onClick={() => navigate(location.state?.from || '/dashboard')}
                            className="btn btn-primary"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showCompletionPrompt) {
        return (
            <div className="dashboard-content">
                <div className="max-w-2xl mx-auto mt-16">
                    <div className="card text-center space-y-6">
                        <h2 className="text-3xl font-bold text-gradient-primary">Session Complete 🎉</h2>
                        <p className="text-secondary">
                            {difficultCount > 0
                                ? `You marked ${difficultCount} card${difficultCount === 1 ? '' : 's'} as still learning.`
                                : 'No difficult cards were marked.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {difficultCount > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={startDifficultReview}
                                >
                                    Review Again
                                </button>
                            )}

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(location.state?.from || '/dashboard')}
                            >
                                Exit
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => goToResults(session?.id)}
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gradient-primary">{deck.title}</h1>
                    <div className="flex items-center gap-3">
                        {/* Toggle Quiz / Study Mode */}
                        {mode === 'study' ? (
                            <button
                                className="px-4 py-2 bg-[var(--success)] text-white rounded-lg font-semibold shadow-md transition hover:opacity-90"
                                onClick={startQuizMode}
                                disabled={cards.length === 0}
                            >
                                Take Quiz
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
                                onClick={() => setMode('study')}
                            >
                                🔙 Back to Flashcards
                            </button>
                        )}

                        <button
                            className="px-4 py-2 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleShuffleClick}
                            disabled={isShuffling || isReviewingDifficult || cards.length <= 1 || mode === 'quiz'}
                            aria-label="Shuffle cards"
                            title={isReviewingDifficult ? 'Cannot shuffle during review' : 'Shuffle remaining cards'}
                        >
                            {isShuffling ? 'Shuffling...' : '🔀 Shuffle'}
                        </button>
                        <button
                            className="px-4 py-2 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
                            onClick={() => navigate(location.state?.from || '/dashboard')}
                            aria-label="Exit"
                        >
                            Exit
                        </button>
                    </div>
                </div>

                {/* QUIZ MODE VIEW */}
                {mode === 'quiz' && !isQuizFinished && quizQuestions.length > 0 && (
                    <div className="card p-8 space-y-6 max-w-2xl mx-auto border-2 border-accent">
                        <div className="text-sm font-medium text-secondary">
                            Question {quizIndex + 1} of {quizQuestions.length}
                        </div>

                        <h3 className="text-2xl font-bold text-primary text-center">
                            {quizQuestions[quizIndex].question}
                        </h3>

                        <div className="space-y-3">
                            {quizQuestions[quizIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                        selectedOption === option
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 font-semibold'
                                            : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleQuizNext}
                            disabled={!selectedOption}
                            className="w-full py-3 bg-[var(--primary-400)] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                        >
                            {quizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}

                {/* QUIZ RESULTS VIEW */}
                {mode === 'quiz' && isQuizFinished && (
                    <div className="card p-8 text-center space-y-6 max-w-2xl mx-auto border-2 border-accent">
                        <h2 className="text-3xl font-bold text-gradient-primary">Quiz Complete! 🎉</h2>
                        <p className="text-lg text-secondary">
                            Your Score: <span className="font-bold text-[var(--accent)]">{quizScore}</span> / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={startQuizMode}
                                className="btn btn-primary px-6 py-3"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => setMode('study')}
                                className="btn btn-secondary px-6 py-3"
                            >
                                Return to Flashcards
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar with Preview Mode Indicator */}
                <StudySearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onClearSearch={clearSearch}
                    filteredResults={filteredResults}
                    onJumpToCard={handleJumpToCard}
                    previewMode={previewMode}
                    studyPosition={studyPosition}
                    onReturnToStudy={handleReturnToStudy}
                />

                {/* Progress: bar when tracking, simple counter when not */}
                {isReviewingDifficult ? (
                    <StudyProgressBar
                        currentIndex={difficultPtr}
                        total={difficultIndices.length || 0}
                    />
                ) : trackProgress ? (
                    <StudyProgressBar
                        currentIndex={localRatings.length}
                        total={cards.length || 0}
                    />
                ) : (
                    <div className="text-center text-secondary text-sm">
                        Card {currentCardIndex + 1} of {cards.length}
                    </div>
                )}

                {/* Toggle for tracking progress */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm">Track Progress</span>
                    <div
                        onClick={() => setTrackProgress(!trackProgress)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${trackProgress ? 'bg-[var(--primary-400)]' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${trackProgress ? 'translate-x-7' : 'translate-x-1'
                                }`}
                        />
                    </div>
                </label>

                {/* FLASHCARD */}
                <div className="space-y-6">
                    <StudyCard
                        card={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                    />

                    <div ref={buttonsRef}>
                        {!previewMode && (
                            trackProgress ? (
                                <RatingButtons onRate={onRatingClick} />
                            ) : (
                                <NavButtons onPrevClick={handlePrevClick} onNextClick={handleNextClick} disablePrev={currentCardIndex === 0} disableNext={currentCardIndex === cards.length - 1} />
                            )
                        )}
                    </div>

                    {isFlipped && previewMode && (
                        <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                            <p className="text-secondary">Rating disabled in preview mode</p>
                        </div>
                    )}
                </div>

                {trackProgress && (
                    <StudyStats stats={stats} />
                )}

            </div>
        </div>
    );
};

export default StudyMode;