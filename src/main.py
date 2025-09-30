import subprocess
import os
import time
import threading
from flask import Flask, request, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Next.jsプロセスの参照
nextjs_process = None

def start_nextjs():
    global nextjs_process
    try:
        # 環境変数を設定
        env = os.environ.copy()
        env['NODE_ENV'] = 'production'
        env['PORT'] = '3000'
        
        # Next.jsサーバーを起動
        nextjs_process = subprocess.Popen(
            ['npm', 'start'], 
            cwd='/home/ubuntu/gaiheki',
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Next.jsが起動するまで待機
        time.sleep(10)
        return True
    except Exception as e:
        print(f"Error starting Next.js: {e}")
        return False

def proxy_request(path):
    """Next.jsサーバーへリクエストをプロキシ"""
    try:
        url = f"http://localhost:3000{path}"
        
        # クエリパラメータを追加
        if request.query_string:
            url += f"?{request.query_string.decode()}"
        
        # リクエストをプロキシ
        if request.method == 'GET':
            resp = requests.get(url, headers=dict(request.headers))
        elif request.method == 'POST':
            resp = requests.post(url, 
                               data=request.get_data(),
                               headers=dict(request.headers))
        else:
            resp = requests.request(request.method, url,
                                  data=request.get_data(),
                                  headers=dict(request.headers))
        
        # レスポンスを返す
        return Response(
            resp.content,
            status=resp.status_code,
            headers=dict(resp.headers)
        )
    except Exception as e:
        return f"Error proxying request: {e}", 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return proxy_request(f"/{path}")

if __name__ == '__main__':
    # Next.jsを別スレッドで起動
    nextjs_thread = threading.Thread(target=start_nextjs)
    nextjs_thread.daemon = True
    nextjs_thread.start()
    
    # 少し待ってからFlaskを起動
    time.sleep(5)
    
    # Flaskアプリを起動
    app.run(host='0.0.0.0', port=5000, debug=False)
