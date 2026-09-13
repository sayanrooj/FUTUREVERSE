import json

with open('frontend/src/services/mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const MOCK_APPLICATIONS = ') + len('export const MOCK_APPLICATIONS = ')
end = text.find(';\n\nexport const MOCK_TICKETS =')
apps_json = text[start:end]
apps = json.loads(apps_json)

sayan_apps = [a for a in apps if a['candidate_id'] == 7 or 'sayan' in a.get('candidate_email', '').lower()]
print(f'Total Sayan Rooj Applications found: {len(sayan_apps)}')
for a in sayan_apps:
    print(f"  App #{a['id']}: Job #{a['job_id']} ({a['job_title']}) - Candidate: {a['candidate_name']} ({a['candidate_email']}) - Status: {a['status']}")
