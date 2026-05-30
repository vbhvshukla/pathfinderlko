import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, CheckCircle, HelpCircle, HeartPulse } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const QUESTIONS = [
  {
    id: 1,
    text: 'How often do you feel overwhelmed by academic, career, or personal pressure?',
    options: [
      { text: 'Rarely / Never', score: 4 },
      { text: 'Sometimes', score: 3 },
      { text: 'Frequently', score: 2 },
      { text: 'Almost Always', score: 1 },
    ],
  },
  {
    id: 2,
    text: 'Do you feel confident and excited about your current career path or course of study?',
    options: [
      { text: 'Highly confident & clear', score: 4 },
      { text: 'Mostly satisfied, minor doubts', score: 3 },
      { text: 'Neutral / Mostly uncertain', score: 2 },
      { text: 'Extremely confused / Disinterested', score: 1 },
    ],
  },
  {
    id: 3,
    text: 'How easy is it for you to relax, decompress, and switch off from stress after a long day?',
    options: [
      { text: 'Very easy', score: 4 },
      { text: 'Takes some conscious effort', score: 3 },
      { text: 'Quite difficult', score: 2 },
      { text: 'Almost impossible / Chronic worry', score: 1 },
    ],
  },
  {
    id: 4,
    text: 'When making important decisions about your future, how clear do your goals feel?',
    options: [
      { text: 'Very clear & mapped out', score: 4 },
      { text: 'Somewhat clear, missing some details', score: 3 },
      { text: 'Mostly vague or shifting', score: 2 },
      { text: 'Completely lost / No goals', score: 1 },
    ],
  },
  {
    id: 5,
    text: 'How has your sleep quality been recently, especially when deadlines or exams are close?',
    options: [
      { text: 'Restful, consistent 7-8 hours', score: 4 },
      { text: 'Slightly disturbed occasionally', score: 3 },
      { text: 'Frequent sleeplessness or fatigue', score: 2 },
      { text: 'Severe insomnia / Anxiety-driven waking', score: 1 },
    ],
  },
]

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleSelectOption = (score) => {
    setAnswers({ ...answers, [currentIdx]: score })
  }

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const handleReset = () => {
    setCurrentIdx(0)
    setAnswers({})
    setShowResults(false)
  }

  const currentQuestion = QUESTIONS[currentIdx]
  const selectedScore = answers[currentIdx]
  const progressPercent = ((currentIdx + 1) / QUESTIONS.length) * 100

  // Calculate results
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  
  const getOutcome = (score) => {
    if (score >= 16) {
      return {
        level: 'Excellent Wellness & Clarity',
        color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
        icon: CheckCircle,
        description: 'Great job! You have high mental wellness indicators and solid career clarity. Keep maintaining this positive work-life balance and focus on your goals.',
        recommendation: 'Continue doing what you are doing. If you ever feel minor stress creeping in, explore our self-help blogs.',
      }
    } else if (score >= 10) {
      return {
        level: 'Moderate Stress / Mild Uncertainty',
        color: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
        icon: HelpCircle,
        description: 'You are doing relatively well, but you are experiencing noticeable levels of stress or career confusion. Addressing these early can prevent academic or emotional burnout.',
        recommendation: 'We recommend looking into our stress management tips or scheduling a single consultation session to gain clarity.',
      }
    } else {
      return {
        level: 'High Stress / Career Confusion',
        color: 'text-destructive border-destructive/20 bg-destructive/5',
        icon: AlertTriangle,
        description: 'Your scores indicate a high level of stress, anxiety, or confusion regarding your career path. Experiencing this is very common, and you do not have to navigate it alone.',
        recommendation: 'We highly recommend booking a dedicated, confidential counseling session with a counselor at Pathfinder for support.',
      }
    }
  }

  const outcome = getOutcome(totalScore)
  const OutcomeIcon = outcome.icon

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      {!showResults ? (
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-4 border-b bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <CardTitle className="text-xl font-bold">Self-Assessment Wellness Screening</CardTitle>
                <CardDescription>Get a quick evaluation of your current stress levels and career clarity.</CardDescription>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progressPercent)}% Complete</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          </CardHeader>

          <CardContent className="pt-8 min-h-[260px] flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-lg font-bold leading-relaxed text-foreground">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.score)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center justify-between ${
                      selectedScore === opt.score
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border bg-card text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {selectedScore === opt.score && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-4">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedScore === undefined}
              className="gap-1.5"
            >
              {currentIdx === QUESTIONS.length - 1 ? 'See Results' : 'Next'} <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="text-center pb-4 border-b bg-muted/20">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
            <CardDescription>Your score: {totalScore} out of 20</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start gap-4 ${outcome.color}`}>
              <OutcomeIcon className="w-10 h-10 shrink-0 text-current" />
              <div className="space-y-1.5 text-center sm:text-left text-foreground">
                <h3 className="text-lg font-bold leading-none">{outcome.level}</h3>
                <p className="text-sm leading-relaxed opacity-90">{outcome.description}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm bg-muted/30 p-5 rounded-2xl border border-dashed">
              <h4 className="font-bold text-foreground">Our Recommendation:</h4>
              <p className="text-muted-foreground leading-relaxed">{outcome.recommendation}</p>
            </div>
          </CardContent>

          <CardFooter className="border-t p-4 flex flex-col sm:flex-row gap-3">
            <Button onClick={handleReset} variant="outline" className="w-full sm:w-1/2 gap-2">
              <RotateCcw className="w-4 h-4" /> Retake Test
            </Button>
            <Button asChild className="w-full sm:w-1/2 gap-2">
              <Link to="/appointments">Book Counseling Now</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  )
}
