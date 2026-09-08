import Image from "next/image";
import { Countdown } from "./components/Countdown";
import { RegistrationForm } from "./components/RegistrationForm";

const topicGroups = [
  {
    title: "Kur’ân ve Sünnet Perspektifinde Türbeler",
    items: [
      "Kur’ân-ı Kerîm’de kabir, ölüm ve âhiret tasavvuru",
      "Kur’ân perspektifinde salihlerin hatırasının muhafazası",
      "Hadis literatüründe kabir ve türbe ziyareti",
      "Kabir ziyareti rivayetlerinin tarihî gelişimi",
      "Sahabe ve Tâbiîn döneminde kabir ziyareti",
      "Erken dönem İslâm toplumunda türbe geleneğinin teşekkülü",
    ],
  },
  {
    title: "İslâm Tarihi, Medeniyeti ve Türbe Geleneği",
    items: [
      "İslâm tarihinde türbe geleneğinin ortaya çıkışı",
      "Türk-İslâm medeniyetinde türbe kültürü",
      "Selçuklu, Beylikler ve Osmanlı döneminde türbeler",
      "Osmanlı’da türbeler ve ziyaret kültürü",
      "Anadolu’da evliya türbeleri",
      "Türbeler ve vakıf medeniyeti",
      "Türbelerin hukukî ve idarî tarihi",
    ],
  },
  {
    title: "Fıkıh Perspektifinde Türbeler",
    items: [
      "Mezheplere göre türbe ziyaretinin hükmü",
      "Kabir üzerine yapı inşa etmenin fıkhî boyutu",
      "Türbelerde dua ve ibadet",
      "Adak, nezir ve kurban uygulamaları",
      "Kadınların kabir ziyareti",
      "Kabir başında Kur’ân tilâveti",
      "Bid‘at tartışmaları",
    ],
  },
  {
    title: "Kelâm, Akaid ve İslâm Düşüncesinde Türbeler",
    items: [
      "Tevhid, şirk ve türbe tartışmaları",
      "Tevessül",
      "Teberrük",
      "Şefaat anlayışı",
      "Velâyet ve keramet",
      "Selefî yaklaşımlar",
      "Ehl-i Sünnet geleneğinde türbe anlayışı",
      "Şia’da türbe kültürü",
    ],
  },
  {
    title: "Tasavvuf ve Türbe Kültürü",
    items: [
      "Tasavvuf geleneğinde türbeler",
      "Tekke, zaviye ve türbeler",
      "Evliya kültü",
      "Manevî eğitim",
      "Tasavvuf literatüründe kabir ve ziyaret",
    ],
  },
  {
    title: "Sanat Tarihi, Mimarlık ve Türbeler",
    items: [
      "İslam tarihinde türbelerin ortaya çıkışı",
      "Selçuklu türbe mimarisi",
      "Osmanlı türbe mimarisi",
      "Türbe kitabeleri",
      "Çini ve kalemişi",
      "Türbelerde hat",
      "Hazireler ve mezar taşları",
      "Türbelerde restorasyon ve koruma teknikleri",
    ],
  },
  {
    title: "Türbeler ve Kültürel Miras",
    items: [
      "Türbelerin korunması",
      "UNESCO Dünya Mirası",
      "Dijital belgeleme",
      "Envanter çalışmaları",
      "Vakıf eserleri",
      "Kültürel miras yönetimi",
    ],
  },
  {
    title: "Sosyoloji, Psikoloji ve Antropoloji Perspektifinden Türbeler",
    items: [
      "İnanç sosyolojisi",
      "Halk dindarlığı",
      "Kutsal mekân algısı",
      "Toplumsal hafıza",
      "Manevî iyileşme",
      "Psikolojik boyut",
      "Yerel inanç pratikleri",
      "Türbe ritüelleri ve menkıbeler",
      "Kültürel bellek",
    ],
  },
  {
    title: "Türbeler, Şehir ve Medeniyet",
    items: [
      "Türbeler ve şehir kimliği",
      "Türbelerin şehirleşmeye etkisi",
      "Külliye ve türbe ilişkisi",
      "Tarihî çevre",
      "Hazire kültürü",
      "Kent hafızası",
    ],
  },
  {
    title: "İnanç Turizmi ve Türbeler",
    items: [
      "Türbe turizmi",
      "Ziyaret ekonomisi",
      "Kültür rotaları",
      "Sürdürülebilir turizm",
      "Ziyaretçi deneyimi",
      "Türbelerin tanıtımı",
    ],
  },
  {
    title: "Güncel Tartışmalar ve Dijital Çağda Türbeler",
    items: [
      "Dijital türbe envanterleri",
      "Sanal türbe ziyaretleri",
      "Sosyal medya ve türbeler",
      "Yapay zekâ uygulamaları",
      "Modernleşme",
      "Sekülerleşme",
      "Türbelerin ticarileşmesi",
      "Dijital beşerî bilimler",
    ],
  },
  {
    title: "Türbeler Üzerine Yeni Yaklaşımlar",
    items: [
      "Disiplinlerarası çalışmalar",
      "Karşılaştırmalı türbe araştırmaları",
      "Yeni metodolojiler",
      "Arşiv belgeleri",
      "Yazma eserlerde türbeler",
      "Seyahatnâmelerde türbeler",
      "Biyografi ve menâkıbnâmelerde türbe kültürü",
      "Türbe araştırmalarında yeni perspektifler",
    ],
  },
];

