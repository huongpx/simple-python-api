from http.server import BaseHTTPRequestHandler, HTTPServer
import json

data = [
    {
        'id': 1,
        'name': 'huong',
        'age': 25
    },
    {
        'id': 2,
        'name': 'oanh',
        'age': 25
    },
]

class CustomHandler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_response()
        path = self.path
        student_id = path.strip().split('/')[-1]
        if student_id.isdigit():
            student_id = int(student_id)
            student = list(filter(lambda student: student["id"] == student_id, data))[0]
            self.wfile.write(json.dumps(student).encode('utf-8'))
        else:
            students = data
            self.wfile.write(json.dumps(students).encode('utf-8'))
            
    # def do_POST(self):
    #     content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
    #     post_data = self.rfile.read(content_length) # <--- Gets the data itself

        # self._set_response()
        # self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))

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
