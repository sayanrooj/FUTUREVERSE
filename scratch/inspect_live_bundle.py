import urllib.request
import re

req = urllib.request.Request('https://sayanrooj.github.io/FUTUREVERSE/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
print('HTML length:', len(html))

js_matches = re.findall(r'src=["\']([^"\']+\.js)["\']', html)
print('JS bundle referenced in HTML:', js_matches)

for js in js_matches:
    if js.startswith('http'):
        url = js
    elif js.startswith('/'):
        url = 'https://sayanrooj.github.io' + js
    else:
        url = 'https://sayanrooj.github.io/FUTUREVERSE/' + js
    print('Fetching:', url)
    resp = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}))
    content = resp.read().decode('utf-8')
    print('Bundle size:', len(content))
    print('Has sayan.rooj:', 'sayan.rooj' in content)
    print('Has futureverse-api.loca.lt:', 'futureverse-api.loca.lt' in content)
