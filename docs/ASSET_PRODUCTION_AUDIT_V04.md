# Çatpat — Kapsamlı Görsel Asset ve Animasyon Denetimi V04

Tarih: 2026-09-01  
Durum: Denetim tamamlandı; V04 üretimi henüz başlamadı.  
Kapsam: Dört bölümlük oyun, karakter, arazi, çevre, oynanış nesneleri,
mekanizmalar ve efektler.

## Karar özeti

Mevcut paket son kullanıcıya sunulacak görsel paket değildir. Alfa kanalı olan
çok sayıda dosya bulunsa da animasyon kapsamı, kadraj güvenliği ve fiziksel
mantık birlikte değerlendirildiğinde paket prototip seviyesindedir.

- Mantar yalnızca tek statik kareden oluşuyor. Sıkışma, fırlatma ve toparlanma
  animasyonu yok.
- Kasa yalnızca tek statik kareden oluşuyor. İtme, sallanma, devrilme, düşme ve
  yere çarpma tepkisi yok.
- Basınç düğmesi yalnızca tek statik kareden oluşuyor. Yukarı, basılma, basılı
  kalma ve bırakılma durumları yok.
- Asansör tek bir birleşik görsel. Hareket eden platform ile sabit taşıyıcı
  ayrılmamış; görseldeki makara işlevsel bir ip sistemine bağlı değil.
- Salıncak tek bir birleşik görsel. Sabit üst taşıyıcı ve salınan gövde ayrı
  değil; gerçek bir üst pivot etrafında güvenilir biçimde hareket ettirilemez.
- Kapı ayrıştırılmış durumda fakat hareket, çarpma ve açılma efektleri eksik.
- Çevre dekorları statik. Ot, çiçek, bayrak, ağaç yaprakları ve çadır bayrağı
  için ortam hareketi yok.
- `terrain_v04` reddedildi: uzun ve kısa zeminlerde görünür pikseller dört
  kenara da temas ediyor; orta zemin PNG dosyası teknik olarak bozuk.
- Platform V02 dosyaları kesik değil ve gerçek alfa içeriyor; ancak alt şeffaf
  pay yalnızca 12 piksel. Yeni 32–48 piksel kadraj standardını karşılamıyor ve
  sprite içindeki şekilden fizik türetilmesi düşme hatalarına yol açıyor.

## Durum etiketleri

| Etiket | Anlamı |
|---|---|
| `FINAL` | Bütün görsel, animasyon, alfa ve entegrasyon kapılarını geçti |
| `KEEP_REFERENCE` | Yalnız sanat yönü veya oran referansı olarak tutulabilir |
| `REWORK` | Temel fikir kullanılabilir; kareler veya ayrıştırma yeniden yapılmalı |
| `REPLACE` | Üretim asseti baştan yapılmalı |
| `NEW` | Mevcut pakette bulunmuyor |
| `REJECTED` | Oyunda ve atlaslarda kullanılması yasak |

## Ölçülmüş mevcut paket durumu

| Paket | Dosya/kare | Alfa ve bütünlük | En küçük şeffaf pay | Karar |
|---|---:|---|---:|---|
| Çatpat `animation_v02` | 14 | RGBA, kenara temas yok | alt 20 px | `REWORK` |
| Platform `platforms_v02` | 8 | RGBA, kenara temas yok | alt 12 px | `REPLACE` |
| Dekor `decorations_v02` | 8 | RGBA, kenara temas yok | alt 16 px | `REWORK` |
| Nesne `objects_v02` | 8 | RGBA, kenara temas yok | mantar alt 22 px | `REWORK/REPLACE` |
| Mekanizma `mechanisms_v03` | 5 üretim parçası | RGBA, kenara temas yok | 11–16 px | `REWORK/REPLACE` |
| Zemin `terrain_v04` | 3 | 2 dosya taşmış, 1 dosya bozuk | 0 px | `REJECTED` |
| Arka plan `forest_valley.jpg` | 1 | RGB/JPG; tam ekran için alfa gerekmez | uygulanmaz | `KEEP_REFERENCE` |

