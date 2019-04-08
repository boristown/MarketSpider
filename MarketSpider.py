import os
import glob
import re

html_path = "HTML/"
crypto_path = os.path.join(html_path, "*Crypto*.htm")
crypto_pattern = r'<tr\si="(\d+?)">.+?title="(.+?)".+?title="(.+?)".+?</tr>'
dirs = glob.glob( crypto_path )

for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    matchs_str = re.finditer(crypto_pattern,file_str,re.S)
    for match_str in matchs_str:
        print( match_str.group(1) + "\t" + match_str.group(3)+ "\t" + match_str.group(2)  )