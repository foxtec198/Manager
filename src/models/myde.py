from os import environ

def load():
    with open('.env') as path:
        for item in path:
            item = item.split('=')
            key = item[0]
            value = item[1].strip('\n')
            environ[key] = value