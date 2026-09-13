import React, { useEffect, useState } from 'react';
import { Award, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AchievementsEventsManagerPage: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Achievement state
  const [achTitle, setAchTitle] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achMetric, setAchMetric] = useState('');
  const [achCategory, setAchCategory] = useState('Platform Milestone');
  const [achDate, setAchDate] = useState('2026-09-01');

  // New Event state
  const [evTitle, setEvTitle] = useState('');
  const [evDesc, setEvDesc] = useState('');
  const [evDate, setEvDate] = useState('2026-11-20');
  const [evTime, setEvTime] = useState('11:00 AM IST');
  const [evLocation, setEvLocation] = useState('Virtual');
  const [evImage, setEvImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [achs, evs] = await Promise.all([
        api.admin.getAchievements(),
        api.admin.getEvents()
      ]);
      setAchievements(achs || []);
      setEvents(evs || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createAchievement({
        title: achTitle,
        description: achDesc,
        metric: achMetric,
        category: achCategory,
        date_str: achDate,
        icon: 'Award',
        is_active: true
      });
      setAchTitle('');
      setAchDesc('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create achievement.');
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    try {
      await api.admin.deleteAchievement(id);
      await fetchData();
    } catch {
      // Handled
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createEvent({
        title: evTitle,
        description: evDesc,
        date_str: evDate,
        time_str: evTime,
        location: evLocation,
        image_url: evImage,
        status: 'UPCOMING'
      });
      setEvTitle('');
      setEvDesc('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create event.');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await api.admin.deleteEvent(id);
      await fetchData();
    } catch {
      // Handled
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            PUBLIC SHOWCASE MANAGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Achievements & Events Publisher
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage honors, certifications, webinars, and platform milestone entries
          </p>
        </div>

        {/* SECTION 1: ACHIEVEMENTS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-4 h-4 text-brand-400" />
            <span>Platform Achievements</span>
          </h2>

          <form onSubmit={handleCreateAchievement} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Publish New Achievement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Achievement Title"
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Metric (e.g. 99.4% Accuracy)"
                value={achMetric}
                onChange={(e) => setAchMetric(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Date (e.g. 2026-09-01)"
                value={achDate}
                onChange={(e) => setAchDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <textarea
              rows={2}
              required
              placeholder="Description of milestone or industry honor..."
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500"
            >
              Add Achievement
            </button>
          </form>

          <div className="space-y-2">
            {achievements.map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{a.title}</span>
                    {a.metric && <span className="font-mono text-emerald-400 font-semibold">[{a.metric}]</span>}
                    <span className="text-[10px] text-slate-500 font-mono">• {a.date_str}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{a.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteAchievement(a.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: EVENTS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-future-indigo" />
            <span>Recruitment Summits & Webinars</span>
          </h2>

          <form onSubmit={handleCreateEvent} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Publish New Event</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Event Title"
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Date (e.g. 2026-11-20)"
                value={evDate}
                onChange={(e) => setEvDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Time (e.g. 11:00 AM IST)"
                value={evTime}
                onChange={(e) => setEvTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <textarea
              rows={2}
              required
              placeholder="Description of summit agenda, speakers, and topics..."
              value={evDesc}
              onChange={(e) => setEvDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-future-indigo hover:bg-indigo-500"
            >
              Add Event
            </button>
          </form>

          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ev.title}</span>
                    <span className="text-[10px] text-brand-400 font-mono">• {ev.date_str} ({ev.time_str})</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{ev.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