const committeeGroups = [
  {
    title: "Sempozyum Yönetimi / إدارة الملتقى / Symposium Management",
    names: ["Prof. Dr. Ahmet Emre Bilgili", "Dr. Osman Gökmen"],
  },
  {
    title: "Düzenleme Kurulu / لجنة التنظیم / Organizing Committee",
    names: [
      "Cengiz Tomar",
      "Coşkun Yılmaz",
      "Hüseyin Keskin",
      "Ahmet Emre Bilgili",
      "Hayri Baraçlı",
      "Mehmet Ergün Turan",
      "Hayrullah Çelebi",
      "Ekrem Aytar",
      "Mehmet Güney",
      "Osman Kaymak",
      "Süleyman Sarpken",
      "Çetin Şimdi",
      "Osman Gökmen",
    ],
  },
  {
    title: "Bilim Kurulu / اللجنة العلمیة / Scientific Committee",
    names: [
      "Hakkı Önkal",
      "Cengiz Tomar",
      "Ahmet Vefa Çobanoğlu",
      "Ahmet Emre Bilgili",
      "Ahmet Sait Açıkgözoğlu",
      "Selçuk Mülayim",
      "Sadi S. Kucur",
      "Suphi Saatçi",
      "Aziz Doğanay",
      "Abdülhamit Tüfekçioğlu",
      "Halil İbrahim Düzenli",
      "Çiçek Derman",
      "Hilal Kazan",
      "Fatma Nalan Türkmen",
      "Mehmet İpşirli",
      "Mustafa Uzun",
      "Necdet Subaşı",
      "Ali Akben",
      "Cengiz Tomar",
      "Atilla Arkan",
      "Azmi Özcan",
      "Hayati Develi",
      "Necdet Yılmaz",
      "Halil Ekşi",
      "Hatice Kelpetin Arpaguş",
      "Abdurrahman Aliy",
      "Mahmut Erol Kılıç",
      "Osman Gökmen",
      "Abdullah Hikmet Atan",
      "Mustafa İsen",
      "Murteza Bedir",
      "Mustafa Gündüz",
    ],
  },
  {
    title: "Sekreterya / الأمانة العامة / Secretariat",
    names: ["Osman Gökmen"],
  },
];

const importantDates = [
  ["30 Kasım 2026", "Bildiri özeti son gönderim tarihi"],
  ["21 Aralık 2026", "Kabul edilen bildirilerin ilanı"],
  ["1 Mart 2027", "Sempozyum programının ilanı"],
  ["15 Şubat 2027", "Tam metinlerin son gönderim tarihi"],
  ["31 Mart - 1 Nisan 2027", "Uluslararası Türbeler Sempozyumu"],
];

