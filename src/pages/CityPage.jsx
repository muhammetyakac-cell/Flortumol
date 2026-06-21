import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { buildBreadcrumbSchema } from '../utils/seo';
import { BLOG_POSTS } from './blog/blogData';

const ALLOWED_CITIES = [
  'adana', 'adıyaman', 'afyonkarahisar', 'ağrı', 'aksaray', 'amasya',
  'ankara', 'antalya', 'ardahan', 'artvin', 'aydın', 'balıkesir',
  'bartın', 'batman', 'bayburt', 'bilecik', 'bingöl', 'bitlis',
  'bolu', 'burdur', 'bursa', 'çanakkale', 'çankırı', 'çorum',
  'denizli', 'diyarbakır', 'düzce', 'edirne', 'elazığ', 'erzincan',
  'erzurum', 'eskişehir', 'gaziantep', 'giresun', 'gümüşhane', 'hakkari',
  'hatay', 'ığdır', 'ısparta', 'istanbul', 'izmir', 'kahramanmaraş',
  'karabük', 'karaman', 'kars', 'kastamonu', 'kayseri', 'kırıkkale',
  'kırklareli', 'kırşehir', 'kilis', 'kocaeli', 'konya', 'kütahya',
  'malatya', 'manisa', 'mardin', 'mersin', 'muğla', 'muş',
  'nevşehir', 'niğde', 'ordu', 'osmaniye', 'rize', 'sakarya',
  'samsun', 'siirt', 'sinop', 'sivas', 'şanlıurfa', 'şırnak',
  'tekirdağ', 'tokat', 'trabzon', 'tunceli', 'uşak', 'van',
  'yalova', 'yozgat', 'zonguldak',
];

