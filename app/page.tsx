import { RegistrationForm } from "./components/RegistrationForm";

const topicGroups = [
  {
    title: "Kur'an ve Sünnet Perspektifinde Türbeler",
    items: ["Kabir ve ahiret tasavvuru", "Kabir ziyareti rivayetleri", "Erken dönem türbe geleneği"],
  },
  {
    title: "İslam Tarihi, Medeniyeti ve Türbe Geleneği",
    items: ["Türk-İslam medeniyetinde türbe kültürü", "Selçuklu, Beylikler ve Osmanlı türbeleri", "Vakıf medeniyeti"],
  },
  {
    title: "Fıkıh Perspektifinde Türbeler",
    items: ["Türbe ziyaretinin hükmü", "Dua, adak ve nezir uygulamaları", "Bid'at tartışmaları"],
  },
  {
    title: "Kelam, Akaid ve İslam Düşüncesinde Türbeler",
    items: ["Tevhid ve şirk tartışmaları", "Tevessül ve teberrük", "Ehl-i Sünnet geleneği"],
  },
  {
    title: "Tasavvuf ve Türbe Kültürü",
    items: ["Tekke, zaviye ve türbeler", "Evliya kültürü", "Manevi eğitim ve ziyaret"],
  },
  {
    title: "Sanat Tarihi, Mimarlık ve Türbeler",
    items: ["Selçuklu ve Osmanlı türbe mimarisi", "Kitabeler, çini ve kalemişi", "Restorasyon ve koruma"],
  },
  {
    title: "Türbeler ve Kültürel Miras",
    items: ["Dijital belgeleme", "Envanter çalışmaları", "Kültürel miras yönetimi"],
  },
  {
    title: "Sosyoloji, Psikoloji ve Antropoloji",
    items: ["Halk dindarlığı", "Toplumsal hafıza", "Türbe ritüelleri ve menkıbeler"],
  },
  {
    title: "Türbeler, Şehir ve Medeniyet",
    items: ["Şehir kimliği", "Külliye ve türbe ilişkisi", "Kent hafızası"],
  },
  {
    title: "İnanç Turizmi ve Türbeler",
    items: ["Kültür rotaları", "Ziyaretçi deneyimi", "Sürdürülebilir turizm"],
  },
  {
    title: "Güncel Tartışmalar ve Dijital Çağda Türbeler",
    items: ["Dijital türbe envanterleri", "Sanal ziyaretler", "Yapay zeka uygulamaları"],
  },
  {
    title: "Türbeler Üzerine Yeni Yaklaşımlar",
    items: ["Karşılaştırmalı araştırmalar", "Arşiv belgeleri", "Seyahatnameler ve menakıbnameler"],
  },
];

const committeeGroups = [
  {
    title: "Sempozyum Yönetimi",
    names: ["Ahmet Emre Bilgili", "Osman Gökmen"],
  },
  {
    title: "Onur Kurulu",
    names: ["Coşkun Yılmaz", "Cengiz Tomar"],
  },
  {
    title: "Düzenleme Kurulu",
    names: [
      "Ahmet Emre Bilgili",
      "Hayri Baraçlı",
      "Ergün Turan",
      "Hüseyin Keskin",
      "Süleyman Sarpken",
      "Çetin Şimdi",
      "Osman Gökmen",
    ],
  },
  {
    title: "Bilim Kurulu",
    names: [
      "Hakkı Önkal",
      "Ahmet Vefa Çobanoğlu",
      "Selçuk Mülayim",
      "Salih Kuçur",
      "Suphi Saatçi",
      "Aziz Doğan",
      "Abdülhamit Tüfekçioğlu",
      "Halil İbrahim Düzenli",
      "Çiçek Derman",
      "Hilal Kazan",
      "Mehmet İpşirli",
      "Mustafa Uzun",
      "Necdet Subaşı",
      "Ali Akben",
      "Cengiz Tomar",
    ],
  },
];

const importantDates = [
  ["30 Kasım 2026", "Bildiri özeti son gönderim tarihi"],
  ["21 Aralık 2026", "Kabul edilen bildirilerin ilanı"],
  ["15 Ocak 2027", "Sempozyum programının ilanı"],
  ["15 Şubat 2027", "Tam metinlerin son gönderim tarihi"],
  ["1-3 Nisan 2027", "Uluslararası Türbeler Sempozyumu"],
];

const participationRules = [
  "Başvurular yalnızca çevrim içi başvuru formu üzerinden alınacaktır.",
  "Bildiri başvuruları bireysel bildiri veya panel önerisi şeklinde kabul edilir.",
  "Panel önerileri en az dört bildiriden oluşmalı ve ortak bir panel başlığı taşımalıdır.",
  "Her araştırmacı sempozyuma en fazla bir bildiri ile katılabilir.",
  "Sempozyumun resmi dilleri Türkçe, Arapça ve İngilizcedir.",
  "Sunum süresi soru-cevap hariç 15 dakikadır.",
  "Sempozyuma katılım ücretsizdir; ulaşım ve konaklama giderleri katılımcılara aittir.",
  "Kabul edilen tam metinler ISBN'li hakemli bildiri kitabında yayımlanacaktır.",
];

