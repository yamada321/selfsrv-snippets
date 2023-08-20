import re, requests, sys

url = sys.argv[1]
if len(sys.argv)<2:
    print('usage: python src.py $url')
    print('  $url is the url of a youtube channel base page, or the playlist url of it (bazqux uses this).')
    exit(1)

page = requests.get(url)
if '/@' in url:
    x = re.findall('"externalId":"[^,]+",', page.text)
    try: ID = x[0].split('":"')[1][:-2]
    except:
        print('[E] parsing failed')
        exit(1)
else:
    x = re.findall('"browseEndpoint":{"browseId":"[^,]+","',page.text)
    try: ID = x[0].split('browseId":"')[1].split('","')[0]
    except:
        print('[E] parsing failed')
        exit(1)

feedurl = f'https://www.youtube.com/feeds/videos.xml?channel_id={ID}'
print(feedurl)
