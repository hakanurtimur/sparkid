# Sparkid MVP QA Checklist

Bu dosya Sparkid MVP bitirme sprinti icin ana kontrol listesidir.

Durum isaretleri:

- `[ ]` Test edilmedi
- `[x]` Gecti
- `[~]` Kucuk sorun var
- `[!]` Kaldi / kritik sorun

Her maddeyi test ederken kisa not ekle:

```txt
[ ] Test maddesi
    Not:
```

## 0. Genel Kabul Kriteri

- [ ] `/levels` duzgun calisiyor.
    Not:
- [ ] 6 ada gorunuyor.
    Not:
- [ ] Her ada detayina gidiliyor.
    Not:
- [ ] Ada 1-5 ana ogrenme gorevlerini yaptiriyor.
    Not:
- [ ] Ada 6 serbest devre masasi calisiyor.
    Not:
- [ ] Dogru devre ampul yakiyor.
    Not:
- [ ] Yanlis devre basari vermiyor.
    Not:
- [ ] Kablo kesici sadece seciliyken kablo kesiyor.
    Not:
- [ ] Sparky gorevleri anlasilir anlatiyor.
    Not:
- [ ] Chest / reward akisi calisiyor.
    Not:
- [ ] `pnpm lint` geciyor.
    Not:
- [ ] `pnpm build` geciyor.
    Not:
- [ ] 10 dakikalik demo boyunca beyaz ekran yok.
    Not:

## 1. Route QA

- [ ] `/` aciliyor, landing gorunuyor, beyaz ekran yok.
    Not:
- [ ] Landing CTA dogru akis/route'a yonlendiriyor.
    Not:
- [ ] `/sparkid` hata vermeden yukleniyor.
    Not:
- [ ] `/levels` ada haritasini gosteriyor.
    Not:
- [ ] `/levels/power` Kapali Devre Adasi'ni gosteriyor.
    Not:
- [ ] `/levels/switch` Anahtar Adasi'ni gosteriyor.
    Not:
- [ ] `/levels/fault` Hatali Devre Adasi'ni gosteriyor.
    Not:
- [ ] `/levels/series` Seri Devre Adasi'ni gosteriyor.
    Not:
- [ ] `/levels/parallel` Paralel Devre Adasi'ni gosteriyor.
    Not:
- [ ] `/levels/free-lab` Serbest Devre Masasi'ni gosteriyor.
    Not:
- [ ] `/circuit` default lab'i hata vermeden acar.
    Not:
- [ ] `/circuit?island=power&lesson=1` acilir.
    Not:
- [ ] `/circuit?island=switch&lesson=1` acilir.
    Not:
- [ ] `/circuit?island=fault&lesson=1` acilir.
    Not:
- [ ] `/circuit?island=series&lesson=1` acilir.
    Not:
- [ ] `/circuit?island=parallel&lesson=1` acilir.
    Not:
- [ ] `/circuit?island=free-lab` acilir.
    Not:
- [ ] Yanlis `island` query app'i cokertmez.
    Not:
- [ ] Yanlis `lesson` query app'i cokertmez veya guvenli fallback verir.
    Not:
- [ ] Browser back onceki ekrana dondurur.
    Not:
- [ ] Ada detayindan `Adalara Don` `/levels` route'una gider.
    Not:
- [ ] Bolumden `Adaya Don` dogru ada detayina gider.
    Not:

## 2. Global Stability QA

- [ ] Sayfa refresh sonrasi tekrar yuklenir.
    Not:
- [ ] Hard refresh beyaz ekran uretmez.
    Not:
- [ ] Hizli route degistirme app'i cokertmez.
    Not:
- [ ] Dev server hot reload sonrasi sayfa toparlanir.
    Not:
- [ ] Console'da kritik error yok.
    Not:
- [ ] Hydration error yok.
    Not:
- [ ] TypeScript error yok.
    Not:
- [ ] ESLint error yok.
    Not:
- [ ] Production build geciyor.
    Not:

## 3. Levels Haritasi QA

- [ ] 6 ada gorunur: Power, Switch, Fault, Series, Parallel, Free Lab.
    Not:
