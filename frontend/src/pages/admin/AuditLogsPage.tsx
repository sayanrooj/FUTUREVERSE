import React, { useEffect, useState } from 'react';
import { Lock, Search, ShieldCheck, Clock, User, Filter } from 'lucide-react';
import { api } from '../../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getAuditLogs(100);
      setLogs(data || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filterAction
    ? logs.filter(l => l.action.toLowerCase().includes(filterAction.toLowerCase()))
    : logs;

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              SECURITY & REGULATORY COMPLIANCE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Platform Compliance Audit Trail
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable chronological record of logins, recruiter overrides, job criteria updates, and shortlisting actions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Filter by action (e.g. OVERRIDE)..."
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Audit Entries ({filteredLogs.length})</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Tamper-Evident Database Log</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading audit trail...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No audit events recorded for this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Timestamp (UTC)</th>
                    <th className="p-3">Actor / User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action Recorded</th>
                    <th className="p-3">Target Object</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Telemetry Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 text-white font-semibold">
                        {log.user_email || 'System'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-brand-300">
                          {log.user_role || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-amber-400">{log.action}</span>
                      </td>
                      <td className="p-3 text-slate-300">
                        {log.target_type ? `${log.target_type} #${log.target_id || ''}` : '—'}
                      </td>
                      <td className="p-3 text-slate-500">{log.ip_address}</td>
                      <td className="p-3 text-slate-400 truncate max-w-xs">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
