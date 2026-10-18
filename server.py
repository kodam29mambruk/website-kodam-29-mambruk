"""
=============================================================================
KODAM XXIX / MAMBRUK (PAPUA TENGAH)
SERVER WEB PORTAL & SISTEM PUBLIKASI INSTAN PENERANGAN (PENDAM)
=============================================================================
Menjalankan web server lokal otomatis untuk:
1. Menyajikan website KODAM XXIX/Mambruk
2. Menerima publikasi berita langsung dari halaman admin-liputan.html
3. Mengunggah foto liputan ke folder /uploads/ (tanpa dependensi cgi)
4. Memperbarui berita.json dan berita-data.js secara seketika (realtime)
=============================================================================
"""

import os
import sys
import json
import base64
import urllib.parse
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
BERITA_JSON_PATH = os.path.join(BASE_DIR, "berita.json")
BERITA_JS_PATH = os.path.join(BASE_DIR, "berita-data.js")

# Pastikan folder uploads tersedia
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR, exist_ok=True)

def get_current_wit_timestamp():
    now = datetime.now()
    bulan_id = [
        "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]
    return f"{now.day} {bulan_id[now.month]} {now.year}, {now.strftime('%H:%M:%S')} WIT"

def read_berita_json():
    if not os.path.exists(BERITA_JSON_PATH):
        return {"status": "success", "last_updated": get_current_wit_timestamp(), "total_articles": 0, "articles": []}
    try:
        with open(BERITA_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Gagal membaca berita.json: {e}")
        return {"status": "error", "articles": []}

def save_berita(data):
    # Urutkan artikel: P-1 (Flash) paling atas, lalu P-2 (Liputan), lalu P-3, baru P-4/Scraped
    def sort_key(item):
        prio = item.get("priority_level", "P-3")
        is_feat = 1 if item.get("is_featured") else 0
        prio_map = {"P-1": 100, "P-2": 80, "P-3": 50, "P-4": 10}
        score = prio_map.get(prio, 20) + (10 if is_feat else 0)
        return score

    sorted_articles = sorted(data.get("articles", []), key=sort_key, reverse=True)
    data["articles"] = sorted_articles
    data["total_articles"] = len(sorted_articles)
    data["last_updated"] = get_current_wit_timestamp()
    data["status"] = "success"

    # 1. Simpan ke berita.json
    with open(BERITA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 2. Sinkronkan ke berita-data.js agar fallback offline tetap sinkron
    js_content = "/* Embedded Dataset Berita KODAM XXIX/MAMBRUK - Diperbarui Otomatis */\n"
    js_content += f"window.MAMBRUK_NEWS_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n\n"
    js_content += """async function loadMambrukNewsData() {
    try {
        const res = await fetch('berita.json?t=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            if (data && data.articles && data.articles.length > 0) {
                return data;
            }
        }
    } catch (e) {
        console.warn('[MAMBRUK NEWS] Fetch berita.json fallback ke embedded dataset:', e);
    }
    return window.MAMBRUK_NEWS_DATA || { status: 'fallback', articles: [] };
}
"""
    try:
        with open(BERITA_JS_PATH, "w", encoding="utf-8") as f:
            f.write(js_content)
    except Exception as e:
        print(f"[WARN] Gagal update berita-data.js: {e}")

    return data

class PeneranganServerHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/berita":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            data = read_berita_json()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)

        # 1. API Upload Foto Liputan (Menerima Base64 JSON Payload)
        if parsed.path == "/api/upload":
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                req_data = json.loads(body)

                filename = req_data.get('filename', 'foto_liputan.jpg')
                data_url = req_data.get('data', '')

                if not data_url:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(b'{"status":"error","message":"Data foto kosong"}')
                    return

                # Decode data URL
                if ',' in data_url:
                    header, base64_str = data_url.split(',', 1)
                else:
                    base64_str = data_url

                binary_data = base64.b64decode(base64_str)

                ext = os.path.splitext(filename)[1].lower()
                if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                    ext = '.jpg'
                
                safe_filename = f"liputan_{int(datetime.now().timestamp())}_{os.urandom(3).hex()}{ext}"
                dest_path = os.path.join(UPLOADS_DIR, safe_filename)

                with open(dest_path, "wb") as f:
                    f.write(binary_data)

                relative_url = f"uploads/{safe_filename}"
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                resp = json.dumps({"status": "success", "image_url": relative_url, "filename": safe_filename})
                self.wfile.write(resp.encode("utf-8"))
                print(f"[FOTO] Disimpan: {relative_url}")
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
                return

        # 2. API Simpan / Publikasi Berita Baru
        if parsed.path == "/api/berita":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                new_article = json.loads(body)
                data = read_berita_json()
                articles = data.get("articles", [])

                article_id = new_article.get("id")
                if not article_id:
                    article_id = f"pen-{int(datetime.now().timestamp())}"
                    new_article["id"] = article_id

                new_article["is_priority"] = True
                new_article["is_live_scraped"] = False
                if not new_article.get("source"):
                    new_article["source"] = "Pendam XXIX/Mambruk"
                if not new_article.get("date"):
                    now = datetime.now()
                    bulan_id = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                    new_article["date"] = f"{now.day} {bulan_id[now.month]} {now.year}"

                existing_idx = next((i for i, a in enumerate(articles) if a.get("id") == article_id), None)
                if existing_idx is not None:
                    articles[existing_idx] = new_article
                else:
                    articles.insert(0, new_article)

                data["articles"] = articles
                save_berita(data)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                resp = json.dumps({"status": "success", "message": "Berita berhasil diterbitkan!", "article": new_article})
                self.wfile.write(resp.encode("utf-8"))
                print(f"[SUKSES] Berita diterbitkan: {new_article.get('title')[:60]}...")
                return
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
                return

        super().do_POST()

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/berita"):
            query = urllib.parse.parse_qs(parsed.query)
            target_id = query.get("id", [None])[0]
            if not target_id:
                self.send_response(400)
                self.end_headers()
                return

            data = read_berita_json()
            articles = data.get("articles", [])
            initial_count = len(articles)
            articles = [a for a in articles if a.get("id") != target_id]

            if len(articles) < initial_count:
                data["articles"] = articles
                save_berita(data)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"success","message":"Berita berhasil dihapus"}')
                print(f"[HAPUS] Berita {target_id} dihapus dari berita.json.")
            else:
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"error","message":"ID Berita tidak ditemukan"}')
            return

        super().do_DELETE()

def run_server():
    os.chdir(BASE_DIR)
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, PeneranganServerHandler)
    print("=" * 70)
    print("  KODAM XXIX / MAMBRUK - PORTAL REDAKSI & PUBLIKASI PENERANGAN")
    print("=" * 70)
    print(f"[*] Server aktif berjalan di: http://localhost:{PORT}")
    print(f"[*] Halaman Form Liputan   : http://localhost:{PORT}/admin-liputan.html")
    print(f"[*] Halaman Berita Website : http://localhost:{PORT}/berita.html")
    print(f"[*] Halaman Utama Website  : http://localhost:{PORT}/index.html")
    print("=" * 70)
    print("[*] Tekan Ctrl+C untuk menghentikan server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server dimatikan dengan aman.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
