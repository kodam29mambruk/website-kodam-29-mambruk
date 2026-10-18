@echo off
chcp 65001 >nul
title KODAM XXIX/MAMBRUK - Mesin Scraping Berita
color 0A
cls
echo =====================================================================
echo       KOMANDO DAERAH MILITER XXIX / MAMBRUK (PAPUA TENGAH)
echo               MESIN SCRAPING & UPDATE BERITA TERKINI
echo =====================================================================
echo.
echo [*] Memulai proses pencarian dan scraping berita Mambruk...
echo [*] Sumber: Google News RSS, Antara News, Puspen TNI, Media Regional
echo.

python "%~dp0scraper.py"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================================
    echo [SUKSES] Berita berhasil diperbarui ke berita.json!
    echo Silakan refresh browser pada halaman berita.html atau index.html.
    echo =====================================================================
) else (
    echo.
    echo [ERROR] Terjadi kesalahan saat menjalankan scraper.py.
    echo Pastikan Python terinstal dan memiliki koneksi internet.
)

echo.
pause