const participationRules = [
  "Başvurular, sempozyumun resmî internet sitesindeki çevrim içi başvuru formu doldurularak gerçekleştirilecektir.",
  "Bildiri başvuruları bireysel bildiri veya panel önerisi şeklinde kabul edilecektir.",
  "Panel önerileri en az dört bildiriden oluşmalıdır. Ortak panel başlığı zorunludur.",
  "Panel başvurularında her panelistin kendi bildiri özetini sisteme ayrı ayrı yüklemesi ve ilgili panel başlığını belirtmesi gerekmektedir.",
  "Her araştırmacı sempozyuma en fazla bir bildiri ile katılabilir.",
  "Ortak yazarlı bildirilerde sunumu gerçekleştirecek yazar belirtilmelidir.",
  "Sempozyumun resmî dilleri Türkçe, Arapça ve İngilizcedir.",
  "Bildirilerin sunum süresi, soru-cevap bölümü hariç 15 dakikadır.",
  "Bildiri özetleri Bilim Kurulu tarafından çift kör hakemlik esasına göre değerlendirilecektir.",
  "Tam metinler en az 3.000, en fazla 8.000 kelime olmalıdır.",
  "Sempozyumda sunulan ve yayıma uygun görülen bildiriler I. Uluslararası Türbeler Sempozyumu Bildirileri adıyla hakemli bildiri kitabında yayımlanacaktır.",
  "Bildiri özetleri ve tam metinler daha önce herhangi bir bilimsel toplantıda sunulmamış ve yayımlanmamış özgün akademik çalışmalar olmalıdır.",
];

const abstractGuide = [
  "Yalnızca belirtilen esaslara uygun hazırlanan bildiri özetleri değerlendirmeye alınacaktır.",
  "Bildiri özeti; konuyu, amacı, kapsamı, yöntemi, temel kaynakları ve özgün katkıyı açık ve özlü biçimde ortaya koymalı; 150-300 kelime arasında olmalıdır.",
  "Bildiri özetleri Türkçe, Arapça veya İngilizce dillerinden biriyle hazırlanabilir.",
  "Her bildiri özeti, çalışmanın içeriğini yansıtan en az 3, en fazla 5 anahtar kelime içermelidir.",
  "Başvuru sırasında yazar adı-soyadı, akademik unvan, kurum, ORCID numarası, e-posta ve telefon bilgileri eksiksiz girilmelidir.",
  "E-posta yoluyla gönderilen başvurular değerlendirmeye alınmayacaktır.",
  "Özetler bilimsel özgünlük, yöntem, konuya uygunluk ve akademik katkı bakımından değerlendirilecektir.",
];

const travelRules = [
  "Sempozyuma katılım ücretsizdir. Bildiri sunacak araştırmacılar ile dinleyicilerden herhangi bir katılım ücreti alınmayacaktır.",
  "Katılımcıların ulaşım, konaklama ve kişisel giderleri kendilerine aittir.",
  "Sempozyum yüz yüze gerçekleştirilecek olup çevrim içi sunum veya uzaktan katılım imkânı bulunmamaktadır.",
];

