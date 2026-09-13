import json

with open('scratch/full_dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

users_json = json.dumps(data['users'], indent=2)
jobs_json = json.dumps(data['jobs'], indent=2)
apps_json = json.dumps(data['applications'], indent=2)
tickets_json = json.dumps(data['tickets'], indent=2)
audit_json = json.dumps(data['audit_logs'], indent=2)
achievements_json = json.dumps(data['achievements'], indent=2)
events_json = json.dumps(data['events'], indent=2)
content_json = json.dumps(data['cms_content'], indent=2)

ts_content = f'''// Embedded Database Synchronization for High-Speed Execution and Resilient Fallback
// Contains all 12 production jobs, 15 applicant dossiers, users, tickets, and logs from futureverse.db

export const MOCK_USERS = {users_json};

export const MOCK_JOBS = {jobs_json};

export const MOCK_APPLICATIONS = {apps_json};

export const MOCK_TICKETS = {tickets_json};

export const MOCK_AUDIT_LOGS = {audit_json};

export const MOCK_ACHIEVEMENTS = {achievements_json};

export const MOCK_EVENTS = {events_json};

export const MOCK_CONTENT = {content_json};

// Dynamic local storage helper to ensure modifications (status updates, new applications, new jobs) persist permanently
const STORAGE_KEY_JOBS = 'futureverse_storage_jobs_v2';
const STORAGE_KEY_APPS = 'futureverse_storage_apps_v2';
const STORAGE_KEY_TICKETS = 'futureverse_storage_tickets_v2';

export function getStoredJobs(): any[] {{
  try {{
    const val = localStorage.getItem(STORAGE_KEY_JOBS);
    if (val) return JSON.parse(val);
  }} catch {{}}
  return MOCK_JOBS;
}}

export function saveStoredJobs(jobs: any[]): void {{
  try {{
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  }} catch {{}}
}}

export function getStoredApplications(): any[] {{
  try {{
    const val = localStorage.getItem(STORAGE_KEY_APPS);
    if (val) return JSON.parse(val);
  }} catch {{}}
  return MOCK_APPLICATIONS;
}}

export function saveStoredApplications(apps: any[]): void {{
  try {{
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  }} catch {{}}
}}

export function getStoredTickets(): any[] {{
  try {{
    const val = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (val) return JSON.parse(val);
  }} catch {{}}
  return MOCK_TICKETS;
}}

export function saveStoredTickets(tickets: any[]): void {{
  try {{
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }} catch {{}}
}}
'''

with open('frontend/src/services/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Successfully generated frontend/src/services/mockData.ts!")
