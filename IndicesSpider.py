import os
import glob
import re
import requests
import datetime
import time

html_path = "HTML/"
indices_path = os.path.join(html_path, "*Indices*.htm")
indices_pattern = r'<tr\sid="pair_(\d+)">.+?span\stitle="([^><"]+)".+?indices/([^><"]+)"\stitle="([^><"]+)".+?</tr>'
dirs = glob.glob( indices_path )

url = "https://www.investing.com/instruments/HistoricalDataAjax"

headers = {
    'accept': "text/plain, */*; q=0.01",
    'origin': "https://www.investing.com",
    'x-requested-with': "XMLHttpRequest",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'postman-token': "1cc17485-bf05-d8e5-c58a-13637b1e254d"
    }

lines_count = 0
symbols_count = 0
for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    symbols_match = re.finditer(indices_pattern,file_str,re.S)
    symbol_index = 0
    end_date_str = (datetime.datetime.utcnow() + datetime.timedelta(days = -1)).strftime("%m-%d-%Y").replace("-","%2F")
    for symbol_match in symbols_match:
        symbol_index+=1
        curr_id_str = symbol_match.group(1)
        if int(curr_id_str) < 1:
           continue
        symbol_str = "Indices_" + symbol_match.group(3)
        candles_filename = os.path.join('Output/Indices/' + symbol_str + "_" + datetime.datetime.utcnow().strftime("%Y%m%d") + '.txt')
        if os.path.exists(candles_filename):
            continue
        row_count = 0
        symbols_count += 1
        st_date_str = "12%2F31%2F1949"
        while st_date_str != "null":
            time.sleep(5)
            payload = "action=historical_data&curr_id="+curr_id_str+"&end_date=" + end_date_str + "&header=Historical Data&interval_sec=Daily&smlID=2057370&sort_col=date&sort_ord=DESC&st_date=" + st_date_str
            #response = requests.request("POST", url, data=payload, headers=headers)
            response = requests.post(url, data=payload, headers=headers)
            table_pattern = r'<tr>.+?<td.+?data-real-value="([^><"]+?)".+?</td>' \
            '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
            '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
            '.+?data-real-value="([^><"]+?)".+?</td>'
            row_matchs = re.finditer(table_pattern,response.text,re.S)
            candles_file = open(candles_filename, "w")
            candles_file.truncate()
            candles_line = ''
            st_date_str = ""
            for cell_matchs in row_matchs:
                row_date = datetime.datetime.utcfromtimestamp((int)(cell_matchs.group(1)))
                if st_date_str == "":
                    row_next_date = row_date + datetime.timedelta(days = 1)
                    if row_next_date <= datetime.datetime.utcnow() + datetime.timedelta(days = -1):
                        st_date_str = row_next_date.strftime("%m-%d-%Y").replace("-","%2F")
                    else:
                        st_date_str = "null"
                date_string =  row_date.strftime("%Y-%m-%d")
                candles_line =  symbol_str + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
                candles_file.write(candles_line+'\n')
                print( candles_line )
                row_count += 1
        lines_count += row_count
        candles_file.close()
        print( curr_id_str + "\t" + symbol_match.group(2)+ "\t" + symbol_str+ "\t" + symbol_match.group(4)  + "\tLines="  + str(row_count))

print( "Symbols Count:" + str(symbols_count) +  "\tLines Count:" + str(lines_count))
