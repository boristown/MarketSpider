import os
import glob
import re
import requests
import datetime
import time

html_path = "HTML/"
Commodities_path = os.path.join(html_path, "*Commodities*.htm*")
#<td class="bold left plusIconTd noWrap elp"><a title="Tin Futures (CFD)" href="https://www.investing.com/commodities/tin">Tin</a><span class="alertBellGrayPlus js-plus-icon genToolTip oneliner" data-tooltip="Create Alert" data-name="Tin Futures" data-id="959209"></span></td>
#Commodities_pattern = r'data-gae="sb_commodities-[^><"]+">([^><"]+)</a></td><td\sclass="lastNum pid-(\d+)-last"'
Commodities_pattern = r'<td\sclass="bold\sleft\splusIconTd\snoWrap\selp"><a\stitle="[^><]+>([^><"]+)</a>.+?data-id="(\d+)"'
dirs = glob.glob( Commodities_path )

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
    symbols_match = re.finditer(Commodities_pattern,file_str,re.S)
    symbol_index = 0
    end_date_str = (datetime.datetime.utcnow() + datetime.timedelta(days = -1)).strftime("%Y-%m-%d").replace("-","%2F")
    for symbol_match in symbols_match:
        symbol_index+=1
        curr_id_str = symbol_match.group(2)
        if int(curr_id_str) < 1:
           continue
        symbol_str = "Commodities_" + symbol_match.group(1).replace('/','_')
        candles_filename = os.path.join('Output/Commodities/' + symbol_str + "_" + datetime.datetime.utcnow().strftime("%Y%m%d") + '.txt')
        if os.path.exists(candles_filename):
            continue
        row_count = 0
        symbols_count += 1
        st_date_str = "1949%2F12%2F31"
        candles_file = open(candles_filename, "w")
        candles_file.truncate()
        candles_line = ''
        while st_date_str != "null" and st_date_str != "":
            time.sleep(5)
            payload = "action=historical_data&curr_id="+curr_id_str+"&end_date=" + end_date_str + "&header=null&interval_sec=Daily&smlID=25609848&sort_col=date&sort_ord=DESC&st_date=" + st_date_str
            print( payload )
            while True:
                try:
                    response = requests.request("POST", url, data=payload, headers=headers, verify=False)
                    break
                except:
                    print("Retry after 15 seconds……")
                    time.sleep(15)
            #response = requests.post(url, data=payload, headers=headers, verify=False)
            table_pattern = r'<tr>.+?<td.+?data-real-value="([^><"]+?)".+?</td>' \
            '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
            '.+?data-real-value="([^><"]+?)".+?</td>.+?data-real-value="([^><"]+?)".+?</td>'  \
            '.+?data-real-value="([^><"]+?)".+?</td>'
            row_matchs = re.finditer(table_pattern,response.text,re.S)
            st_date_str = ""
            for cell_matchs in row_matchs:
                row_date = datetime.datetime.utcfromtimestamp((int)(cell_matchs.group(1)))
                if st_date_str == "":
                    row_next_date = row_date + datetime.timedelta(days = 1)
                    if row_next_date <= datetime.datetime.utcnow() + datetime.timedelta(days = -1):
                        st_date_str = row_next_date.strftime("%Y-%m-%d").replace("-","%2F")
                    else:
                        st_date_str = "null"
                date_string =  row_date.strftime("%Y-%m-%d")
                candles_line =  symbol_str + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
                candles_file.write(candles_line+'\n')
                print( candles_line )
                row_count += 1
        lines_count += row_count
        candles_file.close()
        print( curr_id_str + "\t" + symbol_str + "\tLines="  + str(row_count))

print( "Symbols Count:" + str(symbols_count) +  "\tLines Count:" + str(lines_count))
