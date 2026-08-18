"use client";

import { useMemo, useState } from "react";

type RegistrationFormProps = {
  topics: string[];
};

type ApplicationType = "individual" | "panel";

type FormStatus = "idle" | "submitting" | "success" | "error";

const professions = [
  "Akademisyen",
  "Araştırmacı",
  "Lisansüstü Öğrenci",
  "Kütüphaneci / Arşiv Uzmanı",
  "Konservatör / Restoratör",
  "Diğer",
];

const academicTitles = [
  "Prof. Dr.",
  "Doç. Dr.",
  "Dr. Öğr. Üyesi",
  "Dr.",
  "Arş. Gör.",
  "Uzman",
  "Diğer",
];

const abstractLanguages = ["Türkçe", "Arapça", "İngilizce"];

function countWords(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function stringValue(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function RegistrationForm({ topics }: RegistrationFormProps) {
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("individual");
  const [abstractWords, setAbstractWords] = useState(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const submitLabel = useMemo(() => {
    if (status === "submitting") {
      return "Gönderiliyor";
    }

    return applicationType === "panel"
      ? "Panel Başvurusunu Gönder"
      : "Bildiri Başvurusunu Gönder";
  }, [applicationType, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const abstractText = stringValue(form, "abstractText");
    const wordCount = countWords(abstractText);

    if (wordCount < 150 || wordCount > 300) {
      setStatus("error");
      setMessage("Özet metni 150-300 kelime aralığında olmalıdır.");
      return;
    }

    const keywordCount = stringValue(form, "keywords")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean).length;

    if (keywordCount < 3 || keywordCount > 5) {
      setStatus("error");
      setMessage("Anahtar kelimeler 3-5 ifade arasında olmalıdır.");
      return;
    }

    const speakers =
      applicationType === "panel"
        ? [1, 2, 3, 4]
            .map((index) => ({
              fullName: stringValue(form, `speaker${index}FullName`),
              institution: stringValue(form, `speaker${index}Institution`),
              email: stringValue(form, `speaker${index}Email`),
              paperTitle: stringValue(form, `speaker${index}PaperTitle`),
            }))
            .filter((speaker) =>
              Object.values(speaker).some((value) => value.length > 0),
            )
        : [];

    const payload = {
      applicationType,
      fullName: stringValue(form, "fullName"),
      email: stringValue(form, "email"),
      phone: stringValue(form, "phone"),
      countryCity: stringValue(form, "countryCity"),
      institution: stringValue(form, "institution"),
      orcid: stringValue(form, "orcid"),
      profession: stringValue(form, "profession"),
      academicTitle: stringValue(form, "academicTitle"),
      topic: stringValue(form, "topic"),
      paperTitle: stringValue(form, "paperTitle"),
      panelTitle: stringValue(form, "panelTitle"),
      presentingAuthor: stringValue(form, "presentingAuthor"),
      abstractLanguage: stringValue(form, "abstractLanguage"),
      keywords: stringValue(form, "keywords"),
      abstractText,
      publishedBefore: stringValue(form, "publishedBefore"),
      notes: stringValue(form, "notes"),
      consent: form.get("consent") === "on",
      speakers,
    };

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Başvuru alınamadı.");
      }

      event.currentTarget.reset();
      setAbstractWords(0);
      setStatus("success");
      setMessage("Başvurunuz alındı. Değerlendirme süreci için teşekkür ederiz.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Başvuru gönderilirken bir sorun oluştu.",
      );
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <div className="form-topline">
        <div className="type-switch" role="tablist" aria-label="Başvuru türü">
          <button
            aria-selected={applicationType === "individual"}
            className={applicationType === "individual" ? "active" : ""}
            onClick={() => setApplicationType("individual")}
            role="tab"
            type="button"
          >
            Bireysel Bildiri
          </button>
          <button
            aria-selected={applicationType === "panel"}
            className={applicationType === "panel" ? "active" : ""}
            onClick={() => setApplicationType("panel")}
            role="tab"
            type="button"
          >
            Panel Başvurusu
          </button>
        </div>
      </div>

      <input name="applicationType" type="hidden" value={applicationType} />

      <fieldset>
        <legend>Kişisel Bilgiler</legend>
        <label className="field">
          <span>Ad Soyad *</span>
          <input name="fullName" required type="text" />
        </label>
        <label className="field">
          <span>E-posta *</span>
          <input name="email" required type="email" />
        </label>
        <label className="field">
          <span>Telefon *</span>
          <input name="phone" required type="tel" />
        </label>
        <label className="field">
          <span>Ülke / Şehir *</span>
          <input name="countryCity" required type="text" />
        </label>
        <label className="field">
          <span>ORCID</span>
          <input name="orcid" placeholder="0000-0000-0000-0000" type="text" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Akademik / Mesleki Bilgiler</legend>
        <label className="field">
          <span>Kurum / Kuruluş *</span>
          <input name="institution" required type="text" />
        </label>
        <label className="field">
          <span>Meslek *</span>
          <select defaultValue="" name="profession" required>
            <option disabled value="">
              Seçiniz
            </option>
            {professions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ünvan *</span>
          <select defaultValue="" name="academicTitle" required>
            <option disabled value="">
              Seçiniz
            </option>
            {academicTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Konu Başlığı *</span>
          <select defaultValue="" name="topic" required>
            <option disabled value="">
              Seçiniz
            </option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {applicationType === "panel" ? (
        <fieldset>
          <legend>Panel Bilgileri</legend>
          <label className="field field-wide">
            <span>Panel Konusu *</span>
            <input name="panelTitle" required type="text" />
          </label>
          {[1, 2, 3, 4].map((speaker) => (
            <div className="speaker-row" key={speaker}>
              <h4>{speaker}. Tebliğci</h4>
              <label className="field">
                <span>Ad Soyad *</span>
                <input
                  name={`speaker${speaker}FullName`}
                  required
                  type="text"
                />
              </label>
              <label className="field">
                <span>Kurum *</span>
                <input
                  name={`speaker${speaker}Institution`}
                  required
                  type="text"
                />
              </label>
              <label className="field">
                <span>E-posta *</span>
                <input
                  name={`speaker${speaker}Email`}
                  required
                  type="email"
                />
              </label>
              <label className="field">
                <span>Tebliğ Başlığı *</span>
                <input
                  name={`speaker${speaker}PaperTitle`}
                  required
                  type="text"
                />
              </label>
            </div>
          ))}
        </fieldset>
      ) : null}

      <fieldset>
        <legend>{applicationType === "panel" ? "Panel Özeti" : "Bildiri Bilgileri"}</legend>
        <label className="field field-wide">
          <span>{applicationType === "panel" ? "Panel Başlığı *" : "Tebliğ Başlığı *"}</span>
          <input name="paperTitle" required type="text" />
        </label>
        <label className="field">
          <span>Sunumu Gerçekleştirecek Yazar *</span>
          <input name="presentingAuthor" required type="text" />
        </label>
        <label className="field">
          <span>Özet Dili *</span>
          <select defaultValue="" name="abstractLanguage" required>
            <option disabled value="">
              Seçiniz
            </option>
            {abstractLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>
        <label className="field field-wide">
          <span>Anahtar Kelimeler * <small>3-5 ifade, virgülle ayırın</small></span>
          <input name="keywords" required type="text" />
        </label>
        <div className="field field-wide radio-field">
          <span>Metin daha önce yayımlandı mı? *</span>
          <label>
            <input name="publishedBefore" required type="radio" value="yes" />
            Evet
          </label>
          <label>
            <input name="publishedBefore" required type="radio" value="no" />
            Hayır
          </label>
        </div>
        <label className="field field-wide">
          <span>Özet * <small>{abstractWords}/300 kelime</small></span>
          <textarea
            name="abstractText"
            onChange={(event) => setAbstractWords(countWords(event.target.value))}
            required
            rows={8}
          />
        </label>
        <label className="field field-wide">
          <span>Ek Not</span>
          <textarea name="notes" rows={3} />
        </label>
      </fieldset>

      <label className="consent">
        <input name="consent" required type="checkbox" />
        <span>
          Kişisel verilerimin sempozyum başvuru ve değerlendirme süreci
          kapsamında işlenmesini kabul ediyorum.
        </span>
      </label>

      <div className="form-actions">
        <button disabled={status === "submitting"} type="submit">
          {submitLabel}
        </button>
        {message ? (
          <p className={`form-message ${status}`} role="status">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
