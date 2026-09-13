import urllib.request
import re

url = 'https://sayanrooj.github.io/FUTUREVERSE/assets/index-00ZJtZRa.js'
content = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')

# Search for login logic
idx = content.find('futureverse-api.loca.lt')
print("Found loca.lt at index:", idx)
print("Snippet around loca.lt:")
print(content[max(0, idx-300):min(len(content), idx+500)])

idx_login = content.find('/auth/login')
print("\nFound /auth/login at index:", idx_login)
print("Snippet around /auth/login:")
print(content[max(0, idx_login-200):min(len(content), idx_login+600)])
