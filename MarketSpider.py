import os
import glob
import re
import requests
import datetime

html_path = "HTML/"
crypto_path = os.path.join(html_path, "*Crypto*.htm")
crypto_pattern = r'<tr.+?rank\sicon">(\d+)<.+?title="(.+?)".+?title="(.+?)".+?pid-(\d+)-last.+?</tr>'
dirs = glob.glob( crypto_path )


url = "https://www.investing.com/instruments/HistoricalDataAjax"

payload = "action=historical_data&curr_id=1057391&end_date=04%2F09%2F2019&header=null&interval_sec=Daily&smlID=25738435&sort_col=date&sort_ord=DESC&st_date=04%2F08%2F2018"
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

table_pattern = r'<tr>.+?<td.+?data-real-value="([^><"]+?)".+?</td>' \
'.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
'.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
'.+?data-real-value="([^><"]+?)".+?</td>' 

row_matchs = re.finditer(table_pattern,response.text,re.S)

candles_filename = os.path.join('Crypto_Candles_' + datetime.datetime.utcnow().strftime("%Y%m%d") + '.txt')
candles_file = open(candles_filename, "w")
candles_file.truncate()
candles_line = ''
candles_line = "Symbol\tDate\tClose\tOpen\tHigh\tLow\tVol"
candles_file.write(candles_line+'\n')
print( candles_line )
for cell_matchs in row_matchs:
    date_string =  datetime.datetime.utcfromtimestamp((int)(cell_matchs.group(1))).strftime("%Y-%m-%d")
    candles_line =  "BTC_USD" + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
    candles_file.write(candles_line+'\n')
    print( candles_line )

candles_file.close()

for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    matchs_str = re.finditer(crypto_pattern,file_str,re.S)
    for match_str in matchs_str:
        print( match_str.group(4) + "\t" + match_str.group(1)+ "\t" + match_str.group(3)+ "\t" + match_str.group(2)  )
