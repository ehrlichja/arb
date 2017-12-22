import boto3
import os.path
import sys

args = sys.argv

if len(args) != 2:
  raise RuntimeError("Usage: python3 fetch.py 20171205")

dateid = args[1]

s3 = boto3.resource('s3')
client = boto3.client("s3")

bucket = "ehrlich-arb-data"
print("Downloading data for %s" % (dateid)) 

buck = s3.Bucket(bucket)

s3files = []
for o in buck.objects.filter(Prefix=dateid).all():
    s3files.append(o.key)

print("%s files found in %s" % (len(s3files), bucket))

if os.path.isdir(dateid) == False:
    os.mkdir(dateid)

for f in s3files:
    if os.path.isfile(f) == False:
        print("Downloading %s ... " % (f), end='')
        client.download_file(bucket, f, f)
        print("done")
