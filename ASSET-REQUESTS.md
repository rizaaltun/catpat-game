# Asset Talepleri — Çatpat: Nezaket Ormanı

Bu dosya, bu repo üzerinde sırayla çalışan Claude ve ChatGPT arasındaki
**tek görsel talep ve teslimat kaynağıdır**. Ekran görüntüsü veya sohbet
üzerinden devir beklenmez — proje durumu ve talepler burada güncel tutulur.

## Nasıl çalışır

1. Claude (kod tarafı), oyunda ihtiyaç duyduğu her görseli **Bekleyen
   Talepler** altına, aşağıdaki şablonla ekler.
2. ChatGPT, üretilen dosyaları bu repoya push eder (veya kullanıcı üzerinden
   repoya aktarılır) ve teslimat notunu (dosya adı, konum, varsa manifest)
   ilgili talebin altına yazar.
3. Claude teslim edilen görseli entegre eder: RGBA/boyut/şeffaflık
   doğrulaması yapar (`tools/validate_assets_v05.py` deseniyle), oyuna
   bağlar, `npm test` + `npm run test:assets` + `npm run test:budget` +
   `npm run test:visual` + `npm run build:test` çalıştırır, sonra talebi
   **Tamamlanan Talepler** bölümüne taşır (silmez) ve commit/push eder.
4. Talepler asla silinmez, sadece bölüm değiştirir. Öncelik durumu
   değişirse talep güncellenir.

Referans: onaylı asset kuralları için `CLAUDE.md` ve
`assets/production_v06/README_FOR_CLAUDE.md` — köşe alfa 0, görünür içerik
her kenardan ≥8px içeride, dama deseni pişirilmemiş, pivot/collider aynı
mekanik noktayı paylaşmalı.

---

## Bekleyen Talepler

### 1. Civciv — Kayıp Top / Oyuncak

- **Asset adı:** `civciv_lost_ball.png`
- **Kullanılacağı sahne:** `lost-toy` görevi (`src/game/Mission.js` →
  `MISSIONS['lost-toy'].objectConfigs`). Civciv'in boşluğun ucuna
  yuvarlanan kayıp oyuncağı.
- **Görsel stil:** Porsuk/Baykuş/Civciv karakter sayfalarıyla aynı doku
  (gouache/kesik kağıt hissi), yumuşak hatlı küçük bir top/oyuncak —
  Civciv'in yaşına uygun, basit ve sevimli.
- **Boyut ve format:** 512×512 px, RGBA PNG.
- **Şeffaf arka plan:** Evet — dört köşede alfa = 0.
- **Sprite mi:** Hayır, tek kare yeterli (statik obje, toplanınca kayboluyor).
- **Teknik sınırlar:** Görünür içerik her kenardan ≥8px içeride; dama
  deseni/arka plan pişirilmemiş olmalı.
- **Öncelik:** Yüksek — şu an yer tutucu olarak `obj_star.png` (yıldız)
  kullanılıyor, bir top/oyuncak yerine yıldız göstermek hikâyeyle
  uyuşmuyor.

### 2. Gece Gökyüzü Katmanı (Baykuş — dark-lanterns)

- **Asset adı:** `night_moon_stars_overlay.png`
- **Kullanılacağı sahne:** `dark-lanterns` görevinin arka planı, gökyüzü
  bölgesi. Şu an sadece kod ile koyu yarı saydam bir renk katmanı
  (`rgba(18,24,54,0.5)`) uygulanıyor; gerçek bir ay/yıldız katmanı sahneyi
  zenginleştirir.
- **Görsel stil:** Sıcak sarı ay, birkaç yumuşak parıltılı yıldız, kitabın
  gouache dokusu.
- **Boyut ve format:** 1280×720 px (tam ekran katman), RGBA PNG.
- **Şeffaf arka plan:** Evet — gökyüzü dışındaki alanlar şeffaf kalmalı ki
  mevcut orman arka planının üstüne bindirilebilsin.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** Kenar boşluğu şartı yok (tam ekran katman), ama
  şeffaf alan net olmalı.
- **Öncelik:** Orta.

### 3. Baykuş'un Yuvası (opsiyonel dekor)

- **Asset adı:** `owl_nest_home.png`
- **Kullanılacağı sahne:** `dark-lanterns` görevinin bitiş platformu,
  Baykuş'un yanında arka plan dekoru.
- **Görsel stil:** Sıcak, davetkâr bir ağaç kovuğu/yuva; mevcut
  `decor_tree.png` / `decor_bush.png` ile aynı görsel dil.
- **Boyut ve format:** 512×512 px, RGBA PNG.
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** Pivot alt-orta noktada (yaklaşık 256, taban), zeminle
  hizalanacak şekilde.
