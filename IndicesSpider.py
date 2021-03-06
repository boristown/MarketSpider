import os
import glob
import re
import requests
import datetime
import time

'''
<tr>
    <td class="flag"><span title="美国" class="ceFlags USA">&nbsp;</span></td>
    <td class="bold left plusIconTd noWrap elp"><a title="VIX恐慌指数" href="/indices/volatility-s-p-500" target="_blank" boundblank="">VIX恐慌指数</a>
    <span class="alertBellGrayPlus js-plus-icon genToolTip oneliner" data-tooltip="创建提醒" data-name="VIX恐慌指数" data-id="44336"></span></td>
		        <td class="pid-44336-last">12.16</td>
                <td class="pid-44336-high">12.72</td>
    <td class="pid-44336-low">12.01</td>
    <td class="bold redFont pid-44336-pc">0.00</td>
    <td class="bold redFont pid-44336-pcp">0.00%</td>
    <td class="pid-44336-time" data-value="1564172098">27/07</td>
    <td class="icon"><span class="redClockIcon">&nbsp;</span></td>
</tr>
'''

html_path = "HTML/"
indices_path = os.path.join(html_path, "*Indices*.htm*")
#indices_pattern = r'<tr\sid="pair_(\d+)">.+?span\stitle="([^><"]+)".+?indices/([^><"]+)"\stitle="([^><"]+)".+?</tr>'
indices_pattern = r'<td\sclass="flag"><span\stitle="([^><"]+)".+?><a\stitle="([^><"]+)".+?data-id="(\d+)">.+?</tr>'
dirs = glob.glob( indices_path )

url = "https://www.investing.com/instruments/HistoricalDataAjax"

headers = {
    'accept': "text/plain, */*; q=0.01",
    'origin': "https://www.investing.com",
    'x-requested-with': "XMLHttpRequest",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'postman-token': "70441f40-9f53-64b9-1e45-240be75afb7d"
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
        curr_id_str = symbol_match.group(3)
        if int(curr_id_str) < 1:
           continue
        symbol_str = "Indices_" + symbol_match.group(2).replace("&amp;","").replace("/","")
        candles_filename = os.path.join('Output/Indices/' + symbol_str + "_" + datetime.datetime.utcnow().strftime("%m%d%Y") + '.txt')
        if os.path.exists(candles_filename):
            continue
        row_count = 0
        symbols_count += 1
        st_date_str = "12%2F31%2F1949"
        candles_file = open(candles_filename, "w")
        candles_file.truncate()
        candles_line = ''
        while st_date_str != "null" and st_date_str != "":
            time.sleep(6)
            payload = "action=historical_data&curr_id="+curr_id_str+"&end_date=" + end_date_str + "&header=null&interval_sec=Daily&smlID=2030170&sort_col=date&sort_ord=DESC&st_date=" + st_date_str
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
                        st_date_str = row_next_date.strftime("%m-%d-%Y").replace("-","%2F")
                    else:
                        st_date_str = "null"
                date_string =  row_date.strftime("%m-%d-%Y")
                candles_line =  symbol_str + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
                candles_file.write(candles_line+'\n')
                print( candles_line )
                row_count += 1
        lines_count += row_count
        candles_file.close()
        print( curr_id_str + "\t" + symbol_match.group(1)+ "\t" + symbol_str+ "\t" + symbol_match.group(2).replace("&amp;","").replace("/","")  + "\tLines="  + str(row_count))

print( "Symbols Count:" + str(symbols_count) +  "\tLines Count:" + str(lines_count))
