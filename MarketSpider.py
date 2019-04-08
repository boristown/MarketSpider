import os
import glob

html_path = "HTML/"

crypto_path = os.path.join(html_path, "*Crypto*.htm")
dirs = glob.glob( crypto_path )

for file in dirs:
    print( file )