# Catpat Bölüm 1 — V06 görsel uygulama notu

Bu klasör onaylanmış V06 grafik paketi ve yerleşim tarifidir. Mevcut V05 platform dizilimini düzeltmeye çalışma; Bölüm 1 sahnesini `chapter01_layout_v06.json` esas alınarak yeniden kur. Oyun mantığı ve entegrasyon Claude tarafından yapılacak.

## Claude ↔ ChatGPT dosya akışı

- Claude → ChatGPT yeni görsel talepleri: `/ASSET-REQUESTS.md`
- ChatGPT → Claude teslim/devir notları: `/docs/CLAUDE_HANDOFF_V06_ART.md`
- Görev görsel entegrasyonu: `README_FOR_CLAUDE_MISSION_ART.md`
- Ana V06 teknik paket: `manifest.json`, `mission_art_manifest.json`, ilgili alt manifestler
- Kök bağlayıcı kurallar: `/CLAUDE.md`

Kullanıcının sohbetler arasında prompt veya asset listesi taşıması gerekmez. Claude entegrasyona başlamadan önce bu GitHub kaynaklarının güncel hâlini okumalıdır.

## Öncelik sırası

1. Dünya uzunluğu 15.200 px olarak kalsın; statik ana platform sayısını yaklaşık 18’e indir.
2. Normal sıçramalarda 150–210 px, mekanik gerektiren geçişlerde 320–420 px açık boşluk bırak.
3. Boşlukları kaya, çalı, görünmez yüzey veya platform parçasıyla kapatma.
4. Her kamera görünümünde tek ana fikir kullan: sıçrama, asansör, düğme-kapı, salıncak, kutu-köprü veya mantar.
5. Kutu yalnızca basınç plakasına itilerek köprüyü açtığı bölümde bulunsun. Kutu, plaka ve kapalı köprü aynı görüş alanında okunabilsin.
6. Mantarı karakterin yaklaşık yarı boyunda göster ve yalnızca isteğe bağlı üst rotadaki bilete ulaşmak için kullan.
7. Taş asansörde sarmaşık, ip, makara veya kesilmiş bağlantı çizgisi kullanma.
8. Salıncak görselini bütün halde kullan; üst kiriş ve iki ipin hiçbirini kırpma.

## Kullanılacak ana dosyalar

- Kutu animasyonu: `sprites/crate_push_sheet.png` — 6 × 512 px hücre, pivot `(256, 430)`
- Mantar animasyonu: `sprites/mushroom_bounce_sheet.png` — 6 × 512 px hücre, pivot `(256, 470)`
- Kutu plakası: `mechanisms/crate_pressure_plate.png`
- Tam salıncak: `mechanisms/swing_platform_complete.png`
- Köprü: `platforms/platform_bridge.png`
- Ana karakter: mevcut `assets/characters/catpat/animation_v03/` seti
- Arkadaşlar ve görev artı: `README_FOR_CLAUDE_MISSION_ART.md` + `mission_art_manifest.json`
- Ölçekler, kare sıraları ve kalite kuralları: ilgili manifestler
- Bölüm ritmi ve mekanik sırası: `chapter01_layout_v06.json`

## Fizik ve görsel eşleşme

- Her platform collider’ı yalnızca görünen çim üst çizgisini takip etmeli.
- Dekorasyonların collider’ı olmamalı.
- Mantarın tetik alanı şapkasının üst yüzeyinde, kutunun collider’ı görünen ahşap gövdede olmalı.
- Kutu plakanın üstüne tamamen geldiğinde plaka 12 px çökmeli ve köprü hareketi başlamalı.
- Mekanik gerektiren boşluklar normal zıplamayla aşılamamalı; bu mesafeyi mevcut hareket değerleriyle ölçerek doğrula.
- Sprite collider'ı alfa sınırından türetilmez; manifestteki mekanik pivot ve collider tanımı kullanılır.

## Kabul kontrolü

- Bölüm F2/collider görünümünde baştan sona yürütülür; görünür yüzey ile fizik yüzeyi arasında sapma bulunmaz.
- Üç farklı kamera genişliğinde hiçbir asset kırpılmaz veya komşu sprite parçası göstermez.
- Renkli zemin üstünde `preview/alpha_qa_v06.jpg` ile sprite kenarları kontrol edilir.
- İlgili QA raporları `PASS` olmalıdır.
- Eski V05 dizilimindeki kaya dolguları, büyük mantar ve kesik sarmaşık yeni sahneye taşınmaz.
- Görev görsellerinde `README_FOR_CLAUDE_MISSION_ART.md` kabul maddeleri ayrıca uygulanır.

Referans kompozisyon: `preview/chapter01_art_direction_v06.png`.

`main` ile merge ve Cloudflare/CNAME/domain değişiklikleri görsel + oynanış onayı alınmadan yapılmaz.
