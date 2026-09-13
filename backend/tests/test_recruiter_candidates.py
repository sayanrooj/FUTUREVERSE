import asyncio
import httpx

async def verify():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8000/api') as c:
        r_login = await c.post('/auth/owner-login', json={'email': 'recruiter@futureverse.ai', 'password': 'Recruiter@2026'})
        assert r_login.status_code == 200, f'Recruiter login failed: {r_login.status_code}'
        token = r_login.json().get('access_token')
        headers = {'Authorization': f'Bearer {token}'}

        print('=== RECRUITER CANDIDATE LISTINGS ===')
        r_jobs = await c.get('/jobs', headers=headers)
        for j in r_jobs.json():
            r_c = await c.get(f'/owner/jobs/{j["id"]}/candidates', headers=headers)
            cands = r_c.json().get('candidates', [])
            if cands:
                print(f'Job #{j["id"]} [{j["title"][:35]}]: {len(cands)} candidate(s)')
                for cd in cands:
                    name = cd.get('name')
                    email = cd.get('email')
                    app_id = cd.get('application_id')
                    rank = cd.get('rank')
                    assert name and name.strip(), f'Candidate name is empty in job {j["id"]}'
                    assert email and email.strip(), f'Candidate email is empty in job {j["id"]}'
                    print(f'   -> Rank #{rank}: Name: "{name}" | Email: "{email}" | AppID: {app_id}')

        print('\n=== APPLICATION DOSSIER INSIGHTS ===')
        for aid in [14, 13, 6, 1]:
            r_ins = await c.get(f'/owner/applications/{aid}/insight', headers=headers)
            assert r_ins.status_code == 200, f'Failed to fetch insight for app {aid}'
            ins = r_ins.json()
            cand = ins.get('candidate', {})
            name = cand.get('name')
            email = cand.get('email')
            headline = cand.get('headline')
            status = ins.get('status')
            assert name and name.strip(), f'Candidate name missing in insight for app {aid}'
            assert email and email.strip(), f'Candidate email missing in insight for app {aid}'
            print(f'App #{aid} ({ins.get("job_title")}):')
            print(f'   -> Name: "{name}"')
            print(f'   -> Email: "{email}"')
            print(f'   -> Headline: "{headline}"')
            print(f'   -> Status: "{status}"')

        print('\nALL RECRUITER CANDIDATE IDENTITY ASSERTIONS PASSED 100%!')

if __name__ == '__main__':
    asyncio.run(verify())
