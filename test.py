import sys

# def read_in():
#     lines = sys.stdin.readlines()
#     #Since our input would only be having one line, parse our JSON data from that
#     return json.loads(lines[0])

# def main():
#     #get our data as an array from read_in()
#     lines = read_in()
#     if (lines):
#         print('receive data')
#     else :
#         print('no data')

def main():
   # print('HI')
    for line in sys.stdin:
        print(line)

if __name__ == '__main__':
    main()