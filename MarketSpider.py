import os
import glob
import re
import http.client
import requests

html_path = "HTML/"
crypto_path = os.path.join(html_path, "*Crypto*.htm")
crypto_pattern = r'<tr.+?rank\sicon">(\d+)<.+?title="(.+?)".+?title="(.+?)".+?pid-(\d+)-last.+?</tr>'
dirs = glob.glob( crypto_path )


url = "https://www.investing.com/instruments/HistoricalDataAjax"

payload = "action=historical_data&curr_id=1057391&end_date=04%2F09%2F2019&header=null&interval_sec=Daily&smlID=25738435&sort_col=date&sort_ord=DESC&st_date=04%2F08%2F2019"
headers = {
    'accept': "text/plain, */*; q=0.01",
    'origin': "https://www.investing.com",
    'x-requested-with': "XMLHttpRequest",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'postman-token': "e085dd1a-2c0b-5cd8-6098-f8dd8d1b5e37"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)

for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    matchs_str = re.finditer(crypto_pattern,file_str,re.S)
    for match_str in matchs_str:
        print( match_str.group(4) + "\t" + match_str.group(1)+ "\t" + match_str.group(3)+ "\t" + match_str.group(2)  )