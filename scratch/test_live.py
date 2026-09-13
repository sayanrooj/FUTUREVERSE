import urllib.request
import re

url = 'https://sayanrooj.github.io/FUTUREVERSE/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        print("Live HTML loaded. Length:", len(html))
        assets = re.findall(r'href="([^"]+)"|src="([^"]+)"', html)
        flat_assets = [a for pair in assets for a in pair if a]
        for a in flat_assets:
            print("Asset reference:", a)
            if a.endswith('.js'):
                js_url = 'https://sayanrooj.github.io' + a if a.startswith('/') else a
                print("Testing JS asset:", js_url)
                js_req = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(js_req) as js_resp:
                    js_code = js_resp.read().decode('utf-8')
                    print("JS asset loaded successfully! Length:", len(js_code))
                    # Check if standalone fallback engine and sayan.rooj are inside the bundle
                    if 'sayan.rooj' in js_code:
                        print(" Verified: 'sayan.rooj' password support is present in live JS bundle.")
                    else:
                        print(" Warning: 'sayan.rooj' NOT found in live JS bundle.")
                    if 'token-cand-' in js_code:
                        print(" Verified: Candidate fallback token generator is present in live JS bundle.")
                    else:
                        print(" Warning: Candidate fallback token generator not found in live JS bundle.")
except Exception as e:
    print("Error fetching live URL:", e)