Not: Bir PNG'nin RGBA olması tek başına “arka planı temiz” demek değildir.
Renk saçakları, yarı saydam kir, sahte dama deseni ve kenar pikselleri ayrıca
kontrol edilecektir.

## Mevcut dosyalar için karar

### Çatpat

Mevcut 14 kare hareket yönü ve karakter oranı için referans olabilir. Çerçeve
tabanı 20 piksel pay bıraktığı için yeni V04 standardına doğrudan alınmayacak.
Yeni paket bütün kliplerde aynı ayak pivotunu kullanacak.

| Klip | Mevcut | V04 hedefi | Karar |
|---|---:|---:|---|
| Idle | 1 | 6 | `REWORK` |
| Run | 8 | 8 | `REWORK` — hareket referansı korunabilir |
| Focus walk | 0 | 8 | `NEW` |
| Turn/brake | 0 | 4 | `NEW` |
| Jump start | 1 | 3 | `REWORK` |
| Jump rise | 0 | 2 | `NEW` |
| Jump apex | 1'e yakın poz | 2 | `REWORK` |
| Fall | 1 | 2 | `REWORK` |
| Land | 1 | 4 | `REWORK` |
| Push crate | 0 | 8 | `NEW` |
| Press/interact | 0 | 6 | `NEW` |
| Bump/recover | 0 | 5 | `NEW` |
| Mud shake | 0 | 8 | `NEW` |
| Respawn/return | 0 | 8 | `NEW` |
| Celebrate | 1 | 6 | `REWORK` |
| Look/wait | 0 | 6 | `NEW` |

Toplam hedef: **86 karakter karesi**.

### Oynanış nesneleri

| Sistem | Mevcut durum | V04 zorunlu klipler | Hedef kare | Karar |
|---|---|---|---:|---|
| Mantar | Tek statik kare | idle 4, compress 3, launch 3, recover 4 | 14 | `REPLACE` |
| Kasa | Tek statik kare | idle 1, push-wobble 6, edge-tip 3, land 4, weight-active 3 | 17 | `REPLACE` |
| Bulut | Tek statik kare | idle-drift 4, compress 2, rebound 3 | 9 | `REWORK` |
| Fener | Tek statik/yanık kare | off 1, ignite 6, active-flicker 6 | 13 | `REWORK` |
| Çamur | Tek statik kare | idle-ripple 4, splash 6, settle 3 | 13 | `REWORK` |
| Elma | Tek statik kare | shimmer 6 | 6 | `REWORK` |
| Yıldız | Tek statik kare | shimmer 6 | 6 | `REWORK` |
| Bilet | Tek statik kare | shimmer 6 | 6 | `REWORK` |

Mantar için fizik ve görsel aynı anda şu sırayı izlemeli:

1. Karakter temas eder; `compress` klibi başlar.
2. Fırlatma kuvveti tek bir tanımlı karede uygulanır.
3. `launch` klibi karakter yükselirken oynar.
4. `recover` klibi mantarı tam başlangıç pivotuna döndürür.
5. Mantar collider'ı sprite alfa sınırından değil, manifestteki ayrı yüzeyden
   alınır.

### Mekanizmalar

| Sistem | Bulgu | V04 çözümü | Karar |
|---|---|---|---|
| Basınç düğmesi | Tek görsel; durum değişimi yok | up, press, held, release; 8 kare | `REPLACE` |
| Asansör | Tek parça; makara var, işlevsel ip yok | makarasız sabit sarmaşık rayı + ayrı hareketli platform; 16 görsel/kare | `REPLACE` |
| Salıncak | Taşıyıcı ve salınan parça birleşik | sabit destek + gerçek ipleri olan ayrı salınan gövde; üst pivot tanımlı; 10 görsel/kare | `REPLACE` |
| Festival kapısı | Çerçeve ve panel ayrılmış | ayrımı koru; panel sarsıntısı 3 kare ve açılma FX'i ekle | `REWORK` |

Asansörde makara ancak görünür ve fiziksel olarak devam eden bir ip sistemi
varsa kullanılabilir. V04 yönü makarasız, sarmaşık raylı sistemdir.

