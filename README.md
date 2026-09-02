# Çatpat: Nezaket Ormanı

Mobil yatay ekran için, modüler JavaScript ve Canvas 2D ile geliştirilen 2D
platform oyunu.

**Aktif build:** `CH1-V05-15200` — üç bölümlük projenin 15.200 px uzunluğundaki
oynanabilir Bölüm 1 sürümü. Ana menüde aynı build kimliği görünmüyorsa eski
dosya veya tarayıcı önbelleği açılmıştır.

Şu anda yalnız **Bölüm 1 — Çatpat Gibi Bir Gün** aktiftir. Claude geliştirmeye
başlamadan önce kökteki `CLAUDE.md` dosyasını okumalıdır.

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
npm run build:test
```

F2 ile açılan debug görünümünde kırmızı çizgiler gerçek yürünebilir platform
yüzeylerini, cyan kutu sabit oyuncu collider'ını ve sarı artı ayak pivotunu
gösterir. Normal oyunda bu çizgiler görünmez.

Otomatik test paketi; 44 platformu, 73 yürünebilir yüzeyi, ana rotayı, mantarla
yüksek rota erişimini, koşma/odaklanma anlatı dallarını, tabela onarımını,
biletleri, checkpoint'i, sandık-köprü mekanizmasını, taş asansörü, hareketli
bulut taşımasını ve çoklu dokunmatik girdiyi doğrular. Görsel QA; gerçek oyun
çiziminden sahne, bütün dünya, collider ve animasyon-durumu çıktıları üretir;
1280×720 çizim süresinin 95. yüzdelik değerini 16,67 ms sınırında denetler.

İlk oynanabilir dikey dilim **Bölüm 1 — Çatpat Gibi Bir Gün**'dür. Üç şenlik
bileti, aceleyle dönebilen ama cezasız biçimde onarılabilen tabela, çamur,
nefes alan/zıplamaya tepki veren mantar, hareketli bulut, sarmaşıksız taş
asansör, checkpoint feneri ve itilirken sallanan sandıkla yükselen köprü içerir.
Gizli anlatı durumu bir “iyi/kötü” puanı göstermez; oyuncunun dikkat veya onarım
seçimini yalnız çevresel tepki ve kapanış cümlesiyle yansıtır. Bölüm 2 — Dal
Dal Üstüne ve Bölüm 3 — Pıtpıt'ın Papatyaları ayrı görsel manifestler ve QA
kapılarıyla sırayla üretilecektir. Menü tasarımı ayrı üretim aşamasıdır.

## Kontroller

- Hareket: A/D veya yön tuşları
- Zıplama: Space / W / yukarı
- Odaklı adım: Shift
- Etkileşim: E
- Duraklatma: Escape
- Debug collider görünümü: F2