- [ ] Ada yerlesimleri birbirinin ustune binmez.
    Not:
- [ ] Ada isimleri Turkce ve dogru.
    Not:
- [ ] Secili ada karti dogru bilgiyi gosterir.
    Not:
- [ ] Ada karti CTA dogru ada detayina gider.
    Not:
- [ ] Rota cizgisi ada akisini anlasilir gosterir.
    Not:
- [ ] Kilitli/acik durum dogru gorunur.
    Not:
- [ ] Hover/click feedback tıklanabilirligi anlatir.
    Not:
- [ ] Mobil gorunumde kartlar tasmaz.
    Not:
- [ ] 1280x720 gorunumde ada ve panel ekrana sigar.
    Not:
- [ ] Buyuk ekranda ada haritasi dagilmaz.
    Not:
- [ ] Ana sayfa butonu `/` route'una gider.
    Not:

## 4. Ada Detay Sayfasi QA

Her ada icin test edilecek route'lar:

- `/levels/power`
- `/levels/switch`
- `/levels/fault`
- `/levels/series`
- `/levels/parallel`
- `/levels/free-lab`

- [ ] Ada GLB modeli yuklenir.
    Not:
- [ ] Ada isiklari cok karanlik veya patlak degil.
    Not:
- [ ] Kamera adayi dogru kadrajlar.
    Not:
- [ ] Bolum node'lari dogru yerde gorunur.
    Not:
- [ ] Node tiklama dogru circuit route'una gider.
    Not:
- [ ] Cocuk karakter ada ustunde gorunur.
    Not:
- [ ] Karakter tiklanan yere yurur.
    Not:
- [ ] Karakter gittigi yone bakar, sirtini donmez.
    Not:
- [ ] Cikis kapisi `/levels` route'una gider.
    Not:
- [ ] Geri butonu `/levels` route'una gider.
    Not:
- [ ] Progress panel bolum durumlarini dogru gosterir.
    Not:
- [ ] Chest ada tamamlanmadan locked kalir.
    Not:
- [ ] Chest ada tamamlaninca acilir.
    Not:
- [ ] Odul modalinda odul bilgisi gorunur.
    Not:
- [ ] Console'da kritik error yok.
    Not:

## 5. Circuit Lab Genel QA

- [ ] Canvas gorunur.
    Not:
- [ ] Masa yuklenir.
    Not:
- [ ] Grid ve zemin gorunur.
    Not:
- [ ] Kamera presetleri calisir: On, Sol, Sag, Ust, Yakin.
    Not:
- [ ] Orbit yok; kullanici sahneyi serbest donduremez.
    Not:
- [ ] Tool kit ekrana sigar.
    Not:
- [ ] Gorev paneli tasmaz.
    Not:
- [ ] Sparky paneli sahneyi kapatmaz.
    Not:
- [ ] Kablo porttan porta gorunur.
    Not:
- [ ] Portlar dogru yerde gorunur.
    Not:
- [ ] Parca secilince grid cell'ler aktif olur.
    Not:
- [ ] Secili parca masaya yerlesir.
    Not:
- [ ] Ayni parca tekrar secilip baska hucreye tasinir.
    Not:
- [ ] Baska parcanin ustune yerlestirme engellenir.
    Not:
- [ ] Reset sahneyi baslangic durumuna dondurur.
    Not:
- [ ] Kablo limiti dogru calisir.
    Not:
- [ ] Kablo kesici sadece seciliyken kablo keser.
    Not:
- [ ] Kesici secili degilken makas cursor gorunmez.
    Not:
- [ ] Tool degisince cursor normale doner.
    Not:
- [ ] Kablo secilince hedef portlar belli olur.
    Not:
- [ ] Yanlis portlar gerekiyorsa soluk veya pasif olur.
    Not:
- [ ] Bolum tamamlaninca basari mesaji cikar.
    Not:
- [ ] Adaya don dogru ada detayina gider.
    Not:

## 6. Tool Kit QA

- [ ] Pil secilir ve grid aktif olur.
    Not:
- [ ] Pil yerlestirilir, portlari gorunur.
    Not:
- [ ] Pil tasinabilir.
    Not:
- [ ] Ampul secilir ve grid aktif olur.
    Not:
