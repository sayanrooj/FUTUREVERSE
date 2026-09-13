import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LifeBuoy,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  X,
  ChevronRight,
  User,
  Shield
} from 'lucide-react';
import { api } from '../../services/api';
import { formatISTDateTime, formatISTDate, formatISTTime } from '../../utils/time';

interface SupportMessageItem {
  id: number;
  sender_role: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface SupportTicketItem {
  id: number;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  messages_count?: number;
  last_message?: string;
  messages?: SupportMessageItem[];
}

export const CandidateSupportPage: React.FC = () => {
  const { ticketId: routeTicketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const selectedTicketIdRef = useRef<number | null>(routeTicketId ? parseInt(routeTicketId) : null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
    routeTicketId ? parseInt(routeTicketId) : null
  );
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('TECHNICAL_ISSUE');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectTicket = (id: number) => {
    selectedTicketIdRef.current = id;
    setSelectedTicketId(id);
    navigate(`/candidate/support/${id}`, { replace: true });
    loadTicketDetails(id, false);
  };

  const fetchTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.candidate.getSupportTickets();
      setTickets(data || []);

      const activeId = selectedTicketIdRef.current;
      if (activeId) {
        // Preserves the currently open conversation across all polling intervals!
        loadTicketDetails(activeId, true);
      } else if (data && data.length > 0) {
        // Default to first conversation ONLY if no conversation is currently selected
        selectTicket(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId: number, silent = false) => {
    if (!silent) setLoadingThread(true);
    try {
      const details = await api.candidate.getSupportTicketDetails(ticketId);
      // Ensure we only update state if this ticket is still the active ticket
      if (selectedTicketIdRef.current === ticketId) {
        setSelectedTicket(details);
        if (!silent) {
          setTimeout(scrollToBottom, 100);
        }
      }
    } catch (err) {
      console.error('Failed to load ticket details', err);
    } finally {
      if (!silent) setLoadingThread(false);
    }
  };

  // Sync route param changes (browser back/forward)
  useEffect(() => {
    if (routeTicketId) {
      const parsedId = parseInt(routeTicketId);
      if (!isNaN(parsedId) && parsedId !== selectedTicketIdRef.current) {
        selectedTicketIdRef.current = parsedId;
        setSelectedTicketId(parsedId);
        loadTicketDetails(parsedId, false);
      }
    }
  }, [routeTicketId]);

  useEffect(() => {
    fetchTickets();
    // Auto-poll support thread every 5 seconds for new responses
    const interval = setInterval(() => {
      fetchTickets(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket || sending) return;

    setSending(true);
    try {
      const updated = await api.candidate.sendSupportMessage(selectedTicket.id, replyText.trim());
      setReplyText('');
      setSelectedTicket(updated);
      setTimeout(scrollToBottom, 100);
      // Refresh tickets list silently
      const listData = await api.candidate.getSupportTickets();
      setTickets(listData || []);
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newSubject.trim() || !newMessage.trim()) {
      setFormError('Please provide both a subject and an initial message.');
      return;
    }

    setCreating(true);
    try {
      const res = await api.candidate.createSupportTicket({
        subject: newSubject.trim(),
        category: newCategory,
        priority: newPriority,
        message: newMessage.trim()
      });
      setShowModal(false);
      setNewSubject('');
      setNewMessage('');
      setNewCategory('TECHNICAL_ISSUE');
      setNewPriority('MEDIUM');

      // Refresh and select newly created ticket
      const list = await api.candidate.getSupportTickets();
      setTickets(list || []);
      if (res.ticket_id) {
        loadTicketDetails(res.ticket_id);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to create ticket.');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">IN PROGRESS</span>;
      case 'WAITING_FOR_CANDIDATE':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">REPLIED • ACTION NEEDED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RESOLVED</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700/50 text-slate-400 border border-slate-600">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700/50 text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="text-[10px] font-semibold text-rose-400">⚡ Urgent</span>;
      case 'HIGH':
        return <span className="text-[10px] font-semibold text-orange-400">▲ High</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-semibold text-amber-400">● Medium</span>;
      default:
        return <span className="text-[10px] font-semibold text-slate-400">▼ Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-400">
              <LifeBuoy className="w-4 h-4" />
              <span>SUPPORT & HELPDESK • TWO-WAY COMMUNICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Candidate Support Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct, real-time messaging with FUTUREVERSE Platform Super Admins and Support Engineers.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-glow flex items-center gap-2 transition-all shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        </div>

        {/* Main 2-Pane Helpdesk Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* Left Pane: Tickets List (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl glass-panel border border-slate-800 p-4 flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                My Support Tickets ({tickets.length})
              </h2>
              <button
                onClick={() => fetchTickets()}
                title="Refresh Tickets"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {loading ? (
                <div className="text-center py-12 text-xs text-slate-400">Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No support tickets created yet.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                  >
                    + Open your first ticket
                  </button>
                </div>
              ) : (
                tickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => selectTicket(t.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-500/60 bg-brand-500/10 shadow-glow-sm'
                          : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          #{t.id} • {t.category.replace('_', ' ')}
                        </span>
                        {getStatusBadge(t.status)}
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                        {t.subject}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/50">
                        <span>{getPriorityBadge(t.priority)}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatISTDate(t.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Active Ticket Conversation (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl glass-panel border border-slate-800 flex flex-col h-[650px] overflow-hidden">
            {selectedTicket ? (
              <>
                {/* Active Ticket Header */}
                <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-brand-400 font-bold">
                        Ticket #{selectedTicket.id}
                      </span>
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {selectedTicket.subject}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Category: {selectedTicket.category.replace('_', ' ')} • Created on {formatISTDateTime(selectedTicket.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadTicketDetails(selectedTicket.id)}
                      title="Sync Thread"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync</span>
                    </button>
                  </div>
                </div>

                {/* Conversation Scrollable Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
                  {loadingThread ? (
                    <div className="text-center py-16 text-xs text-slate-400">Loading conversation thread...</div>
                  ) : !selectedTicket.messages || selectedTicket.messages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">No messages in this conversation.</div>
                  ) : (
                    selectedTicket.messages.map((msg, idx) => {
                      const isCandidate = msg.sender_role === 'CANDIDATE';
                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
                            {isCandidate ? (
                              <>
                                <span>You (Candidate)</span>
                                <User className="w-3 h-3 text-brand-400" />
                              </>
                            ) : (
                              <>
                                <Shield className="w-3 h-3 text-cyan-400" />
                                <span className="text-cyan-300 font-bold">Super Admin / Support ({msg.sender_name})</span>
                              </>
                            )}
                            <span className="text-slate-500">• {formatISTTime(msg.created_at)}</span>
                          </div>

                          <div
                            className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                              isCandidate
                                ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-glow-sm'
                                : 'bg-slate-850 border border-slate-750 text-slate-100 rounded-tl-none shadow-md'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Reply Composer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
                  {selectedTicket.status === 'CLOSED' ? (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 text-center">
                      This ticket has been marked as <strong>CLOSED</strong>. If you still require assistance, please create a new support ticket.
                    </div>
                  ) : (
                    <form onSubmit={handleSendReply} className="flex items-center gap-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        placeholder="Type your response to the support team... (Press Enter to send)"
                        rows={1}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 resize-none transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || sending}
                        className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow flex items-center gap-2 transition-all shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sending ? 'Sending...' : 'Reply'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <LifeBuoy className="w-12 h-12 text-slate-600" />
                <h3 className="text-base font-bold text-white">No Ticket Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select an existing support ticket from the left panel or click "Create New Ticket" to start a direct inquiry.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-glow"
                >
                  Create Ticket
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Creator Attribution */}
        <div className="pt-4 text-center text-[11px] text-slate-500 font-mono">
          FUTUREVERSE Platform Support Architecture • Designed & Developed by Sayan Rooj
        </div>

      </div>

      {/* Modal: Create Support Ticket */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-400">
                <Plus className="w-4 h-4" />
                <span>NEW SUPPORT TICKET</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Submit an Inquiry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Our support desk will respond promptly and keep this communication thread open.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Issue with camera permission in AI Interview session"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="TECHNICAL_ISSUE">Technical Issue</option>
                    <option value="INTERVIEW_QUERY">Interview Query</option>
                    <option value="APPLICATION_STATUS">Application Status</option>
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                    <option value="ACCOUNT_ACCESS">Account Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Initial Message / Details *
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Please describe the issue or question in detail..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 shadow-glow flex items-center gap-2 transition-all"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>{creating ? 'Submitting...' : 'Open Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default CandidateSupportPage;