const CITY_DESCRIPTIONS = {
  'adana': 'Sıcakkanlı insanlarıyla ünlü Adana\'da yeni arkadaşlıklar kurmak hiç bu kadar kolay olmamıştı.',
  'adıyaman': 'Tarihi Nemrut Dağı ile ünlü Adıyaman\'da yeni dostluklar kurmak için doğru platformdasın.',
  'afyonkarahisar': 'Termal suları ve doğal güzellikleriyle Afyonkarahisar\'da sıcak sohbetlere başla.',
  'ağrı': 'Ağrı Dağı\'nın gölgesinde, Doğu\'nun samimi insanlarıyla tanışmanın en kolay yolu Sevgili Bul.',
  'aksaray': 'İç Anadolu\'nun kalbi Aksaray\'da yeni insanlarla tanış, samimi sohbetler et.',
  'amasya': 'Yeşilırmak kıyısında tarihi evleriyle ünlü Amasya\'da romantik bir başlangıç yap.',
  'ankara': 'Başkent Ankara\'da, Çankaya\'dan Kızılay\'a kadar her semtte yeni arkadaşlıklar kurmanın tam zamanı.',
  'antalya': 'Güney sahilinin parlayan yıldızı Antalya\'da, plaj keyfi ve sohbet bir arada.',
  'ardahan': 'Doğu\'nun huzur dolu şehri Ardahan\'da yeni dostluklar kurmaya hazır ol.',
  'artvin': 'Karadeniz\'in yemyeşil şehri Artvin\'de doğayla iç içe yeni bağlantılar kur.',
  'aydın': 'Ege\'nin incisi Aydın\'da, Didim ve Kuşadası sahillerinde yeni insanlarla tanış.',
  'balıkesir': 'Marmara ve Ege\'nin buluştuğu Balıkesir\'de yeni arkadaşlıklar kurmak çok kolay.',
  'bartın': 'Karadeniz\'in sakin şehri Bartın\'da huzurlu sohbetler için hemen katıl.',
  'batman': 'Güneydoğu\'nun yükselen şehri Batman\'da yeni dostluklar kurmanın tam zamanı.',
  'bayburt': 'Doğu Karadeniz\'in huzur dolu şehri Bayburt\'ta samimi sohbetlere başla.',
  'bilecik': 'Osmanlı\'nın kurulduğu topraklarda, Bilecik\'te yeni insanlarla tanış.',
  'bingöl': 'Doğu\'nun samimi şehri Bingöl\'de gerçek arkadaşlıklar kurmak için hemen katıl.',
  'bitlis': 'Tarihi ve kültürel zenginlikleriyle Bitlis\'te yeni dostluklar kur.',
  'bolu': 'Doğal güzellikleri ve yeşil doğasıyla Bolu\'da romantik anlar yaşamaya hazır ol.',
  'burdur': 'Göller bölgesinin incisi Burdur\'da sakin ve huzurlu sohbetlere başla.',
  'bursa': 'Yeşil Bursa\'da, Uludağ eteklerinde yeni insanlarla tanışmanın en keyifli yolu Sevgili Bul.',
  'çanakkale': 'Tarihi Gelibolu yarımadası ve doğal güzellikleriyle Çanakkale\'de yeni dostluklar kur.',
  'çankırı': 'İç Anadolu\'nun sakin şehri Çankırı\'da samimi sohbetlere başla.',
  'çorum': 'Hititlerin başkenti Çorum\'da tarihi bir atmosferde yeni insanlarla tanış.',
  'denizli': 'Pamukkale\'nin travertenleriyle ünlü Denizli\'de yeni arkadaşlıklar kurmanın tam zamanı.',
  'diyarbakır': 'Güneydoğu\'nun metropolü Diyarbakır\'da, surları ve tarihiyle yeni dostluklar kur.',
  'düzce': 'Karadeniz\'e yakınlığı ve doğal güzellikleriyle Düzce\'de yeni sohbetlere başla.',
  'edirne': 'Osmanlı\'nın başkenti Edirne\'de tarihi mekanlar eşliğinde yeni insanlarla tanış.',
  'elazığ': 'Fırat Nehri kenarında, Elazığ\'da sıcak sohbetler ve yeni dostluklar seni bekliyor.',
  'erzincan': 'Doğu Anadolu\'nun huzur dolu şehri Erzincan\'da samimi dostluklar kur.',
  'erzurum': 'Kış sporlarının başkenti Erzurum\'da, Palandöken eteklerinde yeni insanlarla tanış.',
  'eskişehir': 'Öğrenci şehri Eskişehir\'de, genç ve dinamik bir toplulukla tanışmaya hazır ol.',
  'gaziantep': 'Gastronomi başkenti Gaziantep\'te, lezzetli sohbetler ve yeni dostluklar seni bekliyor.',
  'giresun': 'Karadeniz\'in fındık diyarı Giresun\'da doğal güzellikler eşliğinde sohbet et.',
  'gümüşhane': 'Karadeniz\'in tarihi şehri Gümüşhane\'de huzurlu sohbetlere başla.',
  'hakkari': 'Doğu\'nun en güzel şehirlerinden Hakkâri\'de yeni dostluklar kur.',
  'hatay': 'Medeniyetler beşiği Hatay\'da, eşsiz mutfağı ve sıcak insanlarıyla yeni dostluklar kur.',
  'ığdır': 'Doğu\'nun bereketli topraklarında Iğdır\'da yeni arkadaşlıklar kur.',
  'ısparta': 'Güller diyarı Isparta\'da romantik sohbetlere başlamak için doğru yerdesin.',
  'istanbul': 'Türkiye\'nin en kalabalık şehri İstanbul\'da, Boğaz manzaralı sohbetler için binlerce aktif kullanıcı seni bekliyor.',
  'izmir': 'Ege\'nin incisi İzmir\'de, Kordon boyunda romantik sohbetlere başlamak için hemen katıl.',
  'kahramanmaraş': 'Dondurması ve tarihiyle ünlü Kahramanmaraş\'ta yeni dostluklar kur.',
  'karabük': 'Safranbolu evleriyle ünlü Karabük\'te tarihi bir atmosferde yeni insanlarla tanış.',
  'karaman': 'İç Anadolu\'nun sakin şehri Karaman\'da yeni arkadaşlıklar kur.',
  'kars': 'Kafkasların incisi Kars\'ta, Ani Harabeleri eşliğinde yeni dostluklar kur.',
  'kastamonu': 'Karadeniz\'in tarihi şehri Kastamonu\'da doğal güzellikler eşliğinde sohbet et.',
  'kayseri': 'Kapadokya\'ya açılan kapı Kayseri\'de, Erciyes Dağı eşliğinde yeni bağlantılar kur.',
  'kırıkkale': 'İç Anadolu\'nun sanayi şehri Kırıkkale\'de yeni insanlarla tanış.',
  'kırklareli': 'Trakya\'nun huzur dolu şehri Kırklareli\'nde yeni dostluklar kur.',
  'kırşehir': 'İç Anadolu\'nun kültür şehri Kırşehir\'de yeni arkadaşlıklar kur.',
  'kilis': 'Güneydoğu\'nun küçük ama samimi şehri Kilis\'te yeni dostluklar kur.',
  'kocaeli': 'İstanbul\'a yakınlığı ve doğal güzellikleriyle Kocaeli\'nde yeni sohbetlere başla.',
  'konya': 'Konya\'nın samimi atmosferinde, gerçek arkadaşlıklar için doğru platformdasın.',
  'kütahya': 'Çini ve seramikleriyle ünlü Kütahya\'da sanat dolu sohbetlere başla.',
  'malatya': 'Kayısı diyarı Malatya\'da lezzetli sohbetler ve yeni dostluklar seni bekliyor.',
  'manisa': 'Ege\'nin bereketli topraklarında Manisa\'da yeni insanlarla tanışmanın tam zamanı.',
  'mardin': 'Taş işçiliği ve tarihi dokusuyla Mardin\'de büyüleyici bir atmosferde yeni dostluklar kur.',
  'mersin': 'Akdeniz\'in incisi Mersin\'de, sıcak sohbetler ve yeni yüzler için hemen katıl.',
  'muğla': 'Bodrum, Fethiye ve Marmaris ile ünlü Muğla\'da tatil havasında sohbetler seni bekliyor.',
  'muş': 'Doğu Anadolu\'nun sakin şehri Muş\'ta yeni arkadaşlıklar kur.',
  'nevşehir': 'Peri bacalarıyla ünlü Nevşehir\'de, Kapadokya\'nın büyüleyici atmosferinde yeni insanlarla tanış.',
  'niğde': 'İç Anadolu\'nun huzur dolu şehri Niğde\'de yeni dostluklar kur.',
  'ordu': 'Karadeniz\'in mavisi ve yeşili bir arada sunduğu Ordu\'da yeni bağlantılar kur.',
  'osmaniye': 'Akdeniz\'e yakınlığı ve doğal güzellikleriyle Osmaniye\'de yeni sohbetlere başla.',
  'rize': 'Çay bahçeleri ve yaylalarıyla ünlü Rize\'de doğal güzellikler eşliğinde sohbet et.',
  'sakarya': 'Doğal güzellikleri ve İstanbul\'a yakınlığıyla Sakarya\'da yeni arkadaşlıklar kur.',
  'samsun': 'Karadeniz\'in en büyük şehri Samsun\'da, sahil boyunca yeni dostluklar kur.',
  'siirt': 'Güneydoğu\'nun samimi şehri Siirt\'te yeni arkadaşlıklar kurmak için hemen katıl.',
  'sinop': 'Karadeniz\'in huzur dolu şehri Sinop\'ta, tarihi cezaevi ve sahiliyle yeni dostluklar kur.',
  'sivas': 'İç Anadolu\'nun tarihi şehri Sivas\'ta, Kongre binası ve medreseleriyle kültür dolu sohbetler.',
  'şanlıurfa': 'Tarihin sıfır noktası Göbeklitepe\'nin şehri Şanlıurfa\'da yeni dostluklar kur.',
  'şırnak': 'Doğu\'nun zorlu ama güzel coğrafyasında Şırnak\'ta yeni arkadaşlıklar kur.',
  'tekirdağ': 'Marmara\'nın incisi Tekirdağ\'da, şarapları ve sahiliyle romantik sohbetlere başla.',
  'tokat': 'Karadeniz\'e yakın İç Anadolu şehri Tokat\'ta tarihi ve doğal güzellikler eşliğinde sohbet et.',
  'trabzon': 'Karadeniz\'in incisi Trabzon\'da, doğal güzellikler eşliğinde yeni bağlantılar kur.',
  'tunceli': 'Doğu\'nun huzur dolu şehri Tunceli\'de doğayla iç içe yeni dostluklar kur.',
  'uşak': 'Ege\'nin iç kesiminde huzurlu bir şehir olan Uşak\'ta yeni arkadaşlıklar kur.',
  'van': 'Van Gölü\'nün eşsiz manzarası eşliğinde, Van\'da yeni dostluklar kurmanın tam zamanı.',
  'yalova': 'Termal suları ve doğal güzellikleriyle Yalova\'da huzurlu sohbetlere başla.',
  'yozgat': 'İç Anadolu\'nun tarihi şehri Yozgat\'ta yeni arkadaşlıklar kur.',
  'zonguldak': 'Karadeniz\'in kömür şehri Zonguldak\'ta sahilde yeni dostluklar kur.',
};

