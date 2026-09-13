import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, CheckCircle2, Lock, UserX, UserCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export const OwnerManagementPage: React.FC = () => {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Owner Form Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Recruiter@2026');
  const [companyName, setCompanyName] = useState('FUTUREVERSE Global Labs');
  const [department, setDepartment] = useState('Talent Acquisition');
  const [designation, setDesignation] = useState('Senior Technical Recruiter');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getOwners();
      setOwners(data || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.admin.createOwner({
        full_name: fullName,
        email,
        password,
        company_name: companyName,
        department,
        designation,
        permissions: ['MANAGE_JOBS', 'VIEW_APPLICATIONS', 'INVITE_INTERVIEWS', 'MAKE_DECISIONS']
      });
      setCreateModalOpen(false);
      setFullName('');
      setEmail('');
      setSuccessMsg(`Recruiter account created for ${email}. Login credentials dispatched.`);
      await fetchOwners();
    } catch (err: any) {
      alert(err.message || 'Failed to create recruiter account.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleOwnerDisabled = async (ownerId: number, currentDisabled: boolean) => {
    try {
      await api.admin.updateOwner(ownerId, { is_disabled: !currentDisabled });
      setSuccessMsg(`Account status updated.`);
      await fetchOwners();
    } catch (err: any) {
      alert(err.message || 'Failed to update recruiter status.');
    }
  };

  const handleResetPassword = async (ownerId: number) => {
    const newPass = prompt('Enter new password for this recruiter account:', 'Recruiter@2026');
    if (!newPass) return;
    try {
      await api.admin.updateOwner(ownerId, { reset_password: newPass });
      setSuccessMsg(`Password reset successfully.`);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              AUTHORIZED PROVISIONING
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Recruiter & Owner Accounts Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Public owner registration is strictly prohibited. Provision and govern all talent partner accounts here.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Recruiter</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Owners List Table */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Provisioned Recruiters ({owners.length})</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">RBAC Role: OWNER</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading recruiter accounts...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Recruiter</th>
                    <th className="p-3">Organization & Dept</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Jobs Managed</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {owners.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{o.full_name}</div>
                        <div className="text-[11px] text-slate-400">{o.email}</div>
                      </td>
                      <td className="p-3">
                        <div>{o.company_name}</div>
                        <div className="text-[11px] text-slate-500">{o.department}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{o.designation}</td>
                      <td className="p-3 font-mono text-brand-400 font-bold">{o.jobs_count} Jobs</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            o.is_disabled
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {o.is_disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetPassword(o.id)}
                            className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Reset Password"
                          >
                            Reset Pwd
                          </button>
                          <button
                            onClick={() => toggleOwnerDisabled(o.id, o.is_disabled)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              o.is_disabled
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                            }`}
                          >
                            {o.is_disabled ? 'Enable' : 'Disable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Provision Recruiter Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateOwner} className="bg-future-surface border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Provision Authorized Recruiter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Create an account for an internal HR partner or corporate recruiter. They will gain access to the dedicated Recruiter Hub.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rachel Zane"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Corporate Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rachel@company.com"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company / Entity</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow transition-all disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Provision Recruiter'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