- [ ] Ampul yerlestirilir, portlari gorunur.
    Not:
- [ ] Ampul tasinabilir.
    Not:
- [ ] Ampul 2 Free Lab'de gorunur.
    Not:
- [ ] Ampul 2 secilebilir ve yerlestirilebilir.
    Not:
- [ ] Ampul 2 tasinabilir.
    Not:
- [ ] Anahtar secilir ve grid aktif olur.
    Not:
- [ ] Anahtar yerlestirilir, portlari gorunur.
    Not:
- [ ] Anahtar tasinabilir.
    Not:
- [ ] Kablo secilince portlar aktiflesir.
    Not:
- [ ] Iki port secilince kablo cizilir.
    Not:
- [ ] Kesici secilince kablo hover/click aktif olur.
    Not:
- [ ] Kesici secilmeden kabloya tiklaninca kablo kesilmez.
    Not:
- [ ] Ipucu secilince Sparky mesaj verir.
    Not:
- [ ] Sifirla bolum state'ini resetler.
    Not:

## 7. Port / Plug QA

- [ ] Kablo secili degilken portlar tiklanmaz.
    Not:
- [ ] Kablo seciliyken uygun portlar tiklanabilir.
    Not:
- [ ] Ilk port secilince pending port amber/turuncu olur.
    Not:
- [ ] Hedef port cyan/parlak olur.
    Not:
- [ ] Yanlis portlar soluk veya pasif olur.
    Not:
- [ ] Iki port secilince kablo olusur.
    Not:
- [ ] Ayni port tekrar secilince pending iptal olur.
    Not:
- [ ] Ayni baglanti tekrar denenince cift kablo olusmaz.
    Not:
- [ ] Paylasimli pil portu paralel devrede coklu kablo alabilir.
    Not:
- [ ] Normal port gerekiyorsa tek baglanti alir.
    Not:
- [ ] Kablo kesilince portlar yeniden kullanilabilir olur.
    Not:

## 8. Kablo QA

- [ ] Kablo baslangici porttan cikar.
    Not:
- [ ] Kablo bitisi porta girer.
    Not:
- [ ] Kablo masa ustunde kalir, cok havada durmaz.
    Not:
- [ ] Kablo mumkun oldugunca objelerin icinden gecmez.
    Not:
- [ ] Powered durumda kablo renk/akis degistirir.
    Not:
- [ ] Pasif kablo sade gorunur.
    Not:
- [ ] Warning kablo turuncu/kirmizi gorunur.
    Not:
- [ ] Removable kablo kesici seciliyken kesilir.
    Not:
- [ ] Kablo kesilince state guncellenir.
    Not:
- [ ] Fazla kablo limiti asmaz.
    Not:
- [ ] Free Lab 6 kabloya izin verir.
    Not:

## 9. Circuit Engine QA

- [ ] Sadece `battery:plus -> bulb:a` baglanirsa ampul yanmaz.
    Not:
- [ ] `battery:plus -> bulb:a` ve `bulb:b -> battery:minus` baglanirsa ampul yanar.
    Not:
- [ ] Switch OFF iken devre bagli olsa bile ampul yanmaz.
    Not:
- [ ] Switch ON iken dogru devre ampulu yakar.
    Not:
- [ ] Switch seri bagliyken elektrik switch uzerinden gecer.
    Not:
- [ ] Switch dekoratif kalmaz, devre mantigina etki eder.
    Not:
- [ ] Seri devre tamamlaninca iki ampul yanar.
    Not:
- [ ] Seri devrede orta kablo koparsa iki ampul de soner.
    Not:
- [ ] Paralel devre tamamlaninca iki ampul yanar.
    Not:
- [ ] Paralelde bir kol koparsa diger ampul yanmaya devam eder.
    Not:
- [ ] Fault yanlis kablo ampulu yakmaz.
    Not:
- [ ] Fault yanlis kablo duzeltilince ampul yanar.
    Not:
- [ ] Free Lab basit devre calisir.
    Not:
- [ ] Free Lab anahtarli devre Switch ON/OFF ile calisir.
    Not:
- [ ] Free Lab seri devre calisir.
    Not:
