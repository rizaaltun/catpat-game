# Claude Çalışma Talimatı

Bu repository üç bölümlük Çatpat oyununun tek ve güncel çalışma alanıdır. Şu anda yalnız **Bölüm 1 — Çatpat Gibi Bir Gün** aktiftir.

## Claude ↔ ChatGPT iletişim sözleşmesi

Kullanıcı sohbetler arasında prompt, ekran görüntüsü veya dosya listesi taşımak zorunda değildir. İki taraf da güncel GitHub dalındaki aşağıdaki dosyaları okuyarak sırayla çalışır.

1. `ASSET-REQUESTS.md` — **Claude → ChatGPT** yeni görsel talepleri ve öncelikleri.
2. `docs/CLAUDE_HANDOFF_V06_ART.md` — **ChatGPT → Claude** tamamlanan görsel teslimleri ve entegrasyon devir notları.
3. `assets/production_v06/README_FOR_CLAUDE.md` ve gerektiğinde `assets/production_v06/README_FOR_CLAUDE_MISSION_ART.md` — görsel entegrasyon davranışı.
4. İlgili `manifest.json` / `*_manifest.json` — dosya yolu, kare sayısı, FPS, pivot, renderScale ve teknik kalite sözleşmesi.
5. Eski V05 handoff/manifestleri yalnız tarihsel fizik/runtime referansı gerektiğinde okunur; V06 görsel teslimleriyle çelişirse V06 sözleşmesi üstündür.

### Devir akışı

- Claude yeni bir görsel gerektiğinde `ASSET-REQUESTS.md` altında talep açar veya mevcut talebi günceller.
- ChatGPT talebi üretip QA yaptıktan sonra teslim notunu `docs/CLAUDE_HANDOFF_V06_ART.md` içine yazar; entegrasyon açıklamasını ilgili V06 README'ye, teknik bilgiyi manifeste işler.
- Claude yalnız GitHub'daki bu güncel kaynakları okuyarak entegrasyonu yapar.
- Entegrasyon + bütün testler başarıyla tamamlandıktan sonra Claude ilgili talebi `ASSET-REQUESTS.md` içinde Completed bölümüne taşır; talep silinmez.
- Kullanıcı yalnız taraflara “repoyu kontrol et” / “sıra sende” diyerek kontrol devredebilir.

## Bağlayıcı teknik kurallar

- Aktif runtime yollarında eski paketlere fallback ekleme. Onaylı sürüm/manifest yolunu kullan.
- Asansörde sarmaşık, halat veya makara kullanma. Asansör temiz, okunabilir taş platform mekaniğidir.
- Görsel dosyası gerçek RGBA olmalı; köşe alfa değeri 0 ve görünür içerik istenen marjı sağlamalı. Dama desenini görsele pişirme.
- Sprite alfa sınırından collider üretme. Görsel pivot, collider ve yürünebilir yüzey aynı mekanik pivotu paylaşmalı.
- Ayrı sprite kareleri üretilecekse kare seti eksiksiz olmalı; her kare alfa/marj/pivot QA'sını geçmeden eski temiz asset runtime'dan kaldırılmamalı.
- Bölüm 2–3 için Bölüm 1 görsellerini final diye çoğaltma. Her bölüm yeni manifest ve görsel QA onayını bekler.
- `dist/`, geçici üretim dosyaları ve gereksiz QA renderlarını commit etme.
- Değişiklikten sonra `npm test`, `npm run test:assets`, `npm run test:budget`, `npm run test:visual` ve `npm run build:test` komutlarının tamamını çalıştır.
- Platform boşluğu, havada kalma, görsel/collider ayrışması veya eksik zorunlu animasyon varken bölüm tamamlanmış sayılmaz.
- `main` ile merge ve Cloudflare/CNAME/domain değişiklikleri kullanıcı görsel/oynanış onayı olmadan yapılmaz.