Salıncak için kod bütün salınan gövdeyi üst pivot etrafında döndürür. Destek
direği hareket etmez. İpler salınan gövdenin içinde gerçekten platforma kadar
devam eder; boşta biten dekoratif ip veya makara kullanılmaz.

### Çevre ve anlatı dekorları

| Sistem | V04 hedefi | Hedef kare | Karar |
|---|---|---:|---|
| Ot | sway | 4 | `REWORK` |
| Çiçekler | sway | 4 | `REWORK` |
| Festival süsü | flutter | 6 | `REWORK` |
| Çalı | subtle-breathe | 4 | `REWORK` |
| Ağaç | sabit gövde 1 + yaprak sway 6 | 7 | `REWORK` |
| Çadır | sabit gövde 1 + bayrak flutter 6 | 7 | `REWORK` |
| Kayalar | statik | 1 | `REWORK` — yeniden kadraj |
| Yön tabelası | straight 1, turned 1, wobble 4, repair 6 | 12 | `REWORK` |

### Arazi ve platformlar

V02 görselleri referans olarak kalabilir; nihai fizik için kullanılmayacak.
V04 kesik zemin seti tamamen reddedildi. Yeni arazi seti modüler diye açık
kenarlı üretilmeyecek; her parça iki doğal ucu görünen, tuval içinde tamamen
kalan bağımsız bir siluet olacak.

| Arazi grubu | Varyant | Tuval |
|---|---:|---:|
| Uzun tam zemin | 3 | 2048×512 |
| Orta tam zemin | 3 | 1536×512 |
| Kısa tam zemin | 3 | 1024×512 |
| Basamak taşı | 4 | 512×512 |
| Kaya platform | 3 | 768×512 |
| Uzun sütun | 2 | 768×768 |
| Yukarı rampa | 2 | 1024×768 |
| Aşağı rampa | 2 | 1024×768 |
| Köprü | 2 | 1280×768 |

Toplam hedef: **24 eksiksiz arazi görseli**.

Arazi sprite'ları fizik sınırı değildir. Claude tarafında her platform için
bağımsız, sade ve sürekli collider tanımlanır. Görselde kaya çıkıntısı olması
oyuncuyu düşürecek ek çukur veya alfa tabanlı fizik üretmez.

### Efektler

| Efekt | Kare |
|---|---:|
| Koşu tozu/yaprak izi | 6 |
| İniş pufu | 4 |
| Mantar fırlatma yaprakları | 6 |
| Düğme tıklama parlaması | 4 |
| Toplanabilir patlaması | 6 |
| Checkpoint ışık halkası | 6 |
| Kapı açılma tozu/yaprakları | 6 |
| Çamur sıçraması | 6 |
| Darbe yıldızları | 6 |
| Yeniden doğma girdabı | 8 |

Toplam hedef: **58 efekt karesi**.

## Dört bölümlük görsel kapsam

| Bölüm | Görsel kimlik | Zorunlu oynanış setleri |
|---|---|---|
| 1 — Çatpat Gibi Bir Gün | Açık sabah, sıcak yeşiller, festival renkleri | temel arazi, tabela, bilet, mantar, çamur, düğme, kapı, checkpoint |
| 2 — Dal Dal Üstüne | Yüksek ağaç katmanları, serin gölgeler | sarmaşık asansörü, gerçek ipli salıncak, dal platformları, Maymun ve Porsuk |
| 3 — Pıtpıt'ın Papatyaları | Açık bahçe, beyaz papatya ritmi, hassas rota | sağlam/ezilmiş/onarılan çiçekler, yaprak basamaklar, Pıtpıt ve petal efektleri |
| 4 — Orman Marketi | Sıcak iç mekân, ahşap raflar, okunaklı sıra | kasa bandı, sepet, ürünler, müşteri sırası ve kasiyer karakteri |

Dört bölüm aynı sanat dilini kullanır fakat aynı ortamın renk değiştirilmiş
kopyaları değildir. Dal, papatya bahçesi ve market için ayrı bölüm manifestleri
sırayla hazırlanır. Aynı platform damgası arka arkaya tekrarlanmaz.

