import { RegistrationForm } from "./components/RegistrationForm";

const topics = [
  "Mushaf Kitâbeti",
  "Mushaf İlimleri",
  "Mushaf Tarihi ve Kültürü",
  "Mushaf Yazım Havzaları",
  "Yazma Mushafların Nakli, Dolaşımı ve Aidiyeti",
  "Mushaf Koleksiyonları",
  "Palimpsest Mushaflar ve Metinsel Katmanlar",
  "Yazma Mushaflardaki Kayıtlar",
  "Mushaf Sanatları",
  "Yazma Mushafların Tarihlendirilmesi",
  "Yazma Mushafların Konservasyonu",
  "Dijitalleştirme, Kataloglama ve Veritabanı Çalışmaları",
  "Yazma Mushafların Neşri",
  "Mushaf Âlimleri ve Sanatkârları",
  "Malzeme, Kimyasal ve Biyolojik Analizler",
  "Yazma Mushaf Araştırmalarında Yöntem ve Ekoller",
];

const committeeGroups = [
  {
    title: "Sempozyum Yönetimi",
    names: [
      "Coşkun Yılmaz - Türkiye Yazma Eserler Kurumu",
      "M. Emin Maşalı - Marmara Üniversitesi",
      "Osman Şahin - Diyanet İşleri Başkan Yardımcısı",
      "Mehmed Özçay - Hattat",
      "Necmettin Gökkır - İstanbul Üniversitesi",
    ],
  },
  {
    title: "Bilim Kurulu",
    names: [
      "François Déroche - Collège de France",
      "Ghanim Qadduri al-Hamed - Câmiatü Tikrit",
      "Ahmad al-Jallad - Ohio State University",
      "Alba Fedeli - Hamburg Üniversitesi",
      "M. Uğur Derman - Türkiye",
      "Paul Hepworth - Bağımsız El Yazması Konservatörü",
    ],
  },
  {
    title: "Düzenleme Kurulu",
    names: [
      "Ahmet Kaylı - Türkiye Yazma Eserler Kurumu",
      "Ayşenur Elif Ünal Şahin - Ankara Hacı Bayram Veli Üniversitesi",
      "Betül Genan - İstanbul Medeniyet Üniversitesi",
      "Emine Öztürk - Türkiye Yazma Eserler Kurumu",
      "Nesibe Büşra Tokuş - Türkiye Yazma Eserler Kurumu",
      "Sümeyye Nur Aydın - Türkiye Yazma Eserler Kurumu",
    ],
  },
];

const schedule = [
  ["Başvuru", "Bildiri ve panel başvuruları web formu üzerinden alınacak."],
  ["Değerlendirme", "Özetler Bilim Kurulu tarafından akademik uygunluk açısından incelenecek."],
  ["Program", "Kabul edilen bildiriler oturum takvimiyle birlikte duyurulacak."],
  ["Sempozyum", "12-13 Kasım 2026 tarihlerinde İstanbul'da yüz yüze yapılacak."],
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Ana gezinme">
        <a className="brand" href="#top" aria-label="Ana sayfaya dön">
          <span className="brand-mark">YM</span>
          <span>
            <strong>TÜYEK</strong>
            <small>Yazma Mushaflar</small>
          </span>
        </a>
        <nav>
          <a href="#cagri">Çağrı</a>
          <a href="#konular">Konular</a>
          <a href="#basvuru">Başvuru</a>
          <a href="#iletisim">İletişim</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <img src="/hero-manuscript.png" alt="" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Türkiye Yazma Eserler Kurumu Başkanlığı</p>
          <h1 id="hero-title">Uluslararası Yazma Mushaflar Sempozyumu</h1>
          <p className="hero-subtitle">
            International Symposium on Qur'anic Manuscripts
            <span>المؤتمر الدولي للمصاحف المخطوطة</span>
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
            <dd>12-13 Kasım 2026</dd>
          </div>
          <div>
            <dt>Yer</dt>
            <dd>İstanbul</dd>
          </div>
          <div>
            <dt>Katılım</dt>
            <dd>Bildiri ve panel</dd>
          </div>
        </dl>
      </section>

      <section className="intro-band" id="cagri">
        <div className="section-heading">
          <p className="eyebrow">Sempozyum Tebliğ Çağrısı</p>
          <h2>Yazma mushaf mirası için disiplinlerarası buluşma</h2>
        </div>
        <div className="intro-copy">
          <p>
            Türkiye Yazma Eserler Kurumu Başkanlığı, İslam tarihinin erken
            dönemlerinden 20. yüzyıla uzanan farklı coğrafyalarda istinsah
            edilmiş mushafları koruyan, kataloglayan, dijitalleştiren ve
            araştırmacıların erişimine açan temel kurumlardan biridir.
          </p>
          <p>
            12-13 Kasım 2026'da İstanbul'da yapılacak sempozyum; mushaf
            kitâbeti, tarihi, sanatları, koleksiyonları, konservasyonu,
            tarihlendirilmesi, neşri ve dijital beşeri bilimler yaklaşımları
            üzerinden alandaki yeni çalışmaları bir araya getirecek.
          </p>
        </div>
      </section>

      <section className="topics-section" id="konular">
        <div className="section-heading">
          <p className="eyebrow">Konu Başlıkları</p>
          <h2>Başvuru yapılabilecek akademik alanlar</h2>
        </div>
        <div className="topic-grid">
          {topics.map((topic, index) => (
            <article className="topic-card" key={topic}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section" id="bilgiler">
        <div className="section-heading">
          <p className="eyebrow">Sempozyum Bilgileri</p>
          <h2>Başvurudan programa uzanan süreç</h2>
        </div>
        <div className="timeline">
          {schedule.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
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

      <section className="application-section" id="basvuru">
        <div className="section-heading">
          <p className="eyebrow">Başvurular</p>
          <h2>Bildiri veya panel önerinizle katılın</h2>
          <p>
            Formu doldurduğunuzda başvurunuz sempozyum kayıt havuzuna
            iletilir. Özet metni 150-300 kelime aralığında olmalıdır.
          </p>
        </div>
        <RegistrationForm topics={topics} />
      </section>

      <footer className="site-footer" id="iletisim">
        <div>
          <p className="eyebrow">İletişim</p>
          <h2>Türkiye Yazma Eserler Kurumu Başkanlığı</h2>
          <p>
            Sempozyumla ilgili sorularınız için sekretarya ile iletişime
            geçebilirsiniz.
          </p>
        </div>
        <address>
          <a href="mailto:tuyeksempozyum@ktb.gov.tr">tuyeksempozyum@ktb.gov.tr</a>
          <a href="tel:+902125144635">+90 212 514 46 35-36</a>
          <span>Süleymaniye Mahallesi, Kanuni Medresesi Sokak No: 5, Fatih / İstanbul</span>
          <a href="https://www.yek.gov.tr/yazmamushaflarsempozyumu/">
            Resmi duyuru sayfası
          </a>
        </address>
      </footer>
    </main>
  );
}