const CITY_FACTS = {
  'adana': `Adana, 2.2 milyon nüfusu ve sıcakkanlı insanlarıyla ünlüdür. Kebap ve şalgam eşliğinde flört etmek isteyenler için ideal bir şehirdir.`,
  'adıyaman': `Adıyaman, 635 bin nüfusu ve Nemrut Dağı'nın eşsiz manzarasıyla flört için huzurlu bir ortam sunar.`,
  'afyonkarahisar': `Afyonkarahisar, 745 bin nüfusu ve termal tesisleriyle romantik kaçamaklar için idealdir.`,
  'ağrı': `Ağrı, 510 bin nüfusu ve Türkiye'nin en yüksek dağına ev sahipliği yapmasıyla bilinir.`,
  'aksaray': `Aksaray, 430 bin nüfusu ve Ihlara Vadisi gibi doğal güzellikleriyle flört için huzurlu bir ortam sunar.`,
  'amasya': `Amasya, 340 bin nüfusu ve Yalıboyu evleriyle Türkiye'nin en romantik şehirlerinden biridir.`,
  'ankara': `Başkent Ankara, 5.7 milyon nüfusu ve 25 üniversitesiyle genç bir flört potansiyeline sahiptir.`,
  'antalya': `Antalya, yılda 15 milyon turist ağırlayan ve flörtün en canlı olduğu şehirlerdendir.`,
  'ardahan': `Ardahan, 92 bin nüfusu ve doğal güzellikleriyle sakin bir flört ortamı sunar.`,
  'artvin': `Artvin, 172 bin nüfusu ve eşsiz doğasıyla doğa tutkunları için ideal bir flört şehridir.`,
  'aydın': `Aydın, 1.1 milyon nüfusu ve tarihi Efes kalıntılarıyla kültür dolu bir flört deneyimi sunar.`,
  'balıkesir': `Balıkesir, 1.2 milyon nüfusu ve Ayvalık, Edremit gibi tatil beldeleriyle flört için idealdir.`,
  'bartın': `Bartın, 203 bin nüfusu ve Amasra'nın eşsiz plajlarıyla romantik bir kaçamak sunar.`,
  'batman': `Batman, 630 bin nüfusu ve petrol rafinerisiyle tanınan dinamik bir şehirdir.`,
  'bayburt': `Bayburt, 85 bin nüfusu ve tarihi Bayburt Kalesi ile sakin bir flört ortamı sunar.`,
  'bilecik': `Bilecik, 228 bin nüfusu ve tarihi dokusuyla kültürel bir flört deneyimi sunar.`,
  'bingöl': `Bingöl, 283 bin nüfusu ve doğal güzellikleriyle huzurlu bir ortam sunar.`,
  'bitlis': `Bitlis, 350 bin nüfusu ve Nemrut Krater Gölü ile eşsiz bir doğa deneyimi sunar.`,
  'bolu': `Bolu, 320 bin nüfusu ve Abant Gölü, Yedigöller gibi doğa harikalarıyla ünlüdür.`,
  'burdur': `Burdur, 270 bin nüfusu ve Salda Gölü ile Türkiye'nin Maldivleri olarak bilinir.`,
  'bursa': `Bursa, 3.1 milyon nüfusu ve doğal güzellikleriyle flört için ideal bir şehirdir.`,
  'çanakkale': `Çanakkale, 540 bin nüfusu ve Truva Antik Kenti ile tarih dolu bir flört deneyimi sunar.`,
  'çankırı': `Çankırı, 205 bin nüfusu ve tuz mağaralarıyla ünlü bir şehirdir.`,
  'çorum': `Çorum, 526 bin nüfusu ve Hitit medeniyetinin izleriyle tarihi bir flört ortamı sunar.`,
  'denizli': `Denizli, 1 milyon nüfusu ve Pamukkale travertenleriyle dünyaca ünlü bir turizm şehridir.`,
  'diyarbakır': `Diyarbakır, 1.8 milyon nüfusu ve UNESCO mirası surlarıyla Güneydoğu'nun en büyük şehridir.`,
  'düzce': `Düzce, 400 bin nüfusu ve doğal güzellikleriyle keşfedilmeyi bekleyen bir şehirdir.`,
  'edirne': `Edirne, 410 bin nüfusu ve Selimiye Camii ile tarihi bir flört deneyimi sunar.`,
  'elazığ': `Elazığ, 595 bin nüfusu ve Hazar Gölü ile doğal güzellikleri bir arada sunar.`,
  'erzincan': `Erzincan, 240 bin nüfusu ve Munzur Dağları'nın eteklerinde doğal bir güzelliğe sahiptir.`,
  'erzurum': `Erzurum, 760 bin nüfusu ve Palandöken Kayak Merkezi ile kış aylarında flörtün en canlı olduğu şehirdir.`,
  'eskişehir': `Eskişehir, 900 bin nüfusu ve iki üniversitesiyle Türkiye'nin en genç şehirlerindendir.`,
  'gaziantep': `Gaziantep, 2.1 milyon nüfusu ve UNESCO gastronomi şehri unvanıyla ünlüdür.`,
  'giresun': `Giresun, 460 bin nüfusu ve fındık üretimiyle ünlü yeşil bir Karadeniz şehridir.`,
  'gümüşhane': `Gümüşhane, 150 bin nüfusu ve tarihi gümüş madenleriyle ünlüdür.`,
  'hakkari': `Hakkâri, 280 bin nüfusu ve Cilo Dağları ile doğal güzellikleriyle ünlüdür.`,
  'hatay': `Hatay, 1.6 milyon nüfusu ve UNESCO gastronomi şehri unvanıyla kültür ve lezzet dolu bir flört deneyimi sunar.`,
  'ığdır': `Iğdır, 200 bin nüfusu ve Ağrı Dağı manzarasıyla eşsiz bir konuma sahiptir.`,
  'ısparta': `Isparta, 440 bin nüfusu ve gül üretimiyle ünlü, romantik bir Akdeniz şehridir.`,
  'istanbul': `15 milyonu aşkın nüfusuyla İstanbul, Türkiye'nin en büyük ve en hareketli flört şehridir.`,
  'izmir': `İzmir, 4.4 milyon nüfusu ve Ege'nin en romantik şehri olarak bilinir.`,
  'kahramanmaraş': `Kahramanmaraş, 1.1 milyon nüfusu ve meşhur Maraş dondurmasıyla ünlüdür.`,
  'karabük': `Karabük, 250 bin nüfusu ve UNESCO mirası Safranbolu evleriyle ünlüdür.`,
  'karaman': `Karaman, 260 bin nüfusu ve tarihi Taşkale ile kültürel bir geçmişe sahiptir.`,
  'kars': `Kars, 285 bin nüfusu ve tarihi Ani Harabeleri ile ünlü bir Doğu şehridir.`,
  'kastamonu': `Kastamonu, 385 bin nüfusu ve Ilgaz Dağı Milli Parkı ile doğa tutkunları için idealdir.`,
  'kayseri': `Kayseri, 1.4 milyon nüfusu ve Erciyes Kayak Merkezi ile kış ve yaz aylarında flört imkanı sunar.`,
  'kırıkkale': `Kırıkkale, 275 bin nüfusu ve savunma sanayisiyle tanınan bir şehirdir.`,
  'kırklareli': `Kırklareli, 370 bin nüfusu ve doğal güzellikleriyle Trakya'nın en yeşil şehirlerindendir.`,
  'kırşehir': `Kırşehir, 240 bin nüfusu ve Ahi Evran ile özdeşleşmiş bir kültür şehridir.`,
  'kilis': `Kilis, 147 bin nüfusu ve zengin mutfağıyla ünlü bir sınır şehridir.`,
  'kocaeli': `Kocaeli, 2 milyon nüfusu ve İstanbul'a komşu konumuyla aktif bir flört hayatı sunar.`,
  'konya': `Konya, 2.3 milyon nüfusu ve köklü tarihiyle Anadolu'nun kalbidir.`,
  'kütahya': `Kütahya, 575 bin nüfusu ve çini sanatıyla ünlü bir kültür şehridir.`,
  'malatya': `Malatya, 800 bin nüfusu ve dünyaca ünlü kayısısıyla bilinen bir Doğu şehridir.`,
  'manisa': `Manisa, 1.4 milyon nüfusu ve Mesir Macunu festivaliyle ünlüdür.`,
  'mardin': `Mardin, 860 bin nüfusu ve taş evleriyle UNESCO mirası adayı bir şehirdir.`,
  'mersin': `Mersin, 1.9 milyon nüfusu ve uzun sahil şeridiyle Akdeniz'in en romantik şehirlerindendir.`,
  'muğla': `Muğla, 1 milyon nüfusu ve turistik ilçeleriyle Türkiye'nin tatil başkentlerinden biridir.`,
  'muş': `Muş, 390 bin nüfusu ve verimli ovalarıyla tarım ve hayvancılıkta önemli bir şehirdir.`,
  'nevşehir': `Nevşehir, 310 bin nüfusu ve Kapadokya bölgesiyle dünyaca ünlü bir turizm şehridir.`,
  'niğde': `Niğde, 365 bin nüfusu ve Melendiz Dağı ile doğal güzelliklere sahiptir.`,
  'ordu': `Ordu, 775 bin nüfusu ve Boztepe'nin eşsiz manzarasıyla Karadeniz'in en güzel şehirlerindendir.`,
  'osmaniye': `Osmaniye, 560 bin nüfusu ve Karatepe Aslantaş Açık Hava Müzesi ile tarihi bir şehirdir.`,
  'rize': `Rize, 345 bin nüfusu ve çay üretimiyle Türkiye'nin en yeşil şehirlerinden biridir.`,
  'sakarya': `Sakarya, 1 milyon nüfusu ve Sapanca Gölü ile doğal güzellikleri bir arada sunar.`,
  'samsun': `Samsun, 1.3 milyon nüfusu ve Kurtuluş Savaşı'nın başkenti olarak tarihi öneme sahiptir.`,
  'siirt': `Siirt, 335 bin nüfusu ve meşhur Siirt battaniyesi ile ünlüdür.`,
  'sinop': `Sinop, 220 bin nüfusu ve Cezaevi Müzesi ile tarihi bir Karadeniz şehridir.`,
  'sivas': `Sivas, 640 bin nüfusu ve 4 Eylül Kongresi'ne ev sahipliği yapmasıyla tarihi öneme sahiptir.`,
  'şanlıurfa': `Şanlıurfa, 2.1 milyon nüfusu ve Göbeklitepe ile insanlık tarihinin en eski yerleşimine ev sahipliği yapar.`,
  'şırnak': `Şırnak, 550 bin nüfusu ve Cudi Dağı ile doğal güzelliklere sahiptir.`,
  'tekirdağ': `Tekirdağ, 1.1 milyon nüfusu ve meşhur köftesiyle ünlü bir Trakya şehridir.`,
  'tokat': `Tokat, 610 bin nüfusu ve tarihi Tokat Kalesi ile ünlü bir şehirdir.`,
  'trabzon': `Trabzon, 820 bin nüfusu ve Sümela Manastırı ile tarihi bir Karadeniz şehridir.`,
  'tunceli': `Tunceli, 83 bin nüfusu ve Munzur Vadisi Milli Parkı ile doğal güzellikleriyle ünlüdür.`,
  'uşak': `Uşak, 375 bin nüfusu ve tarihi Uşak Halıları ile ünlüdür.`,
  'van': `Van, 1.1 milyon nüfusu ve Van Gölü ile Akdamar Adası'nın eşsiz güzelliğine sahiptir.`,
  'yalova': `Yalova, 295 bin nüfusu ve termal tesisleriyle İstanbul'a en yakın kaçış noktalarından biridir.`,
  'yozgat': `Yozgat, 420 bin nüfusu ve Çamlık Milli Parkı ile doğal güzelliklere sahiptir.`,
  'zonguldak': `Zonguldak, 590 bin nüfusu ve kömür madenleriyle tanınan bir Karadeniz şehridir.`,
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toLocaleUpperCase('tr-TR') + str.slice(1).toLocaleLowerCase('tr-TR');
}

