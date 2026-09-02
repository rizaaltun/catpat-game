# Catpat Bölüm 1 — V06 görsel uygulama notu

Bu klasör yalnızca onaylanmış grafik paketi ve yerleşim tarifidir. Mevcut V05 platform dizilimini düzeltmeye çalışma; Bölüm 1 sahnesini `chapter01_layout_v06.json` esas alınarak yeniden kur. Oyun mantığı ve entegrasyon Claude tarafından yapılacak.

## Öncelik sırası

1. Dünya uzunluğu 15.200 px olarak kalsın; statik ana platform sayısını yaklaşık 18’e indir.
2. Normal sıçramalarda 150–210 px, mekanik gerektiren geçişlerde 320–420 px açık boşluk bırak.
3. Boşlukları kaya, çalı, görünmez yüzey veya platform parçasıyla kapatma.
4. Her kamera görünümünde tek ana fikir kullan: sıçrama, asansör, düğme-kapı, salıncak, kutu-köprü veya mantar.
5. Kutu yalnızca basınç plakasına itilerek köprüyü açtığı bölümde bulunsun. Kutu, plaka ve kapalı köprü aynı görüş alanında okunabilsin.
6. Mantarı karakterin yaklaşık yarı boyunda göster ve yalnızca isteğe bağlı üst rotadaki bilete ulaşmak için kullan.
7. Taş asansörde sarmaşık, ip, makara veya kesilmiş bağlantı çizgisi kullanma.
8. Salıncak görselini bütün halde kullan; üst kiriş ve iki ipin hiçbirini kırpma.

## Kullanılacak dosyalar

- Kutu animasyonu: `sprites/crate_push_sheet.png` — 6 × 512 px hücre, pivot `(256, 430)`
- Mantar animasyonu: `sprites/mushroom_bounce_sheet.png` — 6 × 512 px hücre, pivot `(256, 470)`
- Kutu plakası: `mechanisms/crate_pressure_plate.png`
- Tam salıncak: `mechanisms/swing_platform_complete.png`
- Köprü: `platforms/platform_bridge.png`
- Karakter: mevcut `assets/characters/catpat/animation_v03/` içindeki 14 karelik set
- Ölçekler, kare sıraları ve kalite kuralları: `manifest.json`
- Bölüm ritmi ve mekanik sırası: `chapter01_layout_v06.json`

## Fizik ve görsel eşleşme

- Her platform collider’ı yalnızca görünen çim üst çizgisini takip etmeli.
- Dekorasyonların collider’ı olmamalı.
- Mantarın tetik alanı şapkasının üst yüzeyinde, kutunun collider’ı görünen ahşap gövdede olmalı.
- Kutu plakanın üstüne tamamen geldiğinde plaka 12 px çökmeli ve köprü hareketi başlamalı.
- Mekanik gerektiren boşluklar normal zıplamayla aşılamamalı; bu mesafeyi mevcut hareket değerleriyle ölçerek doğrula.

## Kabul kontrolü

- Bölüm F2/collider görünümünde baştan sona yürütülür; görünür yüzey ile fizik yüzeyi arasında sapma bulunmaz.
- Üç farklı kamera genişliğinde hiçbir asset kırpılmaz veya komşu sprite parçası göstermez.
- Renkli zemin üstünde `preview/alpha_qa_v06.jpg` ile tüm sprite kenarları kontrol edilir.
- `qa_report.json` sonucu `PASS` olmalıdır.
- Eski V05 dizilimindeki kaya dolguları, büyük mantar ve kesik sarmaşık yeni sahneye taşınmaz.

Referans kompozisyon: `preview/chapter01_art_direction_v06.png`.