- [ ] Free Lab paralel devre calisir.
    Not:
- [ ] Free Lab en az bir gecerli devreyi basari kabul eder.
    Not:

## 10. Ada 1 - Kapali Devre Adasi QA

Route'lar:

- `/circuit?island=power&lesson=1`
- `/circuit?island=power&lesson=2`
- `/circuit?island=power&lesson=3`

- [ ] Bolum 1: Ampul hazir ve sonuk baslar.
    Not:
- [ ] Bolum 1: Pil yerlestirilince pil portlari gorunur.
    Not:
- [ ] Bolum 1: `battery:plus -> bulb:a` kablosu olusur.
    Not:
- [ ] Bolum 1: Tek baglanti sonrasi ampul yanmaz.
    Not:
- [ ] Bolum 1: Sparky donus yolu eksik der.
    Not:
- [ ] Bolum 1: Ilk enerji yolu tamamlaninca bolum basarili olur.
    Not:
- [ ] Bolum 2: Ilk baglanti korunur.
    Not:
- [ ] Bolum 2: `bulb:b -> battery:minus` baglaninca ampul yanar.
    Not:
- [ ] Bolum 2: Sparky kapali devreyi aciklar.
    Not:
- [ ] Bolum 2: Basari sonrasi adaya don cikiyor.
    Not:
- [ ] Bolum 3: Baslangicta devre calisir ve ampul yaniktir.
    Not:
- [ ] Bolum 3: Kesici secilince kablo kesilebilir.
    Not:
- [ ] Bolum 3: Donus kablosu kesilince ampul soner.
    Not:
- [ ] Bolum 3: Kablo yeniden baglaninca ampul tekrar yanar.
    Not:
- [ ] Bolum 3: Ada tamamlanir ve chest acilabilir.
    Not:

## 11. Ada 2 - Anahtar Adasi QA

Route'lar:

- `/circuit?island=switch&lesson=1`
- `/circuit?island=switch&lesson=2`
- `/circuit?island=switch&lesson=3`

- [ ] Bolum 1: Switch masada gorunur.
    Not:
- [ ] Bolum 1: Switch ON yapilinca gorsel ON olur.
    Not:
- [ ] Bolum 1: Switch OFF yapilinca gorsel OFF olur.
    Not:
- [ ] Bolum 1: ON/OFF cycle bolumu tamamlar.
    Not:
- [ ] Bolum 2: Hedef yol `battery.plus -> switch.in -> switch.out -> bulb -> battery.minus`.
    Not:
- [ ] Bolum 2: Switch OFF iken ampul sonuktur.
    Not:
- [ ] Bolum 2: Switch ON iken ampul yanar.
    Not:
- [ ] Bolum 2: Sparky switch'in kontrol kapisi oldugunu aciklar.
    Not:
- [ ] Bolum 3: Cocuk pil/anahtar/ampul yerlestirebilir.
    Not:
- [ ] Bolum 3: Dogru switch devresi basari tetikler.
    Not:
- [ ] Ada 2 odulu Anahtar Araci'dir.
    Not:

## 12. Ada 3 - Hatali Devre Adasi QA

Route'lar:

- `/circuit?island=fault&lesson=1`
- `/circuit?island=fault&lesson=2`
- `/circuit?island=fault&lesson=3`

- [ ] Bolum 1: Baslangicta `battery+ -> bulb:a` vardir.
    Not:
- [ ] Bolum 1: Ampul sonuktur.
    Not:
- [ ] Bolum 1: Sparky eksik donus yolunu aciklar.
    Not:
- [ ] Bolum 1: `bulb:b -> battery-` baglaninca ampul yanar.
    Not:
- [ ] Bolum 2: Yanlis kablo hazirdir ve warning renktedir.
    Not:
- [ ] Bolum 2: Kesici secilmeden yanlis kablo kesilmez.
    Not:
- [ ] Bolum 2: Kesici ile yanlis kablo kesilir.
    Not:
- [ ] Bolum 2: Dogru donus baglantisi ampulu yakar.
    Not:
- [ ] Bolum 3: Ariza mantigi cocuk icin anlasilirdir.
    Not:
- [ ] Bolum 3: Yanlis baglanti anlamli bir parca/port uzerindedir.
    Not:
- [ ] Bolum 3: Yanlis kablo duzeltilince devre calisir.
    Not:
- [ ] Ada 3 odulu Devre Dedektoru'dur.
    Not:

## 13. Ada 4 - Seri Devre Adasi QA

Route'lar:

- `/circuit?island=series&lesson=1`
- `/circuit?island=series&lesson=2`
- `/circuit?island=series&lesson=3`

- [ ] Bolum 1: Tek ampullu devre baslar.
    Not:
- [ ] Bolum 1: Ikinci ampul zincire eklenince iki ampul seri yanar.
    Not:
- [ ] Bolum 1: Yanlis paralel shortcut basari vermez.
    Not:
- [ ] Bolum 2: Seri devre hazir baslar ve iki ampul yanar.
    Not:
- [ ] Bolum 2: Orta kablo kesilince iki ampul soner.
    Not:
- [ ] Bolum 2: Orta kablo tekrar baglaninca iki ampul yanar.
    Not:
- [ ] Bolum 3: Sifirdan seri kurulum dogru sira ister.
    Not:
- [ ] Bolum 3: Seri basarida iki ampul yanar.
    Not:
- [ ] Ada 4 odulu Isik Zinciri Rozeti'dir.
    Not:

## 14. Ada 5 - Paralel Devre Adasi QA

Route'lar:

- `/circuit?island=parallel&lesson=1`
- `/circuit?island=parallel&lesson=2`
- `/circuit?island=parallel&lesson=3`

- [ ] Bolum 1: Tek ampul calisir.
    Not:
- [ ] Bolum 1: Ikinci dal eklenince iki ampul yanar.
    Not:
- [ ] Bolum 1: Seri baglanti denenince basari vermez.
    Not:
- [ ] Bolum 2: Iki dal hazir baslar ve iki ampul yanar.
    Not:
- [ ] Bolum 2: Ikinci dal kesilince sadece ikinci ampul soner.
    Not:
- [ ] Bolum 2: Birinci dal yanik kalir.
    Not:
- [ ] Bolum 2: Ikinci dal onarilinca iki ampul yanar.
    Not:
- [ ] Bolum 3: Sifirdan paralel kurulum iki ayri yol ister.
    Not:
- [ ] Bolum 3: Paralel basarida iki ampul yanar.
    Not:
- [ ] Ada 5 odulu Cift Isik Rozeti'dir.
    Not:

## 15. Ada 6 - Serbest Devre Masasi QA

Route:

- `/circuit?island=free-lab`

- [ ] Tek bolumdur; sadece serbest masa gorunur.
    Not:
- [ ] Tool kit Pil, Ampul, Ampul 2, Anahtar, Kablo, Kesici, Ipucu, Sifirla gosterir.
    Not:
- [ ] Parcalar istedigi bos hucreye konabilir.
    Not:
- [ ] Pil tasinabilir.
    Not:
- [ ] Ampul tasinabilir.
    Not:
- [ ] Ampul 2 tasinabilir.
    Not:
- [ ] Anahtar tasinabilir.
    Not:
- [ ] Basit devre en az bir ampul yakar.
    Not:
- [ ] Anahtarli devre Switch ON/OFF ile calisir.
    Not:
- [ ] Seri devre iki ampul yakar.
    Not:
- [ ] Paralel devre iki ampul yakar.
    Not:
- [ ] Tek ampullu gecerli devre basari verir.
    Not:
- [ ] Sparky devre turunu soyler.
    Not:
- [ ] Reset tum parca ve kablolari sifirlar.
    Not:

## 16. Sparky QA

- [ ] Ilk giris mesaji bolum hedefini anlatir.
    Not:
- [ ] Tool secimi mesaji degistirir.
    Not:
- [ ] Kablo pending durumunda ikinci portu sec der.
    Not:
- [ ] Yanlis baglantida cocuk dilinde duzeltir.
    Not:
- [ ] Basarida net tebrik verir.
    Not:
- [ ] Free Lab basarisinda devre turunu aciklar.
    Not:
- [ ] Uzun metin panelden tasmaz.
    Not:
- [ ] Konusma tonu cocuk dostu ve moral bozmaz.
    Not:
- [ ] Gercek AI yokken mock mesajlar urun hissini bozmaz.
    Not:

## 17. Reward / Progress QA

- [ ] Bolum tamamlaninca progress islenir.
    Not:
- [ ] Adaya donunce tamamlanan node farkli gorunur.
    Not:
- [ ] Son bolum bitince ada tamamlanir.
    Not:
- [ ] Chest once locked kalir.
    Not:
- [ ] Chest sonra unlocked ve tiklanabilir olur.
    Not:
- [ ] Chest acilinca odul modal'i cikar.
    Not:
- [ ] Odul gorseli tool kit diliyle uyumludur.
    Not:
- [ ] Modal sorunsuz kapanir.
    Not:
- [ ] Progress refresh sonrasi korunur.
    Not:
- [ ] Dev reset progress butonu MVP'de kaldirilir veya sadece dev amacli net gorunur.
    Not:

## 18. UI / Responsive QA

- [ ] 1280x720 ekranda tool kit sigar.
    Not:
- [ ] 1440x900 ekranda paneller dengelidir.
    Not:
- [ ] 1920x1080 ekranda sahne cok kucuk kalmaz.
    Not:
- [ ] Mobile width'te paneller tasmaz.
    Not:
- [ ] Tablet gorunumde tool kit kullanilabilir.
    Not:
- [ ] Browser zoom 90% UI'yi bozmaz.
    Not:
- [ ] Browser zoom 110% UI'yi bozmaz.
    Not:
- [ ] Uzun Turkce metin buton/kart disina tasmaz.
    Not:
- [ ] CTA butonlari net ve tiklanabilir.
    Not:
- [ ] Renk kontrasti metni okunur kilar.
    Not:
- [ ] MVP'de dev/debug metinleri gorunmez.
    Not:

## 19. Performance QA

- [ ] Ilk yukleme kabul edilebilir hizda.
    Not:
- [ ] Levels ekrani takilmadan gorunur.
    Not:
- [ ] Ada detayinda GLB yuklenirken loading gorunur.
    Not:
- [ ] Circuit Lab masa yuklenirken beyaz ekran yok.
    Not:
- [ ] Kablo cizme FPS'i oldurmez.
    Not:
- [ ] Kablo kesme donma yapmaz.
    Not:
- [ ] Cok kabloyla sahne oynanabilir kalir.
    Not:
- [ ] Free Lab tum parcalar varken kabul edilebilir performansta.
    Not:
- [ ] GLB preload gereksiz yuk bindirmez.
    Not:
- [ ] Ayni ekranda gereksiz coklu Canvas yok.
    Not:
- [ ] PointLight sayisi gereksiz fazla degil.
    Not:
- [ ] Shadows performansi oldurmuyor.
    Not:

## 20. Build / Release QA

- [ ] `pnpm install` sorunsuz.
    Not:
- [ ] `pnpm dev` acilir.
    Not:
- [ ] `pnpm lint` gecer.
    Not:
- [ ] `pnpm build` gecer.
    Not:
- [ ] `pnpm start` build sonrasi calisir.
    Not:
- [ ] AI yoksa env key zorunlu degil.
    Not:
- [ ] Console'da kritik error yok.
    Not:
- [ ] GLB/PNG asset path'leri dogru.
    Not:
- [ ] Asset 404 yok.
    Not:
- [ ] Git status anlasilir, gereksiz dosya karmasasi yok.
    Not:

## 21. MVP Disi Birakilacaklar

Bu maddeler MVP icin basarisizlik sayilmayacak:

- [ ] Auth yok.
- [ ] Database yok.
- [ ] Gercek Gemini entegrasyonu yok.
- [ ] Parent dashboard yok.
- [ ] Student profile yok.
- [ ] Analytics yok.
- [ ] Payment yok.
- [ ] Coklu dil yok.
- [ ] Seslendirme yok.
- [ ] Gercek fizik simulasyonu yok.
- [ ] Yeni devre parcalari yok.
- [ ] Mobil native app yok.
- [ ] Teacher/admin panel yok.