export default function CityPage({ setMode, setShowAuthModal }) {
  const { city } = useParams();
  const slug = city?.toLowerCase();

  if (!slug || !ALLOWED_CITIES.includes(slug)) {
    return <Navigate to="/" replace />;
  }

  const cityName = capitalize(slug);
  const description = CITY_DESCRIPTIONS[slug] || `${cityName} şehrinden yeni insanlarla tanışın, canlı sohbet edin. ${cityName} arkadaşlık platformu.`;
  const fact = CITY_FACTS[slug] || '';

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: `${cityName}`, path: `/${slug}` },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  const otherCities = ALLOWED_CITIES.filter((c) => c !== slug).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      <SEO
        title={`${cityName}'da Arkadaşlık ve Sohbet - Sevgili Bul`}
        description={description}
        canonical={`/${slug}`}
      >
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Sevgili Bul - ${cityName}`,
          areaServed: { '@type': 'City', name: cityName, sameAs: `https://tr.wikipedia.org/wiki/${encodeURIComponent(cityName)}` },
          provider: { '@type': 'Organization', name: 'Sevgili Bul' },
        })}</script>
      </SEO>

      <section className="relative text-center py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-200/30 rounded-full blur-3xl -z-10" />
        <nav className="text-sm text-slate-500 mb-8" aria-label="Sayfa yolu">
          <Link to="/" className="hover:text-pink-400 transition">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">{cityName}</span>
        </nav>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          {cityName}'da Yeni İnsanlarla Tanış,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">Canlı Sohbet Et</span>
        </h1>
        <p className="mt-6 text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        {fact && (
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto italic">
            {fact}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => { setMode('user'); setShowAuthModal(true); }}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white text-lg font-bold rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-100"
          >
            Hemen Ücretsiz Katıl ✦
          </button>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">{cityName} Profil Önerileri</h2>
          <p className="text-center text-slate-400 font-medium mb-10">{cityName}'dan her gün onlarca yeni üye katılıyor. Onlarla tanışmak için profillere göz at!</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Alara', age: 24, emoji: '🌸' },
              { name: 'Defne', age: 22, emoji: '✨' },
              { name: 'Lina', age: 26, emoji: '💫' },
              { name: 'Mira', age: 23, emoji: '🌺' },
              { name: 'Selin', age: 25, emoji: '🌟' },
              { name: 'Naz', age: 21, emoji: '🌙' },
            ].map((profile, i) => (
              <article
                key={i}
                className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => setShowAuthModal(true)}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  {profile.emoji}
                </div>
                <p className="font-bold text-white text-sm">{profile.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.age} · {cityName}</p>
                <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Çevrimiçi" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {fact && (
        <section className="py-12 px-4 bg-slate-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{cityName} Hakkında</h2>
            <p className="text-slate-400 leading-relaxed">{fact}</p>
          </div>
        </section>
      )}

      {BLOG_POSTS.find((p) => p.slug === `${slug}-flort-rehberi`) && (
        <section className="py-12 px-4 bg-slate-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{cityName} Flört Rehberi</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {cityName}'da flört ederken keşfedebileceğin en romantik mekanlar ve aktiviteler hakkında detaylı rehberimizi okuyun.
            </p>
            <Link
              to={`/blog/${slug}-flort-rehberi`}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              {cityName} Flört Rehberi →
            </Link>
          </div>
        </section>
      )}

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Diğer Şehirleri Keşfet</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherCities.map((other) => (
              <Link
                key={other}
                to={`/${other}`}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-full text-sm font-medium hover:bg-slate-700 hover:text-white transition border border-slate-700"
              >
                {capitalize(other)}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
