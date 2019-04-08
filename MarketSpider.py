import os
import glob

html_path = "HTML/"

crypto_path = os.path.join(html_path, "*Crypto*.htm")
dirs = glob.glob( crypto_path )

for file_path in dirs:
    print( file_path )
    file = open( file_path, "r", encoding="utf-8" )
    file_str = file.read()
    print(file_str)