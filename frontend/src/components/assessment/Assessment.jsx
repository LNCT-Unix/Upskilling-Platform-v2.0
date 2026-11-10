import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/octobyte-logo.jpeg';
import { API_BASE_URL } from '../../api/config';

export default function Assessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const track = searchParams.get('track') || 'backend-development';

  const [screen, setScreen] = useState('start'); // start | test | result
  const [stepData, setStepData] = useState(null); // current step (question, total, etc.)
  const [selected, setSelected] = useState(null);
  const [answerResult, setAnswerResult] = useState(null); // feedback after submission
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Verify authentication on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 1. Start Assessment (GET /api/tracks/{trackSlug}/assessment/start)
  async function startTest() {
    setLoading(true);
    setMessage('Loading questions...');
    setCorrect(0);
    setWrong(0);
    setSelected(null);
    setAnswerResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/tracks/${track}/assessment/start?difficulty=BEGINNER`, {
        method: 'GET',
        headers: authHeaders,
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.completed) {
        setScreen('result');
      } else {
        setStepData(data);
        setScreen('test');
      }
      setMessage('');
    } catch (err) {
      console.error('API error:', err);
      setMessage('Failed to start test. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }

  // 2. Submit Answer (POST /api/tracks/{trackSlug}/assessment/answers)
  async function chooseOption(key) {
    if (selected || loading) return;
    setSelected(key);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/tracks/${track}/assessment/answers`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          questionId: stepData.question.id,
          selectedAnswer: key,
          difficulty: stepData.question.difficulty || 'BEGINNER',
        }),
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      setAnswerResult(result);

      if (result.correct) {
        setCorrect((prev) => prev + 1);
      } else {
        setWrong((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      setMessage('Could not evaluate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // 3. Move to next question or show results
  function nextQuestion() {
    if (!answerResult) return;

    if (answerResult.next?.completed || stepData.questionNumber === stepData.totalQuestions) {
      setScreen('result');
    } else {
      setStepData(answerResult.next);
      setSelected(null);
      setAnswerResult(null);
    }
  }

  const question = stepData?.question;
  const score = correct - wrong;

  function optionStyle(key) {
    if (!selected) return 'border-slate-200 hover:border-[#7056ED]';
    if (answerResult && key === answerResult.correctAnswer) return 'bg-emerald-50 border-emerald-500';
    if (key === selected && !answerResult?.correct) return 'bg-rose-50 border-rose-500';
    return 'border-slate-200 opacity-50';
  }

  const card = 'bg-white rounded-2xl border border-purple-100 shadow-sm p-8 space-y-6';
  const button = 'px-7 py-2.5 rounded-full bg-[#7056ED] hover:bg-[#5f44e2] text-white font-semibold text-sm cursor-pointer disabled:opacity-50';

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-10" />
        <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-slate-600 hover:text-[#7056ED] cursor-pointer">
          Dashboard
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* START SCREEN */}
          {screen === 'start' && (
            <div className={`${card} text-center`}>
              <h1 className="text-3xl font-extrabold capitalize">{track.replace(/-/g, ' ')} Assessment</h1>
              <p className="text-slate-600">Correct = +1, Wrong = -1</p>
              {message && <p className="text-sm text-red-500">{message}</p>}
              <button onClick={startTest} disabled={loading} className={button}>
                {loading ? 'Starting...' : 'Start Test'}
              </button>
            </div>
          )}

          {/* TEST SCREEN */}
          {screen === 'test' && question && (
            <div className={card}>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">Question {stepData.questionNumber} of {stepData.totalQuestions}</span>
                <span className="text-[#7056ED]">Score: {score}</span>
              </div>

              <h2 className="text-xl font-bold">{question.text}</h2>

              <div className="space-y-3">
                {question.options &&
                  Object.entries(question.options).map(([key, text]) => (
                    <button
                      key={key}
                      disabled={selected !== null}
                      onClick={() => chooseOption(key)}
                      className={`w-full text-left p-4 rounded-xl border cursor-pointer ${optionStyle(key)}`}
                    >
                      <b>{key}.</b> {text}
                    </button>
                  ))}
              </div>

              {answerResult && (
                <>
                  <div className="p-4 rounded-xl bg-purple-50 text-sm">
                    <p className="font-bold">{answerResult.correct ? '✅ Correct!' : '❌ Wrong!'}</p>
                    <p className="text-slate-600 mt-1">{answerResult.explanation}</p>
                  </div>
                  <button onClick={nextQuestion} className={button}>
                    {stepData.questionNumber === stepData.totalQuestions ? 'Finish' : 'Next'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* RESULT SCREEN */}
          {screen === 'result' && (
            <div className={`${card} text-center`}>
              <h2 className="text-3xl font-extrabold">Your Results</h2>
              <div className="text-5xl font-black text-[#7056ED] my-4">{score}</div>
              <p className="text-slate-600 mb-6">Correct: {correct} | Wrong: {wrong}</p>
              <div className="flex justify-center gap-3">
                <button onClick={startTest} className={button}>Try Again</button>
                <button onClick={() => navigate('/dashboard')} className="px-7 py-2.5 rounded-full bg-slate-100 font-semibold text-sm cursor-pointer hover:bg-slate-200">
                  Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}