import subprocess
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Next.jsプロセスを起動
def start_nextjs():
    try:
        # 環境変数を設定
        env = os.environ.copy()
        env['NODE_ENV'] = 'production'
        
        # Next.jsサーバーを起動
        subprocess.Popen(['npm', 'start'], 
                        cwd='/home/ubuntu/gaiheki',
                        env=env)
        return True
    except Exception as e:
        print(f"Error starting Next.js: {e}")
        return False

@app.route('/')
def index():
    return '''
    <html>
    <head>
        <meta http-equiv="refresh" content="0; url=http://localhost:3000">
        <title>Redirecting to Gaiheki App</title>
    </head>
    <body>
        <p>Redirecting to <a href="http://localhost:3000">Gaiheki App</a>...</p>
        <script>window.location.href = "http://localhost:3000";</script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    # Next.jsを起動
    start_nextjs()
    
    # Flaskアプリを起動
    app.run(host='0.0.0.0', port=5000, debug=False)