const faqs = [
  ["Sempozyum nerede gerçekleştirilecektir?", "I. Uluslararası Türbeler Sempozyumu, 1-3 Nisan 2027 tarihlerinde İstanbul'da, Fatih Belediyesi ev sahipliğinde gerçekleştirilecektir."],
  ["Katılım ücretli mi?", "Hayır. Bildiri sunacak araştırmacılar ve dinleyicilerden katılım ücreti alınmayacaktır."],
  ["Çevrim içi katılım mümkün mü?", "Hayır. Sempozyum kapsamında tüm sunumların yüz yüze gerçekleştirilmesi esastır."],
  ["Panel başvurusu yapılabilir mi?", "Evet. Panel önerilerinin en az dört bildiriden oluşması ve ortak bir panel başlığıyla sunulması gerekmektedir."],
  ["Bildiriler yayımlanacak mı?", "Hakem ve editöryal değerlendirme süreçlerinin ardından uygun bulunan metinler I. Uluslararası Türbeler Sempozyumu Bildirileri adıyla yayımlanacaktır."],
];

export default function Home() {
  const topicTitles = topicGroups.map((topic) => topic.title);

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Ana gezinme">
        <a className="brand" href="#top" aria-label="Ana sayfaya dön">
          <span className="brand-mark">TÇ</span>
          <span>
            <strong>TÜRÇEK</strong>
            <small>Türbe Kültürü</small>
          </span>
        </a>
        <nav>
          <a href="#cagri">Çağrı</a>
          <a href="#konular">Konular</a>
          <a href="#tarihler">Tarihler</a>
          <a href="#basvuru">Başvuru</a>
          <a href="#iletisim">İletişim</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <img src="/hero-turbeler.png" alt="" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">TÜRÇEK ve Fatih Belediyesi ev sahipliğinde</p>
          <h1 id="hero-title">Uluslararası Türbeler Sempozyumu</h1>
          <p className="hero-subtitle">
            Geçmişten Geleceğe Türbe Kültürü
            <span>International Symposium on Mausoleums-I</span>
            <span>المؤتمر الدولي الأول للأضرحة الإسلامية</span>
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#basvuru">
              Bildiri Başvurusu Yap
            </a>
            <a className="secondary-action" href="#konular">
              Konu Başlıklarını İncele
            </a>
          </div>
        </div>
        <dl className="hero-facts" aria-label="Sempozyum özeti">
          <div>
            <dt>Tarih</dt>
            <dd>1-3 Nisan 2027</dd>
          </div>
          <div>
            <dt>Yer</dt>
            <dd>İstanbul</dd>
          </div>
          <div>
            <dt>Diller</dt>
            <dd>TR / AR / EN</dd>
          </div>
        </dl>
      </section>

      <section className="intro-band" id="cagri">
        <div className="section-heading">
          <p className="eyebrow">Sempozyum Tebliğ Çağrısı</p>
          <h2>Türbe kültürünü din, tarih, mimari ve kültürel miras ekseninde yeniden düşünmek</h2>
        </div>
        <div className="intro-copy">
          <p>
            Uluslararası Türbeler Sempozyumu-I, Türbeler-Çeşmeler Taşınır ve
            Taşınmaz Kültür Varlıklarını Koruma ve Yaşatma Derneği (TÜRÇEK)
            tarafından, Fatih Belediyesi ev sahipliğinde ve paydaş kurumların
            katkılarıyla 1-3 Nisan 2027 tarihlerinde İstanbul&apos;da düzenlenecektir.
          </p>
          <p>
            &quot;Geçmişten Geleceğe Türbe Kültürü&quot; ana temasıyla düzenlenen
            sempozyum; dini ilimler, tarih, sanat tarihi, mimarlık, tasavvuf,
            vakıf tarihi, kültürel miras, sosyoloji, psikoloji, antropoloji,
            hukuk, turizm ve dijital beşeri bilimler alanlarından araştırmacıları
            ortak bir akademik platformda buluşturmayı hedeflemektedir.
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

      <section className="rules-section" id="bilgiler">
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
                {group.names.map((name) => (
                  <li key={name}>{name}</li>
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
            anahtar kelime içermelidir. Panel önerileri için dört tebliğci
            bilgisi zorunludur.
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
          <a href="mailto:info@turcek.org">info@turcek.org</a>
          <span>İstanbul / Türkiye</span>
          <span>Fatih Belediyesi ev sahipliğinde yüz yüze gerçekleştirilecektir.</span>
        </address>
      </footer>
    </main>
  );
}
