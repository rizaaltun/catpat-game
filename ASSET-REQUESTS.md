# Asset Talepleri — Çatpat: Nezaket Ormanı

Bu dosya **Claude → ChatGPT görsel talep kanalıdır**. Kullanıcı sohbetler arasında prompt veya ekran görüntüsü taşımak zorunda değildir.

## İletişim akışı

1. Claude, oyunda ihtiyaç duyduğu her yeni görseli **Bekleyen Talepler** altına asset adı, sahne, stil, ölçü/format, şeffaflık, kare sayısı/animasyon, teknik sınır ve öncelikle birlikte ekler.
2. ChatGPT, talebi GitHub'daki güncel V06 görsel sözleşmelerine ve kitap referansına göre üretir ve QA yapar.
3. ChatGPT → Claude teslim/devir notu `docs/CLAUDE_HANDOFF_V06_ART.md` içine yazılır.
4. Entegrasyon davranışı `assets/production_v06/README_FOR_CLAUDE.md` ve/veya `README_FOR_CLAUDE_MISSION_ART.md` içine; teknik path/FPS/pivot/kare bilgileri ilgili manifest dosyasına yazılır.
5. Claude entegrasyonu yapar, RGBA/boyut/şeffaflık/pivot doğrulamasını ve tam test paketini çalıştırır; başarılıysa talebi **Tamamlanan Talepler** bölümüne taşır. Talepler silinmez.

Referans kabul kapısı: köşe alfa 0, görünür içerik istenen kenar marjı içinde, dama/matte pişirilmemiş, collider alfa sınırından üretilmemiş, pivot ve mekanik geometri açık tanımlı olmalıdır.

---

## Bekleyen Talepler

### 1. Civciv — Kayıp Top / Oyuncak

- **Asset adı:** `obj_ball.png` (eski talep adı: `civciv_lost_ball.png`)
- **Kullanılacağı sahne:** `lost-toy` görevi (`src/game/Mission.js` → `MISSIONS['lost-toy'].objectConfigs`). Civciv'in boşluğun ucuna yuvarlanan kayıp topu.
- **Görsel stil:** Seçilen yeni büyük gözlü sarı Civciv tasarımıyla aynı gouache/kesik-kâğıt görsel dili; yumuşak hatlı, renkli, yıldız detaylı çocuk oyuncağı.
- **Boyut ve format:** 512×512 px, RGBA PNG.
- **Şeffaf arka plan:** Evet — dört köşede alfa = 0.
- **Sprite mi:** Top statik; Civciv karakter güncellemesi bu taleple birlikte teslim edildi.
- **Teknik sınırlar:** Görünür içerik her kenardan ≥8px içeride; dama/matte yok; top karakterden bağımsız.
- **Öncelik:** Yüksek — runtime'daki `obj_star.png` yer tutucusu kaldırılmalı.
- **Teslim durumu:** ChatGPT görsel üretimi ve QA tamamlandı. Yeni Civciv için 8 kare `waiting` + 8 kare `happy`, 8 FPS, 512×512 RGBA, pivot `[256,480]`, renderScale `0.18`; ayrı `obj_ball.png` 512×512 RGBA hazırlandı. Entegrasyon deviri ve teknik ayrıntılar **yalnız** şu kanonik dosyalarda tutulur:
  - `docs/CLAUDE_HANDOFF_V06_ART.md`
  - `assets/production_v06/README_FOR_CLAUDE_MISSION_ART.md`
  - `assets/production_v06/mission_art_manifest.json`
  **Talep henüz Completed değildir; Claude entegrasyon + testten sonra taşımalıdır.**

### 2. Gece Gökyüzü Katmanı (Baykuş — dark-lanterns)

- **Asset adı:** `night_moon_stars_overlay.png`
- **Kullanılacağı sahne:** `dark-lanterns` görevinin arka planı, gökyüzü bölgesi. Şu an sadece kod ile koyu yarı saydam bir renk katmanı (`rgba(18,24,54,0.5)`) uygulanıyor; gerçek bir ay/yıldız katmanı sahneyi zenginleştirir.
- **Görsel stil:** Sıcak sarı ay, birkaç yumuşak parıltılı yıldız, kitabın gouache dokusu.
- **Boyut ve format:** 1280×720 px, RGBA PNG.
- **Şeffaf arka plan:** Evet — gökyüzü dışındaki alanlar şeffaf kalmalı.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** Tam ekran katman; şeffaf alan net olmalı.
- **Öncelik:** Orta.

