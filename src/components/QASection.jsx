import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, HelpCircle, Send, Search, ThumbsUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductQA, submitProductQuestion, qa as qaApi } from '../services/api';

const QASection = ({ productId }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    loadQA();
  }, [productId]);

  const loadQA = async () => {
    try {
      setLoading(true);
      const data = await fetchProductQA(productId);
      setQuestions(data || []);
    } catch (err) {
      console.error('Failed to load Q&A:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to ask a question');
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      await submitProductQuestion(productId, { question: newQuestion });
      setNewQuestion('');
      setShowQuestionForm(false);
      loadQA();
    } catch (err) {
      console.error('Failed to submit question:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (qId) => {
    try {
      await qaApi.voteHelpful(qId);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, helpful_count: Number(q.helpful_count || 0) + 1 } : q
        )
      );
    } catch (err) {
      console.error('Failed to vote helpful:', err);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.answer && q.answer?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-[#d4af37]" size={30} />
    </div>
  );

  return (
    <div className="two-tone-panel-gold rounded-3xl p-6 sm:p-8 bg-[#0d1520] shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-5 border-b border-white/10">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-2.5">
            <HelpCircle className="text-[#d4af37]" size={22} />
            Formulation Technical Q&amp;A
          </h2>
          <p className="font-sub-gold text-[10px] tracking-widest mt-1">
            Artisanal compounding &amp; cleanroom advice directly from laboratory specialists
          </p>
        </div>
        <button 
          onClick={() => setShowQuestionForm(!showQuestionForm)}
          className={`btn-gold-luxury px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all ${
            showQuestionForm ? 'opacity-80' : ''
          }`}
        >
          {showQuestionForm ? 'Cancel Inquiry' : 'Ask a Specialist'}
        </button>
      </div>

      <AnimatePresence>
        {showQuestionForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-[#070a0e] p-6 rounded-2xl border border-[#d4af37]/30 space-y-4">
              <label className="font-sub-gold text-[10px] tracking-widest block">Submit Your Clinical / Technical Question</label>
              <textarea
                required
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Inquire about botanical origin, pH value, layering order, or reactive skin patch-tests..."
                className="w-full bg-[#0d1520] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-white/30 focus:border-[#d4af37] transition-colors min-h-[100px] outline-none leading-relaxed"
              />
              <div className="flex justify-end">
                <button 
                  disabled={submitting}
                  className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  <span>Submit Question</span>
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ingredient, sensitivity, or usage instructions..."
          className="w-full pl-11 pr-4 py-3 bg-[#070a0e] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
          <div key={q.id} className="two-tone-card border border-white/10 rounded-2xl p-5 bg-[#070a0e] hover:border-[#d4af37]/40 transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#0d1520] border border-[#d4af37]/35 flex items-center justify-center shrink-0">
                <span className="font-mono text-xs font-bold text-[#fce096]">Q</span>
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-sm font-bold text-white leading-tight mb-1.5">{q.question}</h4>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">
                  <span>Asked by {q.user_name || 'Verified Patron'}</span>
                  <span>•</span>
                  <span>{new Date(q.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {q.answer ? (
              <div className="mt-4 pl-11">
                <div className="p-4 bg-[#0d1520] border border-[#d4af37]/25 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white">Bhumivera Technical Desk</span>
                    <span className="bg-[#070a0e] border border-[#d4af37]/40 text-[#fce096] text-[8px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Official</span>
                  </div>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">{q.answer}</p>
                </div>
                <div className="mt-2.5 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(q.id)}
                    className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#94a3b8] hover:text-[#fce096] transition-colors uppercase tracking-wider"
                  >
                    <ThumbsUp size={12} className="text-[#d4af37]" />
                    Helpful ({q.helpful_count || 0})
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 pl-11">
                <p className="font-mono text-[11px] text-[#fce096] flex items-center gap-2">
                  <Loader2 className="animate-spin" size={12} />
                  Laboratory review in progress...
                </p>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-12 bg-[#070a0e] rounded-2xl border border-dashed border-white/10">
            <MessageSquare className="mx-auto text-[#d4af37] mb-2 opacity-60" size={32} />
            <p className="font-serif text-sm text-[#cbd5e1]">No inquiries matching this search.</p>
            <p className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-widest mt-1">Be the first to ask our formulation desk</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QASection;
