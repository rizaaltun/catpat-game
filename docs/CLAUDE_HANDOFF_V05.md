# Çatpat V05 — Claude Devir Notu

## Yetkili durum

- Proje toplam üç bölüm olarak planlandı.
- Yalnız Bölüm 1 oynanabilir; dünya uzunluğu 15.200 px.
- Kaynak kodu `main` dalındaki `CH1-V05-15200` build kimliğiyle doğrula.
- Eski V02/V03 çalışma yolları ile V04 üretim paketi kaldırıldı.

## Bölüm 1 görsel ve fizik sözleşmesi

- Karakter 14 gerçek PNG karesi kullanır: idle, sekiz koşu, zıplama başlangıcı,
  havada, düşüş, iniş ve kutlama. Ayak pivotu çizim ve collider için ortaktır.
- Mantar nefes alma, sıkışma, bırakma ve toparlanma durumlarına sahiptir.
- Kutu itilirken sallanır; bırakıldığında pivotu kaymadan yerine oturur.
- Taş asansörde sarmaşık, ip, halat ve makara yoktur.
- Sallanan platform görseli ile yürünebilir yüzeyi aynı üst pivottan döner.
- Oyuncu teması önce merkez ayak noktasını, yalnız merkezde yüzey yoksa iki dar
  yan ayak örneğini kullanır. Bu, küçük görsel ek yerlerini geçerken rampalarda
  havada kalmayı engeller.

Kutu ve mantarın mevcut animasyonları pivot-kilitli çalışma zamanı
dönüşümleridir. Çok kareli resim setine geçilecekse bütün durumlar birlikte
üretilmeli; her kare `validate_assets_v05.py` ile aynı alfa, marj ve pivot
kurallarını geçmeden eski temiz dosya silinmemelidir.

## Yeni asset kabul kapısı

1. PNG gerçek RGBA olmalı ve dört köşede alfa 0 olmalı.
2. Alfa eşiği 8 üstündeki görünür içerik her kenardan en az 8 px içeride olmalı.
3. Dama deseni veya tek renk fon görüntünün içine pişmiş olmamalı.
4. Nesne hiçbir kenardan kesilmemeli; gölge de tuval içinde kalmalı.
5. Pivot ve mekanik geometri manifestte elle tanımlanmalı.
6. Görsel QA çıktısında normal, hareketli ve temas hâlleri birlikte incelenmeli.

## Sonraki üretim sırası

1. Bölüm 1 için istenirse kutu ve mantarı gerçek çok kareli setlere yükselt.
2. Aynı doğrulama kapısını koruyarak Bölüm 2 görsel manifestini oluştur.
3. Bölüm 2 oynanışını ve fizik testlerini tamamladıktan sonra Bölüm 3'e geç.

Eski asset yoluna fallback ekleme; eksik asset geliştirme hatasıdır.
