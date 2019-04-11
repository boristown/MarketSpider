import os
import glob
import re
import requests
import datetime
import time


country_list = ["argentina", "brazil", "canada",
                "chile",  "colombia", "costa",
                "rica", "jamaica", "mexico",
                "peru", "united-states", "venezuela",
				"austria", "belgium", "bosnia",
                "bulgaria", "croatia", "cyprus",
                "czech-republic", "denmark", "estonia",
                "finland", "france", "germany",
                "greece","hungary","iceland",
                "ireland","italy","latvia",
                "lithuania","malta","montenegro",
                "netherlands","norway","poland",
                "portugal","romania","russia",
                "serbia","slovakia","slovenia",
                "spain","sweden","switzerland",
                "turkey","ukraine","united-kingdom",
				"australia","bangladesh","china",
                "hong-kong","india","indonesia",
                "japan","kazakhstan","malaysia",
                "mongolia","new-zealand","pakistan",
                "philippines","singapore","south-korea",
                "sri-lanka","taiwan","thailand",
                "vietnam",
				"bahrain","egypt","iraq",
                "israel","jordan","kuwait",
                "lebanon","oman","palestinian-territory",
                "qatar","saudi-arabia","dubai",
				"botswana","ivory-coast","kenya",
                "malawi","mauritius","morocco",
                "namibia","nigeria","rwanda",
                "south-africa","tanzania","tunisia",
                "uganda","zambia","zimbabwe",
				]

html_path = "HTML/"
Equities_path = os.path.join(html_path, "*Stock*.htm*")
#<td class="bold left noWrap elp plusIconTd"><a href="/equities/ata-inc" title="ATA Inc">ATA</a><span data-name="ATA Inc" data-id="15481" data-volume="900,379" class="alertBellGrayPlus js-plus-icon genToolTip oneliner" data-tooltip="Create Alert"></span></td>
#Equities_pattern = r'data-gae="sb_Equities-[^><"]+">([^><"]+)</a></td><td\sclass="lastNum pid-(\d+)-last"'
Equities_pattern = r'<td\sclass="bold\sleft\snoWrap\selp\splusIconTd">.+?/equities/([^><"]+)".+?data-id="(\d+)"'
dirs = glob.glob( Equities_path )

url = "https://www.investing.com/instruments/HistoricalDataAjax"

headers = {
    'accept': "text/plain, */*; q=0.01",
    'origin': "https://www.investing.com",
    'x-requested-with': "XMLHttpRequest",
    'user-agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    'content-type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
    'postman-token': "17db1643-3ef6-fa9e-157b-9d5058f391e4"
    }

lines_count = 0
symbols_count = 0
for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    symbols_match = re.finditer(Equities_pattern,file_str,re.S)
    symbol_index = 0
    end_date_str = (datetime.datetime.utcnow() + datetime.timedelta(days = -1)).strftime("%m-%d-%Y").replace("-","%2F")
    for symbol_match in symbols_match:
        symbol_index+=1
        curr_id_str = symbol_match.group(2)
        if int(curr_id_str) < 1:
           continue
        symbol_str = "Equities_" + symbol_match.group(1).replace('/','_').replace('?','').replace('=','')
        candles_filename = os.path.join('Output/Equities/' + symbol_str + '.txt')
        if os.path.exists(candles_filename):
            continue
        row_count = 0
        symbols_count += 1
        st_date_str = "12%2F31%2F1949"
        candles_file = open(candles_filename, "w")
        candles_file.truncate()
        candles_line = ''
        while st_date_str != "null" and st_date_str != "":
            time.sleep(1)
            payload = "action=historical_data&curr_id="+curr_id_str+"&end_date=" + end_date_str + "&header=null&interval_sec=Daily&smlID=&sort_col=date&sort_ord=DESC&st_date=" + st_date_str
            print( payload )
            while True:
                try:
                    response = requests.request("POST", url, data=payload, headers=headers, verify=False)
                    break
                except:
                    print("Retry after 7 seconds……")
                    time.sleep(7)
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
                date_string =  row_date.strftime("%Y-%m-%d")
                candles_line =  symbol_str + "\t" + date_string + "\t" + cell_matchs.group(2) + "\t" + cell_matchs.group(3) + "\t" + cell_matchs.group(4) + "\t" + cell_matchs.group(5) + "\t" + cell_matchs.group(6)
                candles_file.write(candles_line+'\n')
                #print( candles_line )
                row_count += 1
        lines_count += row_count
        candles_file.close()
        print( curr_id_str + "\t" + symbol_str + "\tLines="  + str(row_count))

print( "Symbols Count:" + str(symbols_count) +  "\tLines Count:" + str(lines_count))