const faqs = [
  [
    "Sempozyum nerede gerçekleştirilecektir?",
    "I. Uluslararası Türbeler Sempozyumu, 31 Mart - 1 Nisan 2027 tarihlerinde İstanbul’da, Fatih Belediyesi ev sahipliğinde gerçekleştirilecektir.",
  ],
  [
    "Sempozyuma katılım için ücret ödemem gerekiyor mu?",
    "Hayır. Sempozyuma katılım ücretsizdir. Bildiri sunacak araştırmacılar ve dinleyicilerden herhangi bir katılım ücreti talep edilmemektedir.",
  ],
  [
    "Ulaşım ve konaklama giderleri organizasyon tarafından karşılanacak mıdır?",
    "Hayır. Katılımcıların ulaşım, konaklama ve diğer kişisel giderleri kendilerine aittir.",
  ],
  [
    "Sempozyuma çevrim içi katılım mümkün müdür?",
    "Hayır. Sempozyum kapsamında çevrim içi sunum veya uzaktan katılım imkânı bulunmamaktadır. Tüm sunumların yüz yüze gerçekleştirilmesi esastır.",
  ],
  [
    "Sunum yapmadan yalnızca tam metin gönderebilir miyim?",
    "Hayır. Sempozyum programında sözlü olarak sunulmayan bildirilerin tam metinleri değerlendirmeye alınmayacaktır.",
  ],
  [
    "Sempozyuma panel başvurusu yapılabilir mi?",
    "Evet. Sempozyuma bireysel bildiri başvurularının yanı sıra panel başvuruları da kabul edilmektedir. Panel önerilerinin en az dört bildiriden oluşması ve ortak bir panel başlığıyla sunulması gerekmektedir.",
  ],
  [
    "Birden fazla bildiri ile başvuru yapabilir miyim?",
    "Hayır. Her araştırmacı sempozyuma en fazla bir bildiri ile katılabilir.",
  ],
  [
    "Sempozyumun resmî dilleri nelerdir?",
    "Sempozyumun resmî dilleri Türkçe, Arapça ve İngilizcedir.",
  ],
  [
    "Sempozyumda sunulan bildiriler yayımlanacak mıdır?",
    "Evet. Bilim Kurulu ve Yayın Kurulu tarafından hakem değerlendirmesi sonucunda yayımlanmaya uygun bulunan bildiriler, bildiri kitabında yayımlanacaktır.",
  ],
  [
    "Bildiriler nerede yayımlanacaktır?",
    "Kabul edilen tam metinler, editöryal ve hakemlik süreçlerinin tamamlanmasının ardından I. Uluslararası Türbeler Sempozyumu Bildirileri adıyla bildiri kitabında yayımlanacaktır.",
  ],
  [
    "Katılım belgesi verilecek midir?",
    "Evet. Sempozyum programında bildirisini sunan araştırmacılara dijital veya basılı katılım belgesi takdim edilecektir.",
  ],
  [
    "Bildiri özeti ve tam metin için yazım kuralları nerede yer almaktadır?",
    "Bildiri hazırlama esasları ve yazım kuralları sempozyumun resmî internet sitesinde yayımlanacak olup, başvurular bu kurallara uygun şekilde yapılmalıdır.",
  ],
  [
    "Sempozyum programı ne zaman ilan edilecektir?",
    "Bilim Kurulu değerlendirmelerinin tamamlanmasının ardından kesin sempozyum programı resmî internet sitesi üzerinden ilan edilecektir.",
  ],
  [
    "İletişim ve duyurulara nasıl ulaşabilirim?",
    "Sempozyuma ilişkin tüm duyurular, önemli tarihler ve güncel bilgiler resmî sempozyum internet sitesi ve iletişim kanalları aracılığıyla katılımcılarla paylaşılacaktır.",
  ],
];

