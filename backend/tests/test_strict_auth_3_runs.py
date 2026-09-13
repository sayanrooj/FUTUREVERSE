import asyncio
import httpx

async def run_suite():
    base_url = 'http://127.0.0.1:8000/api'
    async with httpx.AsyncClient(base_url=base_url) as client:
        for cycle in range(1, 4):
            print(f'\n======================================================')
            print(f'>>> TEST RUN {cycle} OF 3 STARTING...')
            print(f'======================================================')

            # 1. Arbitrary login
            r1 = await client.post('/auth/login', json={'email': f'bogus_{cycle}@random.xyz', 'password': 'randompassword123'})
            assert r1.status_code == 401, f'Expected 401, got {r1.status_code}'
            print(f'  [PASS 1] Arbitrary email strictly rejected (Status {r1.status_code}: {r1.json().get("detail")})')

            # 2. Wrong password
            r2 = await client.post('/auth/login', json={'email': 'sayanrooj742137@gmail.com', 'password': 'incorrect_pw'})
            assert r2.status_code == 401, f'Expected 401, got {r2.status_code}'
            print(f'  [PASS 2] Wrong password strictly rejected (Status {r2.status_code}: {r2.json().get("detail")})')

            # 3. Role separation
            r3 = await client.post('/auth/login', json={'email': 'admin@futureverse.ai', 'password': 'Admin@2026'})
            assert r3.status_code == 403, f'Expected 403, got {r3.status_code}'
            print(f'  [PASS 3] Role separation enforced on candidate login (Status {r3.status_code}: {r3.json().get("detail")})')

            # 4. Valid candidate login
            r4 = await client.post('/auth/login', json={'email': 'sayanrooj742137@gmail.com', 'password': 'sayan.rooj'})
            assert r4.status_code == 200, f'Expected 200, got {r4.status_code}'
            print(f'  [PASS 4] Candidate sign in succeeded (User: {r4.json().get("email")}, Role: {r4.json().get("role")})')

            # 5. Forgot Password: Request OTP
            r5 = await client.post('/auth/forgot-password/request-otp', json={'email': 'sayanrooj742137@gmail.com'})
            assert r5.status_code == 200, f'Expected 200, got {r5.status_code}'
            otp = r5.json().get('demo_otp')
            print(f'  [PASS 5] OTP generated successfully -> Code: {otp}')

            # 6. Verify incorrect OTP
            r6 = await client.post('/auth/forgot-password/verify-otp', json={'email': 'sayanrooj742137@gmail.com', 'otp': '000000'})
            assert r6.status_code == 400, f'Expected 400, got {r6.status_code}'
            print(f'  [PASS 6] Incorrect OTP rejected (Status {r6.status_code}: {r6.json().get("detail")})')

            # 7. Verify correct OTP
            r7 = await client.post('/auth/forgot-password/verify-otp', json={'email': 'sayanrooj742137@gmail.com', 'otp': otp})
            assert r7.status_code == 200, f'Expected 200, got {r7.status_code}'
            print(f'  [PASS 7] Correct OTP verified (Status {r7.status_code}: {r7.json().get("message")})')

            # 8. Reset password to temporary
            temp_pw = f'Sayan@Temp{cycle}Pass'
            r8 = await client.post('/auth/forgot-password/reset', json={'email': 'sayanrooj742137@gmail.com', 'otp': otp, 'new_password': temp_pw})
            assert r8.status_code == 200, f'Expected 200, got {r8.status_code}'
            print(f'  [PASS 8] Password reset to {temp_pw} succeeded (Status {r8.status_code})')

            # 9. Old password rejected
            r9 = await client.post('/auth/login', json={'email': 'sayanrooj742137@gmail.com', 'password': 'sayan.rooj'})
            assert r9.status_code == 401, f'Expected 401, got {r9.status_code}'
            print(f'  [PASS 9] Old password rejected as expected (Status {r9.status_code})')

            # 10. New password succeeds
            r10 = await client.post('/auth/login', json={'email': 'sayanrooj742137@gmail.com', 'password': temp_pw})
            assert r10.status_code == 200, f'Expected 200, got {r10.status_code}'
            print(f'  [PASS 10] New password login succeeded (Status {r10.status_code})')

            # 11. Restore password to sayan.rooj
            r_req = await client.post('/auth/forgot-password/request-otp', json={'email': 'sayanrooj742137@gmail.com'})
            rst_otp = r_req.json().get('demo_otp')
            await client.post('/auth/forgot-password/verify-otp', json={'email': 'sayanrooj742137@gmail.com', 'otp': rst_otp})
            r_rst = await client.post('/auth/forgot-password/reset', json={'email': 'sayanrooj742137@gmail.com', 'otp': rst_otp, 'new_password': 'sayan.rooj'})
            assert r_rst.status_code == 200
            print(f'  [PASS 11] Password restored back to sayan.rooj')

            # 12. Final confirmation login with sayan.rooj
            r_fin = await client.post('/auth/login', json={'email': 'sayanrooj742137@gmail.com', 'password': 'sayan.rooj'})
            assert r_fin.status_code == 200
            print(f'  [PASS 12] Final confirmation login with sayan.rooj verified!')

            print(f'>>> TEST RUN {cycle} COMPLETED WITH 100% SUCCESS!\n')

        print('======================================================')
        print('ALL 3 TEST RUNS COMPLETED WITH 100% PASS RATE AND ZERO DEFECTS!')
        print('======================================================')

if __name__ == '__main__':
    asyncio.run(run_suite())
