# Çatpat V06 - Civciv / Kayıp Top Görsel Entegrasyon Notu

Bu teslim, önceki Civciv görselinin yerine kullanılacak yeni onaylı karakter yönünü taşır. Amaç Civciv'in bekleyen ve görev tamamlanmış durumlarını aynı karakter tasarımıyla göstermek ve kayıp topu karakterden bağımsız gerçek bir oyun objesi yapmak.

## Teslim dosyaları

- `friend_civciv_waiting.png` - 512x512 RGBA, bekleyen/endişeli durum.
- `friend_civciv_happy.png` - 512x512 RGBA, görev sonrası mutlu durum.
- `friend_civciv_sheet.png` - 1024x512 RGBA; frame 0 waiting, frame 1 happy.
- `obj_ball.png` - 512x512 RGBA, kanonik kayıp top objesi.
- `civciv_lost_ball.png` - mevcut ASSET-REQUESTS adıyla uyumluluk kopyası; runtime entegrasyonunda `obj_ball.png` kanonik ad olarak tercih edilmeli ve mükerrer asset bırakılmamalı.

## Entegrasyon görevi

1. `claude/v06-integration` dalında çalış; `main` ile merge yapma.
2. Eski Civciv görselini yeni `friend_civciv_sheet.png` ile değiştir; iki farklı Civciv tasarımını birlikte bırakma.
3. `lost-toy` görevindeki `obj_star.png` yer tutucusunu kaldır ve ayrı top assetini kullan. Görev anlatımında oyuncak yıldız değil top olmalı.
4. Civciv görev başlamadan/bitmeden waiting frame, top bulunup görev tamamlanınca happy frame göstermeli.
5. Karakter pivotu `[256,480]`. Top için de taban hizası `[256,480]` kabul edilerek sahnedeki y değeriyle zemine oturt.
6. Görsel collider üretme. Mekanik collider ve etkileşim yarıçapını kod/manifest üzerinden açık tanımla.
7. `obj_ball.png` ile `civciv_lost_ball.png` aynı görseli temsil eder; entegrasyondan sonra runtime'da yalnız bir dosya adı bırak.
8. Mevcut Porsuk, Baykuş ve elma bahçesi assetlerini bu iş kapsamında yeniden üretme veya değiştirme.
9. Masaüstü ve yatay mobil görsel QA al; Civciv ayaklarının zeminde, topun platforma oturmuş ve hiçbir şeyin kesilmemiş olduğunu kontrol et.
10. Repo talimatlarındaki test paketini çalıştır ve sonucu commit notuna yaz.

## Görsel QA

Tüm tek kare PNG'ler 512x512 RGBA'dır. Dört köşe alfa 0'dır. Görünür içerik her kenardan en az 8 px içeridedir. Waiting ve happy kareleri ortak 512x512 tuval, ortak ölçek ve `[256,480]` pivot kullanır.

## Paket

ChatGPT teslim paketi: `catpat-v06-civciv-update-v01.zip`. Paket içinde PNG'ler, `manifest.json`, bu entegrasyon notu ve SHA256 listesi bulunur.
