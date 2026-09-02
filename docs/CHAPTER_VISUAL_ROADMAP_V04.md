# Çatpat — Dört Bölümlük Görsel Üretim Yol Haritası V04

Bu plan sıralıdır. Claude yalnız aktif bölümün kodunu ve entegrasyonunu yapar;
sonraki bölümün nihai görsellerini tahmin ederek üretmez veya Bölüm 1
assetlerini geçici final olarak çoğaltmaz.

## Bölüm 1 — Çatpat Gibi Bir Gün

Durum: Aktif entegrasyon bölümü.

- Orman patikası, mantar, çamur, bulut, kasa, düğme, kapı, fener ve biletler.
- V04 üretim manifestindeki kesiksiz kadraj, gerçek alfa, pivot ve collider
  sözleşmesi uygulanır.
- Tek karelik mantar, kasa, düğme ve çevre nesneleri final sayılmaz.
- Bölüm; kesik platform, havada kalan karakter, görünmez boşluk veya alfa
  tabanlı collider içerirse sonraki bölüme geçilmez.

## Bölüm 2 — Dal Dal Üstüne

Durum: Bölüm 1 görsel/fizik kabulünden sonra üretilecek.

- Ayrı Maymun ve Porsuk model/animasyon paketleri.
- Tam görünen dal platformları; doğal uçları tuval içinde kalır.
- Gerçek bağlantılı ipler, salıncak ve sarmaşık asansörü.
- Salınan gövde ile sabit destek ayrı sprite olur; aynı pivot fiziği paylaşır.
- Makara kullanılırsa ip makaradan platforma kesintisiz devam eder. İşlevsiz
  makara dekoru kullanılmaz.
- Arka plan en az üç parallax katmanı taşır; Bölüm 1'in renk değiştirilmiş
  kopyası olmaz.

## Bölüm 3 — Pıtpıt'ın Papatyaları

Durum: Bölüm 2 kabulünden sonra üretilecek.

- Pıtpıt model sheet ve duygu/tepki animasyonları.
- Papatyalar için `intact`, `bend`, `damaged`, `repair` ve `restored` durumları.
- Çiçeklere basılmayan hassas rota için yaprak/taş basamak ailesi.
- Petal, rüzgâr ve onarım efektleri.
- Dekor çiçekleri collider değildir; oynanabilir yüzeyler ilk bakışta ayrılır.
- Ezilen çiçekler kaybolmaz; fiziksel sonuç ve onarım animasyonu görünür olur.

## Bölüm 4 — Orman Marketi

Durum: Bölüm 3 kabulünden sonra üretilecek.

- Orman platformları iç mekâna taşınmaz. Market için ayrı zemin, raf, kasa ve
  arka plan seti hazırlanır.
- Mor su aygırı kasiyer ile müşteri NPC paketleri.
- Kasa bandı sabit gövde, hareketli bant ve ürünleri ayrı katmanlar olarak taşır.
- Sepet, elma, havuç, bambu ve paket ürünlerde idle/interaction durumları olur.
- Sıra görsel olarak okunur; görünmez duvarla veya yalnız HUD metniyle
  anlatılmaz.
- İç mekân assetleri de gerçek RGBA ve 32–48 px güvenlik payı kapısından geçer.

## Her bölüm için geçiş kapısı

1. Bütün zorunlu sprite grupları mevcut ve manifestle eşleşiyor.
2. Görünür piksel hiçbir tuval kenarına değmiyor.
3. Dama deseni veya beyaz fon görüntüye pişirilmemiş.
4. Animasyonlarda tuval, pivot, ölçek ve ışık yönü sabit.
5. Fizik collider'ları sprite alfa sınırından bağımsız.
6. Sabit ve hareketli mekanizma parçaları ayrılmış.
7. Platformlar kesintisiz oynanıyor; kaya ve dekor çıkıntıları düşme deliği
   üretmiyor.
8. Bölümün masaüstü ve mobil ekran görüntüleri oyuncu gözüyle inceleniyor.
9. P0 görsel veya fizik hatası varken sonraki bölüme geçilmiyor.

