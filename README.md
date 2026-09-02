# Çatpat: Nezaket Ormanı

Mobil yatay ekran için, modüler JavaScript ve Canvas 2D ile geliştirilen 2D platform oyunu.

**Aktif build:** `CH1-V04.1-15200` — dört bölümlük yapı, 15.200 px uzunluğunda
oynanabilir Bölüm 1. Ana menüde aynı build kimliği görünmüyorsa eski dosya veya
tarayıcı önbelleği açılmıştır.

Proje dört bölüm olarak sırayla geliştirilecektir. Şu anda yalnız **Bölüm 1 —
Çatpat Gibi Bir Gün** aktiftir. Claude geliştirmeye başlamadan önce kökteki
`CLAUDE.md` dosyasını okumalıdır.

## Çalıştırma

Bu klasörde bir statik sunucu açın:

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın. Güncelleme sonrasında eski
sürüm görünürse sayfayı bir kez zorla yenileyin (`Cmd+Shift+R` /
`Ctrl+Shift+R`).

## Doğrulama

```bash
npm test
npm run test:assets
npm run test:budget
npm run test:visual
python3 tools/validate_production_assets_v04.py --spec-only
```

F2 ile açılan debug görünümünde kırmızı çizgiler gerçek yürünebilir platform
yüzeylerini, cyan kutu sabit oyuncu collider'ını ve sarı artı ayak pivotunu
gösterir. Normal oyunda bu çizgiler görünmez.

Otomatik test paketi; 29 yürünebilir yüzeyi, ana rotadaki 12 sıçramayı,
mantarla yüksek rota erişimini, koşma/odaklanma anlatı dallarını, tabela
onarımını, biletleri, checkpoint'i, sandık-köprü mekanizmasını, hareketli bulut
taşımasını ve çoklu dokunmatik girdiyi doğrular. Görsel QA komutu üretim
varlıklarından dört bölüm kompozisyonu oluşturur.

İlk oynanabilir dikey dilim **Bölüm 1 — Çatpat Gibi Bir Gün**'dür. Üç şenlik
bileti, aceleyle dönebilen ama cezasız biçimde onarılabilen tabela, çamur,
mantar, hareketli bulut, checkpoint feneri ve sandıkla yükselen köprü içerir.
Gizli anlatı durumu bir “iyi/kötü” puanı göstermez; oyuncunun dikkat veya onarım
seçimini yalnız çevresel tepki ve kapanış cümlesiyle yansıtır. Bölüm 2 — Dal
Dal Üstüne, Bölüm 3 — Pıtpıt'ın Papatyaları ve Bölüm 4 — Orman Marketi ayrı
görsel manifestler ve QA kapılarıyla sırayla üretilecektir. Menü tasarımı ayrı
üretim aşamasıdır.

## Kontroller

- Hareket: A/D veya yön tuşları
- Zıplama: Space / W / yukarı
- Odaklı adım: Shift
- Etkileşim: E
- Duraklatma: Escape
- Debug collider görünümü: F2
