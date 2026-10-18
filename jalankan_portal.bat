@echo off
chcp 65001 >nul
title KODAM XXIX/MAMBRUK - Portal Publikasi Penerangan & Web Server
color 0A
cls
echo =====================================================================
echo       KOMANDO DAERAH MILITER XXIX / MAMBRUK (PAPUA TENGAH)
echo           PORTAL REDAKSI & PUBLIKASI BERITA PENERANGAN
echo =====================================================================
echo.
echo [*] Memulai Web Server Portal Penerangan KODAM XXIX/MAMBRUK...
echo [*] URL Form Input Liputan : http://localhost:8000/admin-liputan.html
echo [*] URL Website Utama      : http://localhost:8000/index.html
echo [*] URL Halaman Berita     : http://localhost:8000/berita.html
echo.
echo [*] Membuka formulir input liputan di browser...
start http://localhost:8000/admin-liputan.html

echo.
echo =====================================================================
echo [INFO] Server siap menerima publikasi berita!
echo Biarkan jendela command prompt ini tetap terbuka saat menginput rilis.
echo Untuk menghentikan server, tutup jendela ini atau tekan Ctrl+C.
echo =====================================================================
echo.

python "%~dp0server.py"

pause