## Zorunlu V04 kalite kapısı

Bir dosya aşağıdaki maddelerin tümünü geçmeden `FINAL` olamaz:

1. PNG dosyası gerçek `RGBA` biçimindedir.
2. Dört köşe tamamen şeffaftır (`alpha = 0`).
3. Görünür piksel kutusu hiçbir tuval kenarına değmez.
4. Her kenarda en az 32 piksel; karakter, mekanizma ve ana oynanış
   nesnelerinde tercihen 48 piksel şeffaf güvenlik payı vardır.
5. Dama deseni, beyaz fon veya renkli fon görüntünün içine pişirilmemiştir.
6. Düşük alfada beyaz/gri renk saçağı yoktur.
7. Aynı klibin bütün kareleri aynı tuval ölçüsündedir.
8. Pivot kayması en fazla 1 pikseldir; ayak veya taban teması kareler arasında
   yüzmez.
9. Kare sıralaması ileri ve geri oynatılarak hacim sıçraması, parça kaybı ve
   şekil erimesi kontrol edilir.
10. Oynanış collider'ı alfa sınırından türetilmez; ayrı metadata olarak gelir.
11. Hareketli mekanizmalar sabit ve hareketli parçalara ayrılmıştır.
12. Sprite atlası ancak tekil PNG'ler geçtikten sonra üretilir; atlas içinde
    en az 8 piksel padding ve 2 piksel edge extrusion kullanılır.

## Üretim önceliği

### P0 — Claude entegrasyonunu bloke edenler

- Mantar 14 kare
- Kasa 17 kare
- Basınç düğmesi 8 kare
- Makarasız sarmaşık asansörü 16 görsel/kare
- Ayrıştırılmış salıncak 10 görsel/kare
- Kapı ayrımı ve tepki seti 5 görsel/kare
- 24 eksiksiz arazi görseli
- Çatpat itme, etkileşim, iniş ve temel hareket klipleri

### P1 — Oyun hissini oluşturanlar

- Bulut, fener, çamur ve koleksiyon animasyonları
- Çatpat'ın kalan tepki klipleri
- Tabela durumları
- Temel oynanış efektleri

### P2 — Dünyayı canlı yapanlar

- Ot, çiçek, bayrak, çalı, ağaç ve çadır hareketleri
- Bölüm bazlı arka plan/parallax varyasyonları
- İkincil ortam ve kutlama efektleri

## Toplam üretim kapsamı

| Alan | Hedef görsel/kare |
|---|---:|
| Çatpat | 86 |
| Oynanış nesneleri | 84 |
| Mekanizmalar | 39 |
| Dekor ve tabela | 45 |
| Arazi | 24 |
| Efektler | 58 |
| **Toplam** | **336** |

Bu sayı her karenin sıfırdan ayrı üretilmesi gerektiği anlamına gelmez; aynı
klipte kontrollü deformasyon ve elle ara kare üretimi kullanılabilir. Ancak
teslimat sonunda doğrulanacak tekil kare sayısı 336'dır.

## Kullanımı yasak dosyalar

- `assets/environments/forest/terrain_v04/forest_ground_long.png`
- `assets/environments/forest/terrain_v04/forest_ground_medium.png`
- `assets/environments/forest/terrain_v04/forest_ground_short.png`

Bu dosyalar silinmeden `REJECTED` kaynak olarak tutulabilir; oyuna, atlasa veya
Claude entegrasyonuna alınamaz.

## Teslimat sözleşmesi

- Üretim kökü: `assets/production_v04/`
- Tekil kareler önce ayrı PNG olarak teslim edilir.
- Her grubun adı, fps'i, loop davranışı, pivotu, görsel yüzeyi ve collider
  sözleşmesi makine manifestinde bulunur.
- Claude sprite dosyasını fizik şekli olarak kullanmaz.
- Eksik grup için sessiz placeholder kullanılmaz; geliştirme sırasında açık
  hata üretilir.
- Eski V02/V03 dosyaları yalnız açıkça `KEEP_REFERENCE` denilen yerlerde
  görsel referanstır; otomatik fallback değildir.