### 3. Baykuş'un Yuvası (opsiyonel dekor)

- **Asset adı:** `owl_nest_home.png`
- **Kullanılacağı sahne:** `dark-lanterns` görevinin bitiş platformu, Baykuş'un yanında arka plan dekoru.
- **Görsel stil:** Sıcak, davetkâr bir ağaç kovuğu/yuva; mevcut `decor_tree.png` / `decor_bush.png` ile aynı görsel dil.
- **Boyut ve format:** 512×512 px, RGBA PNG.
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** Pivot alt-orta noktada (yaklaşık 256, taban), zeminle hizalanacak şekilde.
- **Öncelik:** Düşük.

### 4. Yardım Anı Kutlama Efekti

- **Asset adı:** `kindness_sparkle_sheet.png`
- **Kullanılacağı sahne:** Bir dosta yardım tamamlandığında (`src/game/Mission.js` → `MissionRuntime.finish()`), karakterin üstünde kısa bir parıltı/kalp efekti.
- **Görsel stil:** Küçük sıcak sarı/pembe parıltı taneleri veya kalp şekli, kitabın renk paletine uygun.
- **Boyut ve format:** Her kare 256×256 px, 4–6 karelik yatay sprite sheet, RGBA PNG.
- **Şeffaf arka plan:** Evet.
- **Sprite ise kare sayısı / hareket / yön:** 4–6 kare, tek seferlik "genişleyip kaybolma" animasyonu, loop yok, yönsüz/simetrik.
- **Teknik sınırlar:** Her kare kenar boşluğu ≥12px, pivot merkezde.
- **Öncelik:** Düşük.

### 5. Şenlik Finalinde Küçük Ormancı Figüranları

- **Asset adı:** `festival_guest_tavsan.png`, `festival_guest_kirpi.png`, `festival_guest_sincap.png`
- **Kullanılacağı sahne:** Bölüm 1 finali, festival çadırı alanı.
- **Görsel stil:** Porsuk/Baykuş/Civciv ile aynı görsel dil; farklı tür/renk; aksesuarsız.
- **Boyut ve format:** 512×512 px RGBA PNG (her biri).
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır, tek duruş yeterli.
- **Teknik sınırlar:** Pivot yaklaşık `[256,480]`.
- **Öncelik:** Düşük.

### 6. Etkileşim / Nezaket İkonları (UI)

- **Asset adı:** `interact_prompt_icon.png`, `kindness_heart_icon.png`
- **Kullanılacağı sahne:** HUD — etkileşim ipucu kutusu ve "dosta yardım edildi" göstergesi.
- **Görsel stil:** Basit, düz renkli, kitap temasına uygun küçük ikonlar.
- **Boyut ve format:** 128×128 px RGBA PNG.
- **Şeffaf arka plan:** Evet.
- **Sprite mi:** Hayır.
- **Teknik sınırlar:** HUD içinde ~24–32px gösterildiğinde okunaklı olmalı.
- **Öncelik:** Düşük.

---

## Tamamlanan Talepler

### Dost Karakterleri — Porsuk, Baykuş, Civciv (eski 2-kare V01 teslimi)

- **Teslim:** `catpat-v06-mission-art-1.zip` (ChatGPT, 03.09.2026)
- **Dosyalar:** `friend_porsuk_sheet.png`, `friend_baykus_sheet.png`, `friend_civciv_sheet.png` — 1024×512 px, 2 kare (waiting / happy), pivot `[256,480]`, renderScale `0.18`.
- **Entegre edildi:** `assets/gameplay/forest/friends_v01/` (commit `f7beef2`).
- **Not:** Civciv V01 görseli daha sonra yeni 8-kare Civciv V02 tasarımıyla değiştirilmek üzere açık talep #1 kapsamında supersede edilmiştir; Porsuk ve Baykuş bu kayıt kapsamında geçerlidir.

### Elma Bahçesi Görev Objeleri

- **Teslim:** `catpat-v06-mission-art-1.zip`.
- **Dosyalar:** `seed.png`, `soil_patch.png`, `basket_empty.png`, `tree_growth_sheet.png` (4 aşama: sprout → sapling → leafy → apples, 2048×512 px sheet).
- **Entegre edildi:** `assets/gameplay/forest/mission_props_v01/` (commit `f7beef2`).
- **Not:** Son ağaç karesinde tam 5 elma bulunur; ayrıca prosedürel elma çizilmez.
- **Doğrulama:** sha256 + RGBA/boyut kontrolü ve tam test paketi yeşil.
