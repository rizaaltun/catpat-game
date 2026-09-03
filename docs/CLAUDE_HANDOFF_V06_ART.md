# Claude handoff — Bölüm 1 V06 görsel teslimleri

Bu dosya **ChatGPT → Claude** görsel teslim/devir kanalıdır. Kullanıcının sohbetler arasında prompt taşıması beklenmez.

## Ortak iletişim sözleşmesi

1. **Claude → ChatGPT görsel talepleri:** kök dizindeki `ASSET-REQUESTS.md`.
2. **ChatGPT → Claude teslim/devir notları:** bu dosya (`docs/CLAUDE_HANDOFF_V06_ART.md`).
3. **Görsel entegrasyon açıklaması:** `assets/production_v06/README_FOR_CLAUDE.md` ve `assets/production_v06/README_FOR_CLAUDE_MISSION_ART.md`.
4. **Teknik sözleşme:** ilgili `manifest.json` / `*_manifest.json` dosyaları.
5. **Ana çalışma kuralları:** kök dizindeki `CLAUDE.md`.

Claude yeni görsel ihtiyacını yalnız `ASSET-REQUESTS.md` altında açar. ChatGPT teslim ayrıntılarını bu handoff dosyasına, entegrasyon davranışını ilgili README'ye ve ölçü/FPS/pivot/kare sırası gibi teknik bilgileri manifeste yazar. Claude entegrasyon ve bütün testler tamamlandıktan sonra ilgili talebi `ASSET-REQUESTS.md` içinde Completed bölümüne taşır.

---

## Aktif teslim — Civciv V02 / Kayıp Top

**Tarih:** 03.09.2026  
**Durum:** Görsel üretim ve ChatGPT QA tamamlandı; Claude entegrasyonu bekleniyor.

Önceki 2-kare Civciv temsili nihai değildir. Seçilen yeni büyük gözlü sarı Civciv tasarımı için kaynak doğrusu artık **ayrı PNG kareleridir**:

- Waiting/endişeli: 8 × 512×512 RGBA PNG, 8 FPS loop.
- Happy: 8 × 512×512 RGBA PNG, 8 FPS loop.
- Pivot: `[256,480]`.
- Render scale: `0.18`.
- Kayıp top: `obj_ball.png`, 512×512 RGBA, statik ve Civciv'den tamamen ayrı.
- Dört köşe alfa: `0`.
- Minimum görünür marj: `8 px`.
- Dama/renkli matte asset içine pişirilmemiştir.

### Hedef repo yapısı

```text
assets/production_v06/friends/civciv_v02/
  waiting/
    friend_civciv_waiting_00.png
    ...
    friend_civciv_waiting_07.png
  happy/
    friend_civciv_happy_00.png
    ...
    friend_civciv_happy_07.png
  manifest.json
  qa_report.json

assets/production_v06/missions/lost_toy/
  obj_ball.png
```

Kare sırası, FPS, SHA256, pivot ve kalite sözleşmesi `assets/production_v06/mission_art_manifest.json` içinde günceldir.

### Claude'un entegrasyon davranışı

- `lost-toy` görevinde `obj_star.png` yer tutucusunu kaldır; kayıp oyuncak yalnız `obj_ball.png` olsun.
- Civciv görev tamamlanmadan 8-kare `waiting` klibini, top bulunduğunda 8-kare `happy` klibini oynatsın.
- Runtime'da eski ve yeni iki Civciv tasarımını birlikte bırakma.
- Ayrı PNG kareleri kaynak doğrusu kabul et; sheet gerekiyorsa bu karelerden deterministik olarak türet.
- Görsel alfa sınırından collider üretme.
- Ayak/taban pivotunu `[256,480]` mekanik noktasıyla kilitle.
- Bu teslim kapsamında Porsuk, Baykuş ve elma bahçesi görsellerini değiştirme.

### Entegrasyon kabul kapısı

1. Masaüstü ve yatay mobil görünümde waiting → happy geçişini doğrula.
2. Civciv'in ayakları hiçbir karede zeminden kaymasın.
3. Top platform üstüne fiziksel olarak otursun; gömülme/havada kalma olmasın.
4. `npm test`, `npm run test:assets`, `npm run test:budget`, `npm run test:visual`, `npm run build:test` tamamı yeşil olsun.
5. Başarılı entegrasyondan sonra `ASSET-REQUESTS.md` içindeki Civciv/Kayıp Top talebini Completed bölümüne taşı ve `claude/v06-integration` dalına commit/push et.
6. `main` ile merge yapma; Cloudflare/CNAME/domain ayarlarına dokunma.

---

## Bölüm 1 V06 ana grafik paketi

Uygulama kaynağı: `assets/production_v06/README_FOR_CLAUDE.md`.

V06 ana sahne için mevcut V05 platform dizisini yamamak yerine `chapter01_layout_v06.json` yerleşimini temel al. En önemli mekanik zincir: **kutuyu plakaya it → plaka çöksün → köprü açılsın → oyuncu gerçek boşluğu geçsin**.

Ana sahne entegrasyonunda birlikte oku:

1. `assets/production_v06/README_FOR_CLAUDE.md`
2. `assets/production_v06/manifest.json`
3. `assets/production_v06/chapter01_layout_v06.json`
4. `assets/production_v06/qa_report.json`

Görsel hedef `assets/production_v06/preview/chapter01_art_direction_v06.png`, şeffaflık QA referansı `assets/production_v06/preview/alpha_qa_v06.jpg` dosyasındadır.
