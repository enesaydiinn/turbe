"use client";

import { useMemo, useState } from "react";

type RegistrationFormProps = {
  topics: string[];
};

type ApplicationType = "individual" | "panel";

type FormStatus = "idle" | "submitting" | "success" | "error";

type UploadedAttachment = {
  bucket: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  path: string;
};

const maxAttachmentBytes = 5 * 1024 * 1024;
const attachmentAccept =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const attachmentTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

function getSelectedFile(form: FormData, key: string) {
  const value = form.get(key);

  return value instanceof File && value.size > 0 ? value : null;
}

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function validateAttachment(file: File) {
  const hasAllowedExtension = /\.(pdf|doc|docx)$/i.test(file.name);
  const hasAllowedType =
    !file.type ||
    file.type === "application/octet-stream" ||
    attachmentTypes.has(file.type);

  if (!hasAllowedExtension || !hasAllowedType) {
    return "Yalnızca PDF, DOC veya DOCX dosyası yükleyebilirsiniz.";
  }

  if (file.size > maxAttachmentBytes) {
    return "Dosya boyutu en fazla 5 MB olmalıdır.";
  }

  return "";
}

async function uploadAttachment(file: File) {
  const uploadRequest = await fetch("/api/applications/attachment-upload", {
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const uploadResult = (await uploadRequest.json()) as {
    attachment?: UploadedAttachment;
    message?: string;
    uploadUrl?: string;
  };

  if (!uploadRequest.ok || !uploadResult.attachment || !uploadResult.uploadUrl) {
    throw new Error(uploadResult.message ?? "Dosya yükleme bağlantısı alınamadı.");
  }

  const storageResponse = await fetch(uploadResult.uploadUrl, {
    body: file,
    headers: {
      "Content-Type": uploadResult.attachment.fileType,
    },
    method: "PUT",
  });

  if (!storageResponse.ok) {
    throw new Error("Dosya Supabase Storage alanına yüklenemedi.");
  }

  return uploadResult.attachment;
}

export function RegistrationForm({ topics }: RegistrationFormProps) {
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("individual");
  const [abstractWords, setAbstractWords] = useState(0);
  const [attachmentLabel, setAttachmentLabel] = useState("");
  const [attachmentMessage, setAttachmentMessage] = useState("");
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

  function handleAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setAttachmentLabel("");
      setAttachmentMessage("");
      return;
    }

    const validationMessage = validateAttachment(file);

    setAttachmentLabel(`${file.name} · ${formatFileSize(file.size)}`);
    setAttachmentMessage(validationMessage);

    if (validationMessage) {
      setStatus("error");
      setMessage(validationMessage);
    } else if (status === "error" && message === attachmentMessage) {
      setStatus("idle");
      setMessage("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const abstractText = stringValue(form, "abstractText");
    const wordCount = countWords(abstractText);
    const attachmentFile = getSelectedFile(form, "attachmentFile");

    if (attachmentFile) {
      const validationMessage = validateAttachment(attachmentFile);

      if (validationMessage) {
        setStatus("error");
        setMessage(validationMessage);
        return;
      }
    }

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
      attachment: null as UploadedAttachment | null,
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
      if (attachmentFile) {
        payload.attachment = await uploadAttachment(attachmentFile);
      }

      const response = await fetch("/api/applications", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Başvuru alınamadı.");
      }

      formElement.reset();
      setAbstractWords(0);
      setAttachmentLabel("");
      setAttachmentMessage("");
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
        <label className="field field-wide file-field">
          <span>
            Bildiri Dosyası <small>PDF/DOC/DOCX, en fazla 5 MB</small>
          </span>
          <input
            accept={attachmentAccept}
            aria-describedby="attachment-help"
            name="attachmentFile"
            onChange={handleAttachmentChange}
            type="file"
          />
          <p
            className={`field-help${attachmentMessage ? " field-error" : ""}`}
            id="attachment-help"
          >
            {attachmentMessage ||
              attachmentLabel ||
              "Özet veya tam metin dosyanızı PDF ya da Word formatında yükleyebilirsiniz."}
          </p>
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