- **Öncelik:** Düşük.

### 4. Yardım Anı Kutlama Efekti

- **Asset adı:** `kindness_sparkle_sheet.png`
- **Kullanılacağı sahne:** Bir dosta yardım tamamlandığında
  (`src/game/Mission.js` → `MissionRuntime.finish()`), karakterin üstünde
  kısa bir parıltı/kalp efekti.
- **Görsel stil:** Küçük sıcak sarı/pembe parıltı taneleri veya kalp
  şekli, kitabın renk paletine uygun.
- **Boyut ve format:** Her kare 256×256 px, 4–6 karelik yatay sprite
  sheet, RGBA PNG (ör. `crate_push_sheet.png` ile aynı desen: kareler yan
  yana, sabit hücre boyutu).
- **Şeffaf arka plan:** Evet.
- **Sprite ise kare sayısı / hareket / yön:** 4–6 kare, tek seferlik
  "genişleyip kaybolma" animasyonu (loop yok), yönsüz/simetrik.
- **Teknik sınırlar:** Her kare kenar boşluğu ≥12px, pivot merkezde.
- **Öncelik:** Düşük.

### 5. Şenlik Finalinde Küçük Ormancı Figüranları

- **Asset adı:** `festival_guest_tavsan.png`, `festival_guest_kirpi.png`,
  `festival_guest_sincap.png` (3 ayrı dosya)
- **Kullanılacağı sahne:** Bölüm 1 finali, festival çadırı alanı —
  Porsuk/Baykuş/Civciv dışında, arka planda kutlayan küçük orman
  canlıları.
- **Görsel stil:** Porsuk/Baykuş/Civciv ile aynı görsel dil, ama her biri
  farklı tür/renk, aksesuarsız (mevcut "no clothing or accessory" kuralına
  uygun).
- **Boyut ve format:** 512×512 px, RGBA PNG (her biri).
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır, tek duruş yeterli.
- **Teknik sınırlar:** Aynı pivot kuralı (yaklaşık 256,480 — ayak tabanı).
- **Öncelik:** Düşük.

### 6. Etkileşim / Nezaket İkonları (UI)

- **Asset adı:** `interact_prompt_icon.png`, `kindness_heart_icon.png`
- **Kullanılacağı sahne:** HUD — etkileşim ipucu kutusu ve "dosta yardım
  edildi" göstergesi.
- **Görsel stil:** Basit, düz renkli, kitap temasına uygun küçük ikonlar.
- **Boyut ve format:** 128×128 px, RGBA PNG.
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** Küçük boyutta (HUD içinde ~24–32px gösterilecek)
  okunaklı, basit siluet.
- **Öncelik:** Düşük.

---

## Tamamlanan Talepler

### Dost Karakterleri — Porsuk, Baykuş, Civciv

- **Teslim:** `catpat-v06-mission-art-1.zip` (ChatGPT, 03.09.2026)
- **Dosyalar:** `friend_porsuk_sheet.png`, `friend_baykus_sheet.png`,
  `friend_civciv_sheet.png` — 1024×512 px, 2 kare (waiting / happy),
  pivot [256,480], renderScale 0.18.
- **Entegre edildi:** `assets/gameplay/forest/friends_v01/`
  (commit `f7beef2`). `Game.js` → `drawFriend()` artık gerçek sprite'ları
  frame 0/1 arasında geçiş yaparak çiziyor; pivot-kilitli hafif nefes
  animasyonu eklendi.
- **Doğrulama:** sha256 karşılaştırması + RGBA/köşe alfa/boyut kontrolü
  entegrasyon öncesi yapıldı; `npm test` + `test:assets` + `test:budget` +
  `test:visual` + `build:test` yeşil.

### Elma Bahçesi Görev Objeleri

- **Teslim:** aynı paket (`catpat-v06-mission-art-1.zip`).
- **Dosyalar:** `seed.png`, `soil_patch.png`, `basket_empty.png`,
  `tree_growth_sheet.png` (4 aşama: sprout → sapling → leafy → apples,
  2048×512 px sheet).
- **Entegre edildi:** `assets/gameplay/forest/mission_props_v01/`
  (commit `f7beef2`). `Game.js` → `drawMissionExtras()` artık gerçek
  tohum/toprak/sepet görsellerini ve büyüme aşamalarını kullanıyor.
- **Not:** `tree_stage_4_apples.png` üzerine ayrıca elma çizilmiyor —
  görseldeki 5 elmanın piksel merkezleri kırmızı-blob tespitiyle bulundu
  ve toplama tetikleyicileri (`props.appleOffsets`) o konumlara göre
  otomatik hesaplandı.
- **Doğrulama:** sha256 + RGBA/boyut kontrolü, ardından tam test paketi
  yeşil.
