import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvent, setRegisteredEvent] = useState<string | null>(null);

  useEffect(() => {
    api.public.getEvents()
      .then(res => setEvents(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = events.filter(e => e.status === 'UPCOMING');
  const pastEvents = events.filter(e => e.status !== 'UPCOMING');

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            CONNECT & LEARN
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            Recruitment Summits & Events
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Join engineering keynotes, talent technology workshops, and live adaptive interview masterclasses.
          </p>
        </div>

        {registeredEvent && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm text-center">
            🎉 Registration confirmed for <strong>{registeredEvent}</strong>! Calendar invite dispatched to your email.
          </div>
        )}

        {/* Loading / Upcoming */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading events...</div>
        ) : (
          <div className="space-y-12">
            
            {/* Upcoming Events */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                <span>Upcoming Sessions</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-2xl glass-panel border border-slate-800 overflow-hidden hover:border-brand-500/40 transition-all flex flex-col"
                  >
                    {ev.image_url && (
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={ev.image_url}
                          alt={ev.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-bold">
                          Upcoming
                        </span>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{ev.title}</h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ev.description}</p>
                        
                        <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-400" />
                            <span>{ev.date_str}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-brand-400" />
                            <span>{ev.time_str}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-brand-400" />
                            <span>{ev.location}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setRegisteredEvent(ev.title)}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Reserve Virtual Seat</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span>Past Events & Recordings</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastEvents.map((ev) => (
                    <div key={ev.id} className="p-6 rounded-2xl glass-panel border border-slate-800 opacity-75">
                      <span className="text-[10px] font-mono text-slate-400">Completed Session</span>
                      <h3 className="text-base font-bold text-white mt-1">{ev.title}</h3>
                      <p className="text-xs text-slate-400 mt-2">{ev.description}</p>
                      <div className="mt-3 text-xs text-slate-500">Concluded on {ev.date_str}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
