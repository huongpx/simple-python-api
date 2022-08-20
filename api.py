from http.server import SimpleHTTPRequestHandler, HTTPServer
import sqlite3
import json

data = [
    {
        'student_id_number': 1,
        'name': 'huong',
        'age': 25
    },
    {
        'student_id_number': 2,
        'name': 'oanh',
        'age': 25
    },
]

class CustomHandler(SimpleHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        
    def do_OPTIONS(self):
        self._set_response()

    def do_GET(self):
        self._set_response()
        path = self.path
        student_id_number = path.strip().split('/')[-1]
        con = sqlite3.connect("manage_students.db")
        con.row_factory = sqlite3.Row
        cur = con.cursor()
        if student_id_number.isdigit():
            res = cur.execute(f"SELECT * FROM students WHERE student_id_number='{student_id_number}'")
            row = res.fetchone()
            student = dict(row)
            self.wfile.write(json.dumps(student).encode('utf-8'))
        else:
            res = cur.execute("SELECT * FROM students")
            rows = res.fetchall()
            students = [dict(row) for row in rows]
            self.wfile.write(json.dumps(students).encode('utf-8'))
        con.close()
            
    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        # print(post_data)
        new_student = json.loads(post_data)
        values = tuple(new_student.values())
        con = sqlite3.connect("manage_students.db")
        cur = con.cursor()
        cur.execute("INSERT INTO students (student_id_number, name, age) VALUES (?, ?, ?)", values)
        con.commit()
        con.close()

        self._set_response()
        self.wfile.write(json.dumps({"message": "Successful create student"}).encode('utf-8'))
        
    def do_PUT(self):
        path = self.path
        student_id_number = path.strip().split('/')[-1]
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        put_data = self.rfile.read(content_length) # <--- Gets the data itself
        updated_student = json.loads(put_data)
        values = tuple(updated_student.values())
        con = sqlite3.connect("manage_students.db")
        cur = con.cursor()
        cur.execute(f"UPDATE students SET student_id_number = ?, name = ?, age = ? WHERE student_id_number = {student_id_number}", values)
        con.commit()
        con.close()
        
        self._set_response()
        self.wfile.write(json.dumps({"message": "Successful update student"}).encode('utf-8'))
    
    def do_DELETE(self):
        path = self.path
        student_id_number = path.strip().split('/')[-1]
        con = sqlite3.connect("manage_students.db")
        cur = con.cursor()
        cur.execute(f"DELETE FROM students WHERE student_id_number = {student_id_number}")
        con.commit()
        con.close()
        
        self._set_response()
        self.wfile.write(json.dumps({"message": "Successful delete student"}).encode('utf-8'))
        

def run(server_class=HTTPServer, handler_class=CustomHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    run()
