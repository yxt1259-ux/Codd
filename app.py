import os
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import requests

# 1. 自动定位绝对路径，彻底解决 404
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder=basedir)
CORS(app)

# 首页路由：让域名打开就是地图
@app.route('/')
def index():
    return send_from_directory(basedir, 'index.html')

# 静态资源路由：加载 JS/CSS/JSON
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(basedir, filename)

# 2. 核心 AI 逻辑：这部分一定要填对！
@app.route('/api/outfit', methods=['POST'])
def get_outfit():
    try:
        data = request.json
        # 从 Render 的 Environment Variables 里取 Key
        api_key = os.environ.get("QWEN_API_KEY")
        
        if not api_key:
            return jsonify({"success": False, "error": "后端未配置 API Key"}), 500
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "qwen-plus",
            "messages": [
                {"role": "system", "content": "你是一个专业的旅游穿搭专家。"},
                {"role": "user", "content": f"城市：{data['city']}，天气：{data['weather']}，气温：{data['temp']}℃。请简短地给出男女穿搭建议（50字内）。"}
            ]
        }

        # 真正发起对阿里云的请求
        response = requests.post(
            "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10 # 设置超时，防止 AI 反应太慢
        )
        
        res_json = response.json()
        
        # 检查阿里云是否报错
        if 'choices' in res_json:
            reply_text = res_json['choices'][0]['message']['content']
            return jsonify({"success": True, "text": reply_text})
        else:
            return jsonify({"success": False, "error": f"AI服务返回异常: {res_json}"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
