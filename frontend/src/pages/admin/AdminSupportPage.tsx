import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Mail,
  RotateCcw,
  Shield,
  User,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { formatISTDateTime, formatISTDate, formatISTTime } from '../../utils/time';

interface SupportMsg {
  id: number;
  sender_role: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export const AdminSupportPage: React.FC = () => {
  const { ticketId: routeTicketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'tickets' | 'emails'>('tickets');

  // Support Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const selectedTicketIdRef = useRef<number | null>(routeTicketId ? parseInt(routeTicketId) : null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
    routeTicketId ? parseInt(routeTicketId) : null
  );
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [targetStatus, setTargetStatus] = useState('IN_PROGRESS');
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Email Logs State
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailSearch, setEmailSearch] = useState('');
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectTicket = (id: number) => {
    selectedTicketIdRef.current = id;
    setSelectedTicketId(id);
    navigate(`/admin/support/${id}`, { replace: true });
    loadTicketDetails(id, false);
  };

  const fetchTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.admin.getSupportTickets();
      setTickets(data || []);

      const activeId = selectedTicketIdRef.current;
      if (activeId) {
        // Preserves the currently selected conversation across all polling intervals!
        loadTicketDetails(activeId, true);
      } else if (data && data.length > 0) {
        // Default to first conversation ONLY if none is currently selected
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
      const details = await api.admin.getSupportTicketDetails(ticketId);
      if (selectedTicketIdRef.current === ticketId) {
        setSelectedTicket(details);
        setTargetStatus(details.status);
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

  const fetchEmailLogs = async () => {
    setLoadingEmails(true);
    try {
      const logs = await api.admin.getEmailLogs(60);
      setEmailLogs(logs || []);
    } catch (err) {
      console.error('Failed to load email logs', err);
    } finally {
      setLoadingEmails(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(() => {
      if (activeTab === 'tickets') {
        fetchTickets(true);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'emails') {
      fetchEmailLogs();
    }
  }, [activeTab]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const updated = await api.admin.replySupportTicket(selectedTicket.id, {
        message: replyText.trim(),
        status: targetStatus
      });
      setReplyText('');
      setSelectedTicket(updated);
      setTimeout(scrollToBottom, 100);
      // Refresh list
      const listData = await api.admin.getSupportTickets();
      setTickets(listData || []);
      setActionAlert('Reply dispatched to candidate and email notification sent.');
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket || statusUpdating) return;
    setStatusUpdating(true);
    try {
      const updated = await api.admin.updateTicketStatus(selectedTicket.id, newStatus);
      setSelectedTicket(updated);
      setTargetStatus(newStatus);
      const listData = await api.admin.getSupportTickets();
      setTickets(listData || []);
      setActionAlert(`Ticket status updated to ${newStatus}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRetryEmail = async (logId: number) => {
    setRetryingId(logId);
    try {
      await api.admin.retryEmail(logId);
      setActionAlert(`Email #${logId} retried successfully.`);
      await fetchEmailLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to retry email.');
    } finally {
      setRetryingId(null);
    }
  };

  const filteredEmailLogs = emailLogs.filter((log) => {
    if (!emailSearch) return true;
    const q = emailSearch.toLowerCase();
    return (
      log.recipient.toLowerCase().includes(q) ||
      log.subject.toLowerCase().includes(q) ||
      log.email_type.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">IN PROGRESS</span>;
      case 'WAITING_FOR_CANDIDATE':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">WAITING ON CANDIDATE</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RESOLVED</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700/50 text-slate-400 border border-slate-600">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700/50 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>SUPER ADMIN PLATFORM GOVERNANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Support Center & Email Telemetry
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct two-way candidate ticket communication thread and transactional email dispatch audit logs.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'tickets'
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Support Desk ({tickets.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'emails'
                  ? 'bg-emerald-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Logs</span>
            </button>
          </div>
        </div>

        {actionAlert && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionAlert}</span>
            </div>
            <button
              onClick={() => setActionAlert(null)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: SUPPORT TICKETS & TWO-WAY COMMUNICATION */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* Left Column: Tickets Queue (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl glass-panel border border-slate-800 p-4 flex flex-col h-[680px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Active Support Queue ({tickets.length})
                </h2>
                <button
                  onClick={() => fetchTickets()}
                  title="Refresh Queue"
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {loading ? (
                  <div className="text-center py-16 text-xs text-slate-400">Loading support queue...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-20 text-xs text-slate-400">No support tickets currently open.</div>
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
                          <span className="text-[10px] font-mono text-brand-400 font-bold">
                            #{t.id} • {t.category.replace('_', ' ')}
                          </span>
                          {getStatusBadge(t.status)}
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                          {t.subject}
                        </h4>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/50 font-mono">
                          <span>By: {t.user_name || t.user_email || 'Candidate'}</span>
                          <span>{formatISTDate(t.created_at)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Full Two-Way Conversation & Actions (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl glass-panel border border-slate-800 flex flex-col h-[680px] overflow-hidden">
              {selectedTicket ? (
                <>
                  {/* Ticket Header & Status Switcher */}
                  <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-brand-400 font-bold">
                          Ticket #{selectedTicket.id}
                        </span>
                        {getStatusBadge(selectedTicket.status)}
                        <span className="text-[10px] font-mono text-slate-400">
                          Priority: <strong>{selectedTicket.priority || 'MEDIUM'}</strong>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Candidate: <strong className="text-slate-200">{selectedTicket.user_name}</strong> ({selectedTicket.user_email}) • {formatISTDateTime(selectedTicket.created_at)}
                      </p>
                    </div>

                    {/* Fast Status Switcher Buttons */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={statusUpdating}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-brand-500"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="WAITING_FOR_CANDIDATE">WAITING FOR CANDIDATE</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <button
                        onClick={() => loadTicketDetails(selectedTicket.id)}
                        title="Sync Thread"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Conversation Body */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
                    {loadingThread ? (
                      <div className="text-center py-16 text-xs text-slate-400">Loading conversation thread...</div>
                    ) : !selectedTicket.messages || selectedTicket.messages.length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-400">No conversation history.</div>
                    ) : (
                      selectedTicket.messages.map((msg: SupportMsg, idx: number) => {
                        const isCandidate = msg.sender_role === 'CANDIDATE';
                        return (
                          <div
                            key={msg.id || idx}
                            className={`flex flex-col ${isCandidate ? 'items-start' : 'items-end'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
                              {isCandidate ? (
                                <>
                                  <User className="w-3 h-3 text-brand-400" />
                                  <span className="text-brand-300 font-bold">Candidate ({msg.sender_name})</span>
                                </>
                              ) : (
                                <>
                                  <span>Super Admin / Support ({msg.sender_name})</span>
                                  <Shield className="w-3 h-3 text-emerald-400" />
                                </>
                              )}
                              <span className="text-slate-500">• {formatISTTime(msg.created_at)}</span>
                            </div>

                            <div
                              className={`max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                isCandidate
                                  ? 'bg-slate-850 border border-slate-750 text-slate-100 rounded-tl-none shadow-md'
                                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-glow-sm'
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

                  {/* Admin Reply Input */}
                  <form onSubmit={handleReply} className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Dispatch official resolution to candidate:</span>
                      <div className="flex items-center gap-2">
                        <span>Status after sending:</span>
                        <select
                          value={targetStatus}
                          onChange={(e) => setTargetStatus(e.target.value)}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-[11px] text-white"
                        >
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="WAITING_FOR_CANDIDATE">WAITING FOR CANDIDATE</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(e);
                          }
                        }}
                        placeholder="Type official guidance or technical support response... (Press Enter to send)"
                        rows={2}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || submitting}
                        className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow flex items-center gap-2 transition-all shrink-0 self-end"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Sending...' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400 text-xs">
                  <LifeBuoy className="w-12 h-12 text-slate-600" />
                  <p>Select a ticket from the left panel to inspect the conversation thread and reply.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: TRANSACTIONAL EMAIL LOGS & AUDITING */}
        {activeTab === 'emails' && (
          <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Outbound Email Logs & Delivery Audit</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete ledger of system notifications, interview invites, reminders, and hiring decisions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    placeholder="Search by recipient or subject..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  onClick={fetchEmailLogs}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loadingEmails ? (
              <div className="text-center py-16 text-xs text-slate-400">Loading outbound email logs...</div>
            ) : filteredEmailLogs.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">No outbound email records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sent At</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEmailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">#{log.id}</td>
                        <td className="py-3 px-4 font-medium text-white">{log.recipient}</td>
                        <td className="py-3 px-4 font-mono text-brand-400 text-[11px]">{log.email_type}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{log.subject}</td>
                        <td className="py-3 px-4">
                          {log.status === 'SENT' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              SENT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              FAILED
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {log.sent_at ? formatISTDateTime(log.sent_at) : 'Pending'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRetryEmail(log.id)}
                            disabled={retryingId === log.id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-colors inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{retryingId === log.id ? 'Retrying...' : 'Retry'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        <div className="pt-4 text-center text-[11px] text-slate-500 font-mono">
          FUTUREVERSE Platform Super Admin Operations • Designed & Developed by Sayan Rooj
        </div>

      </div>
    </div>
  );
};
export default AdminSupportPage;
