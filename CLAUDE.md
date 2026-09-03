# Claude Çalışma Talimatı

Bu repository üç bölümlük Çatpat oyununun tek ve güncel çalışma alanıdır. Şu
anda yalnız **Bölüm 1 — Çatpat Gibi Bir Gün** aktiftir.

Kod veya görsel üretmeden önce sırayla şunları oku:

1. `docs/CLAUDE_HANDOFF_V05.md`
2. `assets/production_v05/runtime_asset_manifest.json`
3. ilgili aktif klasördeki `manifest.json` veya `*_manifest.json`
4. `ASSET-REQUESTS.md` — Claude ve ChatGPT arasındaki tek görsel talep ve
   teslimat kaynağı. Yeni bir görsel gerektiğinde talebi buraya ekle;
   ChatGPT'den teslim alınan görseli entegre ettikten sonra talebi
   Completed bölümüne taşı (silme).

Bağlayıcı kurallar:

- Yalnız `animation_v03`, `platforms_v03`, `objects_v03` ve `mechanisms_v04`
  yollarını kullan; eski paketlere geri dönme.
- Asansörde sarmaşık, halat veya makara kullanma. Asansör şeffaf taş platformdur.
- Görsel dosyası gerçek RGBA olmalı; köşe alfa değeri 0 ve görünür içerik her
  kenardan en az 8 px uzakta olmalı. Dama desenini görsele pişirme.
- Sprite alfa sınırından collider üretme. Görsel pivot, collider ve yürünebilir
  yüzey aynı mekanik pivotu paylaşmalı.
- Kutu ve mantarın mevcut görünür durum animasyonlarını koru. Bunlar temiz tek
  PNG üzerinde pivot-kilitli çalışma zamanı hareketidir; ayrı resim kareleri
  üretilecekse ancak alfa/marj doğrulamasını geçen eksiksiz setle değiştir.
- Bölüm 2–3 için Bölüm 1 görsellerini final diye çoğaltma. Her bölüm yeni
  manifest ve görsel QA onayını bekler.
- `dist/`, QA renderları ve geçici üretim dosyalarını commit etme.
- Değişiklikten sonra `npm test`, `npm run test:assets`, `npm run test:budget`,
  `npm run test:visual` ve `npm run build:test` komutlarının tamamını çalıştır.
- Platform boşluğu, havada kalma, görsel/collider ayrışması veya eksik zorunlu
  animasyon varken bölüm tamamlanmış sayılmaz.
