import os
import glob
import re
import requests
import datetime
import time

html_path = "HTML/"
crypto_path = os.path.join(html_path, "*Crypto*.htm*")
crypto_pattern = r'<tr.+?rank\sicon">(\d+)<.+?title="(.+?)".+?title="(.+?)".+?pid-(\d+)-last.+?</tr>'
dirs = glob.glob( crypto_path )


url = "https://cn.investing.com/instruments/HistoricalDataAjax"

headers = {
    'accept': "text/plain, */*; q=0.01",
    'origin': "https://cn.investing.com",
    'x-requested-with': "XMLHttpRequest",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'postman-token': "001488ed-8887-c84a-887c-ee407f04ea78"
    }

lines_count = 0
symbols_count = 0
for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    symbols_match = re.finditer(crypto_pattern,file_str,re.S)
    symbol_index = 0
    for symbol_match in symbols_match:
        symbol_index+=1
        curr_id_str = symbol_match.group(4)
        if int(curr_id_str) < 1:
           continue
        symbol_str = symbol_match.group(3) + "_USD"
        candles_filename = os.path.join('Output/' + symbol_str + datetime.datetime.utcnow().strftime("%Y%m%d") + '.txt')
        if os.path.exists(candles_filename):
            continue
        time.sleep(5)
        payload = "action=historical_data&curr_id="+curr_id_str+"&end_date=2019%2F07%2F28&header=null&interval_sec=Daily&smlID=25609848&sort_col=date&sort_ord=DESC&st_date=2000%2F04%2F08"
        response = requests.request("POST", url, data=payload, headers=headers)
        table_pattern = r'<tr>.+?<td.+?data-real-value="([^><"]+?)".+?</td>' \
        '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
        '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
        '.+?data-real-value="([^><"]+?)".+?</td>'
        row_matchs = re.finditer(table_pattern,response.text,re.S)
        candles_file = open(candles_filename, "w")
        candles_file.truncate()
        candles_line = ''
        symbols_count += 1
        row_count = 0
        for cell_matchs in row_matchs:
            date_string =  datetime.datetime.utcfromtimestamp((int)(cell_matchs.group(1))).strftime("%Y-%m-%d")
            candles_line =  symbol_str + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
            candles_file.write(candles_line+'\n')
            # print( candles_line )
            row_count += 1
        lines_count += row_count
        candles_file.close()
        print( curr_id_str + "\t" + symbol_match.group(1)+ "\t" + symbol_str+ "\t" + symbol_match.group(2)  + "\tLines="  + str(row_count))

print( "Symbols Count:" + str(symbols_count) +  "\tLines Count:" + str(lines_count))
