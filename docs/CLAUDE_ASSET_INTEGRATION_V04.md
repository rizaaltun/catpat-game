# Claude İçin Çatpat V04 Görsel Entegrasyon Sözleşmesi

Bu dosya oyun kodunu geliştiren Claude için bağlayıcı entegrasyon notudur.
Görsel üretim kapsamının tek makine kaynağı:

`assets/production_v04/asset_production_manifest.json`

## Proje sınırı

- Oyun dört bölümden oluşur: Çatpat Gibi Bir Gün, Dal Dal Üstüne,
  Pıtpıt'ın Papatyaları ve Orman Marketi.
- Şu anda yalnız Bölüm 1 entegrasyonu üzerinde çalışılır. Bölüm 2–4, kendi
  versioned görsel manifestleri ve görsel QA onayı gelmeden oynanabilir yapılmaz.
- Dört bölümlük yol haritası dışındaki eski bölüm planları kapsam veya bölüm
  yükleme kaynağı değildir.
- V02/V03 görselleri prototip/referanstır. V04 grubu eksik olduğunda otomatik
  eski görsele dönülmez; geliştirme hatası gösterilir.
- `assets/environments/forest/terrain_v04/` içindeki üç zemin dosyası
  reddedilmiştir ve hiçbir şekilde yüklenmez.

## Yükleme ve atlas sırası

1. `asset_production_manifest.json` yüklenir.
2. Yalnız `productionGroups` içinde tanımlı çıktı dizinleri taranır.
3. Beklenen kare sayısı, tuval ölçüsü ve dosya sırası doğrulanır.
4. Tekil PNG kalite doğrulaması geçmeden atlas üretilmez.
5. Atlas oluşturulursa 8 px padding ve 2 px edge extrusion kullanılır.
6. Runtime animasyonları bağımsız kırpılmış frame boyutlarıyla değil, manifestteki
   sabit tuval ve pivotlarla oynatılır.

## Fizik sözleşmesi

- Sprite alfa kanalı collider değildir.
- Her collider, manifestteki `collider` veya `colliderContract` alanından
  türetilen ayrı geometri olarak tanımlanır.
- Dekoratif kaya, kök, çimen veya oyuklar collider'a küçük çentikler eklemez.
- Uzun yürüyüş yüzeyleri görsel parçalar arasında kesintisiz collider kullanır.
- Render yüzeyi ile fizik yüzeyi hedef ölçekte en fazla 2 px ayrılır.
- Hareketli platformun hızı oyuncuya doğru biçimde aktarılır; çizim ve fizik aynı
  transformu paylaşır.
- Düşme testi alfa veya görünür piksel kutusuyla yapılmaz.

## Durum makineleri

### Mantar

```text
idle -> compress -> launch -> recover -> idle
```

- Karakter üst yüzeye temas ettiğinde `compress` başlar.
- Fırlatma kuvveti `object.mushroom.launch` grubunun `eventFrame` değerinde
  uygulanır.
- Aynı temas boyunca ikinci kez fırlatma yapılmaz.
- `recover` sonunda sprite ve collider başlangıç pivotuna tam döner.
- Mantarın yalnız Y ekseninde ölçeklenmesi animasyon yerine kullanılmaz.

### Kasa

```text
idle <-> push_wobble -> edge_tip -> airborne -> land -> idle
                         |
                         +-> weight_activate -> idle
```

- Kasa hareketi fizik gövdesiyle yapılır; `push_wobble` yalnız görsel tepkidir.
- Havada dönüş kodla uygulanabilir, ancak pivot fizik kütle merkezinden ayrılmaz.
- Platform kenarında `edge_tip`, zemine çarpmada `land` oynar.
- Ağırlık plakasında durduğunda `weight_activate` bir kez oynar.

### Basınç düğmesi

```text
up -> press -> held -> release -> up
```

- Hedef mekanizma `press.eventFrame` anında tetiklenir.
- Üzerinde kasa/karakter varken `held` karesi korunur.
- Latch mantığı oyun verisidir; sprite durumu değildir.

### Sarmaşık asansörü

```text
platform_idle -> depart -> travel -> arrive -> platform_idle
```

- `mechanism.lift.rail` sabittir.
- Diğer dört grup aynı hareketli platform gövdesini temsil eder.
- Görselde makara yoktur. Sonradan dekoratif makara eklenmez.
- Platform ray boyunca kodla hareket eder; animasyon yalnız esneme ve yaprak
  tepkisini gösterir.

### Salıncak

- `mechanism.swing.support` dünya uzayında sabittir.
- `mechanism.swing.assembly`, `tension` ve `land_react` üst pivot etrafında
  dönen aynı salınan gövdedir.
- İpler görsel olarak üst pivottan platforma kesintisiz ulaşır.
- Kod, bütün salınan gövdeyi döndürür; platformu tek başına yatay kaydırmaz.
- Collider aynı açıyla ve aynı pivot etrafında döner.

### Festival kapısı

- `mechanism.gate.frame` sabittir.
- `mechanism.gate.panel` çerçeve içinde yalnız Y ekseninde çevrilmeden taşınır.
- Kapı açılamıyorsa `rattle` oynar; açılıyorsa panel ölçeklenmez.
- Açılma sırasında `fx.gate_dust_leaves` bir kez oynatılır.

## Karakter animasyon önceliği

Runtime seçim sırası:

1. `respawn`
2. `bump_recover` veya `mud_shake`
3. `push` veya `interact`
4. `jump_start`, `jump_rise`, `jump_apex`, `fall`, `land`
5. `turn_brake`
6. `run` veya `focus_walk`
7. `celebrate`
8. `look_wait` veya `idle`

Ayak pivotu bütün karakter gruplarında `[256, 656]` kalır. Kod frame başına
görsel merkez düzeltmesi yapmaz.

## Görsel katman sırası

1. Uzak arka plan/parallax
2. Arka dekor ve sabit mekanizma destekleri
3. Arazi görselleri
4. Hareketli platformlar ve fizik nesneleri
5. Çatpat ve diğer karakterler
6. Ön dekor
7. Oynanış efektleri
8. HUD

## Bölüm yükleme kapsamı

| Bölüm | Zorunlu V04 grupları |
|---|---|
| 1 | Mantar, çamur, fener, bilet, düğme, kapı, tabela, temel arazi ve temel Çatpat klipleri |
| 2 | Maymun ve Porsuk, dal arazi seti, gerçek ipli salıncak ve sarmaşık asansörü |
| 3 | Pıtpıt, sağlam/ezilmiş/onarılan papatyalar, yaprak basamaklar ve petal efektleri |
| 4 | Market iç mekânı, kasiyer/müşteriler, sıra işaretleri, kasa bandı, sepet ve ürünler |

Bir bölüm ancak kendi zorunlu grupları `FINAL` olduğunda kullanıcı testine
açılır. Eksik P2 dekorlar geliştirme testini engellemez; eksik P0 oynanış
sprite'ları engeller.

## Kabul logu

Her importta en az şu bilgiler yazdırılır:

- Manifest sürümü ve paket kimliği
- Yüklenen grup ve kare sayısı
- Eksik veya fazla kareler
- Yanlış tuval ölçüsü
- RGBA olmayan dosya
- Güvenlik payı ihlali
- Pivot veya event frame sözleşmesi ihlali
- Reddedilmiş dosyaya yapılan her referans

Bu log temiz değilse paket “oynanabilir” olarak işaretlenmez.
