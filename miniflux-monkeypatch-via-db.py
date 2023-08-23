import psycopg2
import re

try:
    conn = psycopg2.connect("dbname='miniflux' user='postgres' host='localhost' password='postgres'")
except:
    print("I am unable to connect to the database")

with conn.cursor() as curs:
    curs.execute("Select * FROM entries LIMIT 0")
    colnames = [desc[0] for desc in curs.description]
    cols = {colnames[i]:i for i in range(len(colnames))}

    curs.execute("select * from entries where (status!='removed' and user_id=2);")
    n = 0
    na = 0
    for row in curs.fetchall():
        authors = row[cols['author']]
        title = row[cols['title']]
        itemID = row[cols['id']]

        # correct arxiv author name field
        if 'arxiv' in row[cols['url']] and 'a href="' in authors:
            authors_short = ', '.join([_[1:-4] for _ in re.findall('>[^<^>]+</a>', authors)])

            cmd = f"UPDATE entries SET author='{authors_short}' WHERE id={itemID};"
            curs.execute(cmd)
            na+=1

        # simplify hnbot title
        if 'https://me.ns.ci/@hnbot' in row[cols['url']]:
            title_short = title.split('----- ')[0]
            cmd = """UPDATE entries SET title='%s' WHERE id='%s';"""%(
                    title_short.replace("'", "''"),
                    itemID)
            curs.execute(cmd)
            na+=1

        n+=1

    conn.commit()
    print('tot: ', n, na)
