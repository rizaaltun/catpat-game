# Claude Çalışma Talimatı

Bu repository dört bölümlük Çatpat oyununun ortak çalışma alanıdır. Şu anda
yalnız **Bölüm 1 — Çatpat Gibi Bir Gün** aktiftir.

Kod yazmadan önce sırayla şunları oku:

1. `docs/ASSET_PRODUCTION_AUDIT_V04.md`
2. `docs/CLAUDE_ASSET_INTEGRATION_V04.md`
3. `docs/CHAPTER_VISUAL_ROADMAP_V04.md`
4. `assets/production_v04/asset_production_manifest.json`

Bağlayıcı kurallar:

- `assets/environments/forest/terrain_v04/` reddedilmiş kaynaktır; kullanma.
- Sprite alfa sınırından collider üretme.
- Mantar, kasa, düğme, asansör, salıncak ve kapı durum makinelerini entegrasyon
  sözleşmesindeki sırayla uygula.
- Eksik V04 asset için eski V01/V02 assete sessiz fallback yapma; geliştirme
  hatası göster.
- Bölüm 2–4 için nihai görselleri uydurma veya Bölüm 1 assetlerini final diye
  çoğaltma. Her bölüm yeni manifest ve görsel QA onayını bekler.
- `dist/`, QA renderları ve geçici üretim dosyalarını commit etme.
- Bölüm 1; platform boşluğu, havada kalma, hatalı temas veya eksik P0 animasyon
  varken tamamlanmış sayılmaz.

