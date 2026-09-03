# Çatpat V06 - Civciv / Kayıp Top 8-Kare Görsel Entegrasyon Notu

Bu teslim, önceki 2-kare Civciv temsilinin yerine kullanılacak yeni onaylı büyük gözlü sarı Civciv tasarımını taşır. Civciv'in bekleyen/endişeli ve görev tamamlandıktan sonraki mutlu durumları artık ayrı ayrı **8 karelik** gerçek RGBA PNG animasyonlarıdır. Kayıp top karakterden tamamen ayrı statik objedir.

## Teslim paketi

ChatGPT teslim paketi: `catpat-v06-civciv-8frame-v03.zip`.

Paket yapısı:

- `waiting/friend_civciv_waiting_00.png` ... `friend_civciv_waiting_07.png`
  - 8 ayrı kare, her biri 512x512 RGBA PNG
  - loop: evet
  - fps: 8
  - pivot: `[256,480]`
- `happy/friend_civciv_happy_00.png` ... `friend_civciv_happy_07.png`
  - 8 ayrı kare, her biri 512x512 RGBA PNG
  - loop: evet
  - fps: 8
  - pivot: `[256,480]`
- `friend_civciv_waiting_sheet.png`
  - türetilmiş kolaylık çıktısı; 4096x512, 8 yatay hücre
- `friend_civciv_happy_sheet.png`
  - türetilmiş kolaylık çıktısı; 4096x512, 8 yatay hücre
- `obj_ball.png`
  - 512x512 RGBA, statik ayrı görev objesi
- `manifest.json`
  - kare sırası, FPS, pivot, renderScale ve kalite sözleşmesi
- `qa_report.json`
  - her dosya için boyut, RGBA, görünür sınır, köşe alfa ve SHA256 doğrulaması

**Kaynak doğrusu ayrı PNG kareleridir.** Sheet dosyaları yalnız runtime kolaylığı için bu karelerden türetilmiştir; AI tarafından tek parça sahne/sunum görseli olarak üretilmiş sheet kullanılmamalıdır.

## Görsel hareket kararı

Waiting ve happy animasyonları seçilen aynı Civciv master artından türetilmiştir; karakterin yüzü, tüy yapısı, rengi ve oranları kareler arasında değişmez. Waiting çok hafif nefes/salınım hareketidir. Happy aynı tasarım üzerinde hafif kutlama salınımıdır. Hareket pivot çevresinde uygulanır; zeminde kayma yaratacak frame-by-frame yeniden çizim yoktur.

## Teknik kabul sonucu

- Bütün tekil kareler 512x512 gerçek RGBA PNG.
- Dört köşenin alfa değeri 0.
- Görünür içerik bütün karelerde her kenardan en az 8 px içeride.
- Waiting görünür tabanı frame 00-04 için y=480, 05-07 için anti-alias sınırı nedeniyle y=481; mekanik pivot sabit `[256,480]`.
- Happy görünür tabanı bütün karelerde y=480.
- Checkerboard/dama deseni asset içine pişirilmemiştir.
- Render scale mevcut arkadaş sözleşmesiyle `0.18`.
- Collider alfa kanalından üretilmeyecek.

## Claude entegrasyon görevi

1. Yalnız `claude/v06-integration` dalında çalış; `main` ile merge yapma.
2. Teslim ZIP'ini proje içinde uygun üretim/staging klasörüne çıkar ve SHA/ölçü/alfa doğrulamasını tekrar çalıştır.
3. Eski `friend_civciv_sheet.png` 2-kare temsilini runtime'dan kaldır. İki farklı Civciv tasarımını birlikte bırakma.
4. Civciv için waiting clip'i 8 kare / 8 FPS loop, happy clip'i 8 kare / 8 FPS loop olarak yükle. Repo mimarisinde sheet tercih ediliyorsa yalnız paketteki ayrı karelerden türetilmiş 4096x512 sheetleri kullan.
5. Görev tamamlanmadan `waiting`; kayıp top alınıp görev tamamlanınca `happy` clip'ine geç.
6. `src/game/Mission.js` içindeki `lost-toy` görevinde kullanılan `obj_star.png` yer tutucusunu kaldır ve ayrı `obj_ball.png` kullan. Hikâyede yıldız oyuncağı bırakma.
7. Civciv pivotu `[256,480]`, renderScale `0.18`. Topu da taban pivotuyla platform üstüne fiziksel olarak oturt. Görsel collider üretme.
8. Mevcut Porsuk, Baykuş ve elma bahçesi görsellerini bu değişiklik kapsamında yeniden üretme.
9. Masaüstü ve yatay mobil QA'da Civciv'in ayak tabanını, 8-kare animasyon akışını, topun zemin hizasını, toplama anını ve waiting->happy geçişini kontrol et.
10. `npm test`, `npm run test:assets`, `npm run test:budget`, `npm run test:visual` ve `npm run build:test` çalıştır; sonuçları commit notuna yaz.
11. Entegrasyon ve test tamamlanınca ilgili `ASSET-REQUESTS.md` talebini Completed bölümüne taşı; ChatGPT tarafında önceden Completed'a taşıma.

## GitHub binary notu

ChatGPT'nin bağlı GitHub connector'u UTF-8 metin/commit işlemlerini yapabiliyor ancak yerel PNG/ZIP dosya yolunu doğrudan binary upload parametresi olarak kabul etmiyor. Bu nedenle bu README dalda günceldir; binary teslim paketi kullanıcıya `catpat-v06-civciv-8frame-v03.zip` olarak verilir ve Claude Code entegrasyon sırasında repo çalışma ağacına alır.