export default function Home() {
  const topicTitles = topicGroups.map((topic) => topic.title);

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Ana gezinme">
        <a className="brand" href="#top" aria-label="Ana sayfaya dön">
          <Image
            alt="TÜRÇEK"
            className="brand-logo"
            height={758}
            src="/turcek-logo.png"
            width={2073}
          />
        </a>
        <nav>
          <a href="#cagri">Tebliğ Çağrısı</a>
          <a href="#konular">Konu Başlıkları</a>
          <a href="#kurullar">Kurullar</a>
          <a href="#bilgiler">Sempozyum Bilgileri</a>
          <a href="#tarihler">Tarihler</a>
          <a href="#basvuru">Başvurular</a>
          <a href="#iletisim">İletişim</a>
        </nav>
        <a className="header-apply" href="#basvuru">
          Başvuru
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <Image alt="" fill priority sizes="100vw" src="/hero-turbeler.png" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-kicker">
            <span>TÜRÇEK tarafından</span>
            <span>Fatih Belediyesi ev sahipliğinde</span>
            <span>İstanbul</span>
          </div>
          <h1 id="hero-title">Uluslararası Türbeler Sempozyumu</h1>
          <p className="hero-subtitle">
            <span>Geçmişten Geleceğe Türbe Kültürü</span>
            <span>
              Türbeleri dinî ilimler, şehir hafızası, mimari ve kültürel miras
              ekseninde yeniden düşünmeye davet.
            </span>
          </p>
          <p className="hero-date">
            <span>31 Mart - 1 Nisan 2027</span>
            <span>International Symposium on Mausoleums-I</span>
            <span dir="rtl" lang="ar">المؤتمر الدولي الأول للأضرحة الإسلامية</span>
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#cagri">
              Keşfet
            </a>
            <a className="secondary-action" href="#basvuru">
              Başvuru Yap
            </a>
          </div>
        </div>
        <div className="hero-timebar">
          <div className="timebar-heading">
            <span>Başlangıca Kalan Süre</span>
            <strong>31 Mart 2027, İstanbul</strong>
          </div>
          <Countdown targetDate="2027-03-31T09:00:00+03:00" />
          <dl className="hero-facts" aria-label="Sempozyum özeti">
            <div>
              <dt>Tarih</dt>
              <dd>31 Mart - 1 Nisan 2027</dd>
            </div>
            <div>
              <dt>Yer</dt>
              <dd>İstanbul</dd>
            </div>
            <div>
              <dt>Diller</dt>
              <dd>Türkçe / Arapça / İngilizce</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="intro-band" id="cagri">
        <div className="section-heading">
          <p className="eyebrow">Sempozyum Tebliğ Çağrısı</p>
          <h2>Türbe kültürünü din, tarih, mimari ve kültürel miras ekseninde yeniden düşünmek</h2>
        </div>
        <div className="intro-copy">
          <p>Değerli Araştırmacı,</p>
          <p>
            İslâm medeniyetinin dinî, tarihî ve kültürel mirasının önemli
            unsurlarından biri olan türbeler; mimarîden sanat tarihine,
            tasavvuftan vakıf kültürüne, şehir tarihinden toplumsal hafızaya
            kadar pek çok disiplinin ortak araştırma alanını oluşturmaktadır.
            Bununla birlikte özellikle dinî ilimler ve dijital beşerî bilimler
            ekseninde türbe çalışmalarının disiplinler arası yaklaşımlarla
            geliştirilmesine ihtiyaç duyulmaktadır.
          </p>
          <p>
            Bu doğrultuda TÜRÇEK tarafından, Fatih Belediyesi ev sahipliğinde
            ve çeşitli kamu kurumlarının katkılarıyla 31 Mart–1 Nisan 2027
            tarihlerinde İstanbul’da “Geçmişten Geleceğe Türbe Kültürü” ana
            temasıyla I. Uluslararası Türbeler Sempozyumu düzenlenecektir.
          </p>
          <p>
            Sempozyumda; türbelerin dinî kaynaklardaki yeri, tarihî gelişimi,
            mimarî ve sanat özellikleri, tasavvuf ve vakıf geleneği, kültürel
            miras, şehir tarihi, sosyolojik ve psikolojik boyutları ile dijital
            çağda türbe kültürü farklı disiplinlerden araştırmacıların
            katkılarıyla ele alınacaktır.
          </p>
          <p>
            Bilim Kurulu tarafından kabul edilen bildiriler, sempozyumda
            sunulmasının ardından hakem ve editöryal değerlendirme süreçleri
            tamamlanarak bildiri kitabında yayımlanacaktır.
          </p>
          <p>
            Türbe araştırmalarına katkı sağlayacak özgün çalışmalarınızla I.
            Uluslararası Türbeler Sempozyumu’na iştirakinizden memnuniyet
            duyacağız.
          </p>
        </div>
      </section>

      <section className="info-section" id="bilgiler">
        <div className="section-heading">
          <p className="eyebrow">Sempozyum Bilgileri</p>
          <h2>Yer, tarih ve kurumsal katkı</h2>
        </div>
        <div className="intro-copy info-copy">
          <p>
            Uluslararası Türbeler Sempozyumu, Türbeler-Çeşmeler Taşınır ve
            Taşınmaz Kültür Varlıklarını Koruma ve Yaşatma Derneği (TÜRÇEK)
            tarafından, Fatih Belediyesi ev sahipliğinde; İstanbul Valiliği,
            İstanbul İl Kültür ve Turizm Müdürlüğü, Türkiye Yazma Eserler
            Kurumu Başkanlığı, Kocaeli Büyükşehir Belediyesi ve diğer paydaş
            kurumların katkılarıyla gerçekleştirilecektir.
          </p>
          <p>
            Sempozyum 31 Mart - 1 Nisan 2027 tarihlerinde İstanbul’da yüz yüze
            düzenlenecektir.
          </p>
        </div>
      </section>

      <section className="topics-section" id="konular">
        <div className="section-heading">
          <p className="eyebrow">Konu Başlıkları</p>
          <h2>Başvuru yapılabilecek akademik alanlar</h2>
        </div>
        <div className="topic-grid">
          {topicGroups.map((topic, index) => (
            <article className="topic-card" key={topic.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic.title}</h3>
              <ul>
                {topic.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section" id="tarihler">
        <div className="section-heading">
          <p className="eyebrow">Önemli Tarihler</p>
          <h2>Başvurudan tam metne uzanan takvim</h2>
        </div>
        <div className="timeline">
          {importantDates.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rules-section">
        <div className="section-heading">
          <p className="eyebrow">Katılım Şartları</p>
          <h2>Başvuru ve sunum esasları</h2>
        </div>
        <div className="rules-grid">
          {participationRules.map((rule) => (
            <article key={rule}>
              <p>{rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" id="ozet-kilavuzu">
        <div className="section-heading">
          <p className="eyebrow">Özet Kılavuzu</p>
          <h2>Bildiri özeti hazırlama ilkeleri</h2>
        </div>
        <div className="rules-grid">
          {abstractGuide.map((rule) => (
            <article key={rule}>
              <p>{rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section" id="ulasim-konaklama">
        <div className="section-heading">
          <p className="eyebrow">Ulaşım ve Konaklama</p>
          <h2>Katılım ücretsizdir</h2>
        </div>
        <div className="rules-grid">
          {travelRules.map((rule) => (
            <article key={rule}>
              <p>{rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="committee-section" id="kurullar">
        <div className="section-heading">
          <p className="eyebrow">Kurullar</p>
          <h2>Akademik ve kurumsal yapı</h2>
        </div>
        <div className="committee-grid">
          {committeeGroups.map((group) => (
            <article className="committee-card" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.names.map((name, index) => (
                  <li key={`${name}-${index}`}>{name}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" id="sss">
        <div className="section-heading">
          <p className="eyebrow">Sık Sorulan Sorular</p>
          <h2>Başvuru öncesi kısa bilgiler</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="application-section" id="basvuru">
        <div className="section-heading">
          <p className="eyebrow">Başvurular</p>
          <h2>Bildiri veya panel önerinizle katılın</h2>
          <p>
            Formu doldurduğunuzda başvurunuz sempozyum kayıt havuzuna
            iletilir. Özet metni 150-300 kelime aralığında olmalı ve 3-5
            anahtar kelime içermelidir. Panel önerileri için ortak panel
            başlığı ve en az dört tebliğci bilgisi zorunludur.
          </p>
        </div>
        <RegistrationForm topics={topicTitles} />
      </section>

      <footer className="site-footer" id="iletisim">
        <div>
          <p className="eyebrow">İletişim</p>
          <h2>Türbeler-Çeşmeler Kültür Varlıklarını Koruma ve Yaşatma Derneği</h2>
          <p>
            Sempozyumla ilgili sorularınız için sekretarya ile iletişime
            geçebilirsiniz.
          </p>
        </div>
        <address>
          <a href="mailto:info@turbeler.org.tr">info@turbeler.org.tr</a>
          <span>İstanbul / Türkiye</span>
          <span>Fatih Belediyesi ev sahipliğinde yüz yüze gerçekleştirilecektir.</span>
        </address>
      </footer>
    </main>
  );
}
