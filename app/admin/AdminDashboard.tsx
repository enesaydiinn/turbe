"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  ApplicationStatus,
  SymposiumApplication,
} from "@/app/lib/supabase";

type AdminDashboardProps = {
  adminName: string;
  applications: SymposiumApplication[];
  errorMessage: string;
};

const statusLabels: Record<ApplicationStatus, string> = {
  accepted: "Kabul",
  received: "Yeni",
  rejected: "Red",
  under_review: "İncelemede",
};

const typeLabels = {
  individual: "Bildiri",
  panel: "Panel",
};

const statusOptions = Object.entries(statusLabels) as [
  ApplicationStatus,
  string,
][];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

function csvCell(value: string | number | boolean | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function AdminDashboard({
  adminName,
  applications: initialApplications,
  errorMessage,
}: AdminDashboardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState(initialApplications[0]?.id ?? "");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkStatus, setBulkStatus] =
    useState<ApplicationStatus>("under_review");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "panel">(
    "all",
  );

  const filteredApplications = useMemo(() => {
    const search = normalize(query.trim());

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;
      const matchesType =
        typeFilter === "all" || application.application_type === typeFilter;
      const searchCorpus = normalize(
        [
          application.full_name,
          application.email,
          application.institution,
          application.paper_title,
          application.topic,
          application.country_city,
        ].join(" "),
      );

      return matchesStatus && matchesType && searchCorpus.includes(search);
    });
  }, [applications, query, statusFilter, typeFilter]);

  const activeApplication =
    applications.find((application) => application.id === activeId) ??
    filteredApplications[0] ??
    applications[0] ??
    null;

  const counts = useMemo(() => {
    return statusOptions.map(([status, label]) => ({
      count: applications.filter((application) => application.status === status)
        .length,
      label,
      status,
    }));
  }, [applications]);

  const visibleIds = filteredApplications.map((application) => application.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  function toggleApplication(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  function toggleVisible(checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);

      visibleIds.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });

      return next;
    });
  }

  async function updateApplication({
    id,
    reviewNotes,
    status,
  }: {
    id: string;
    reviewNotes?: string;
    status: ApplicationStatus;
  }) {
    const response = await fetch(`/api/admin/applications/${id}`, {
      body: JSON.stringify(
        reviewNotes === undefined ? { status } : { reviewNotes, status },
      ),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const result = (await response.json()) as {
      application?: SymposiumApplication;
      message?: string;
    };

    if (!response.ok || !result.application) {
      throw new Error(result.message ?? "Başvuru güncellenemedi.");
    }

    setApplications((current) =>
      current.map((application) =>
        application.id === id ? result.application! : application,
      ),
    );

    return result.application;
  }

  async function handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeApplication) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const status = String(form.get("status"));

    if (!Object.keys(statusLabels).includes(status)) {
      return;
    }

    setSavingId(activeApplication.id);
    setMessage("");

    try {
      await updateApplication({
        id: activeApplication.id,
        reviewNotes: String(form.get("reviewNotes") ?? ""),
        status: status as ApplicationStatus,
      });
      setMessage("Başvuru değerlendirmesi güncellendi.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Başvuru güncellenirken bir sorun oluştu.",
      );
    } finally {
      setSavingId("");
    }
  }

  async function handleBulkUpdate() {
    const ids = Array.from(selectedIds);

    if (ids.length === 0) {
      setMessage("Toplu işlem için en az bir başvuru seçin.");
      return;
    }

    setBulkSaving(true);
    setMessage("");

    try {
      await Promise.all(
        ids.map((id) => updateApplication({ id, status: bulkStatus })),
      );
      setSelectedIds(new Set());
      setMessage(`${ids.length} başvurunun durumu güncellendi.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Toplu güncelleme sırasında bir sorun oluştu.",
      );
    } finally {
      setBulkSaving(false);
    }
  }

  function handleExport() {
    const headers = [
      "Tarih",
      "Durum",
      "Tür",
      "Ad Soyad",
      "E-posta",
      "Telefon",
      "Kurum",
      "Konu",
      "Tebliğ Başlığı",
      "Özet Dili",
      "Anahtar Kelimeler",
      "Admin Notu",
    ];
    const rows = filteredApplications.map((application) => [
      formatDate(application.created_at),
      statusLabels[application.status],
      typeLabels[application.application_type],
      application.full_name,
      application.email,
      application.phone,
      application.institution,
      application.topic,
      application.paper_title,
      application.abstract_language,
      application.keywords.join(", "),
      application.review_notes,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvCell(cell)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "turbe-sempozyumu-basvurular.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/">
          <span>TÇ</span>
          <strong>TÜRÇEK Admin</strong>
        </Link>
        <div className="admin-session">
          <span>{adminName}</span>
          <button onClick={handleLogout} type="button">
            Çıkış
          </button>
        </div>
      </header>

      <section className="admin-hero">
        <div>
          <p className="eyebrow">Başvuru Paneli</p>
          <h1>Uluslararası Türbeler Sempozyumu</h1>
          <p>
            Bildiri ve panel başvurularını tek ekranda inceleyin, filtreleyin
            ve değerlendirme durumlarını güncelleyin.
          </p>
        </div>
        <div className="admin-stat-grid" aria-label="Başvuru durum özeti">
          <article>
            <strong>{applications.length}</strong>
            <span>Toplam</span>
          </article>
          {counts.map((item) => (
            <article key={item.status}>
              <strong>{item.count}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      {errorMessage ? (
        <p className="admin-alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <section className="admin-controls" aria-label="Başvuru filtreleri">
        <label className="admin-field">
          <span>Arama</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ad, kurum, e-posta veya başlık"
            type="search"
            value={query}
          />
        </label>
        <label className="admin-field">
          <span>Durum</span>
          <select
            onChange={(event) =>
              setStatusFilter(event.target.value as ApplicationStatus | "all")
            }
            value={statusFilter}
          >
            <option value="all">Tümü</option>
            {statusOptions.map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Tür</span>
          <select
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | "individual" | "panel")
            }
            value={typeFilter}
          >
            <option value="all">Tümü</option>
            <option value="individual">Bildiri</option>
            <option value="panel">Panel</option>
          </select>
        </label>
        <button className="admin-secondary-button" onClick={handleExport} type="button">
          CSV indir
        </button>
      </section>

      <section className="admin-bulkbar" aria-label="Toplu değerlendirme">
        <strong>{selectedIds.size} başvuru seçildi</strong>
        <select
          onChange={(event) =>
            setBulkStatus(event.target.value as ApplicationStatus)
          }
          value={bulkStatus}
        >
          {statusOptions.map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>
        <button disabled={bulkSaving} onClick={handleBulkUpdate} type="button">
          {bulkSaving ? "Güncelleniyor" : "Seçilenlere uygula"}
        </button>
        {message ? <p role="status">{message}</p> : null}
      </section>

      <section className="admin-workspace">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    aria-label="Görünen başvuruları seç"
                    checked={allVisibleSelected}
                    onChange={(event) => toggleVisible(event.target.checked)}
                    type="checkbox"
                  />
                </th>
                <th>Başvuru</th>
                <th>Kurum</th>
                <th>Konu</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">Başvuru bulunamadı.</div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr
                    className={
                      activeApplication?.id === application.id ? "active" : ""
                    }
                    key={application.id}
                  >
                    <td>
                      <input
                        aria-label={`${application.full_name} başvurusunu seç`}
                        checked={selectedIds.has(application.id)}
                        onChange={(event) =>
                          toggleApplication(application.id, event.target.checked)
                        }
                        type="checkbox"
                      />
                    </td>
                    <td>
                      <button
                        className="admin-row-button"
                        onClick={() => setActiveId(application.id)}
                        type="button"
                      >
                        <strong>{application.full_name}</strong>
                        <span>{typeLabels[application.application_type]}</span>
                      </button>
                    </td>
                    <td>{application.institution}</td>
                    <td>{application.topic}</td>
                    <td>
                      <span className={`status-pill status-${application.status}`}>
                        {statusLabels[application.status]}
                      </span>
                    </td>
                    <td>{formatDate(application.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="admin-detail" aria-label="Başvuru detayı">
          {activeApplication ? (
            <>
              <div className="admin-detail-head">
                <span className={`status-pill status-${activeApplication.status}`}>
                  {statusLabels[activeApplication.status]}
                </span>
                <h2>{activeApplication.paper_title}</h2>
                <p>
                  {activeApplication.full_name} · {activeApplication.institution}
                </p>
              </div>

              <dl className="admin-detail-list">
                <div>
                  <dt>E-posta</dt>
                  <dd>
                    <a href={`mailto:${activeApplication.email}`}>
                      {activeApplication.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>{activeApplication.phone}</dd>
                </div>
                <div>
                  <dt>Ülke / Şehir</dt>
                  <dd>{activeApplication.country_city}</dd>
                </div>
                <div>
                  <dt>Meslek / Ünvan</dt>
                  <dd>
                    {activeApplication.profession} ·{" "}
                    {activeApplication.academic_title}
                  </dd>
                </div>
                <div>
                  <dt>Konu</dt>
                  <dd>{activeApplication.topic}</dd>
                </div>
                <div>
                  <dt>Anahtar kelimeler</dt>
                  <dd>{activeApplication.keywords.join(", ")}</dd>
                </div>
              </dl>

              {activeApplication.application_type === "panel" ? (
                <div className="admin-panel-speakers">
                  <h3>Panel tebliğcileri</h3>
                  <ul>
                    {activeApplication.speakers.map((speaker, index) => (
                      <li key={`${speaker.email}-${index}`}>
                        <strong>{speaker.fullName}</strong>
                        <span>{speaker.institution}</span>
                        <small>{speaker.paperTitle}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="admin-abstract">
                <h3>Özet</h3>
                <p>{activeApplication.abstract_text}</p>
              </div>

              {activeApplication.notes ? (
                <div className="admin-abstract">
                  <h3>Başvuru notu</h3>
                  <p>{activeApplication.notes}</p>
                </div>
              ) : null}

              <form
                className="admin-review-form"
                key={activeApplication.id}
                onSubmit={handleReviewSubmit}
              >
                <label className="admin-field">
                  <span>Değerlendirme durumu</span>
                  <select defaultValue={activeApplication.status} name="status">
                    {statusOptions.map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  <span>Admin değerlendirme notu</span>
                  <textarea
                    defaultValue={activeApplication.review_notes ?? ""}
                    name="reviewNotes"
                    rows={4}
                  />
                </label>
                <button
                  disabled={savingId === activeApplication.id}
                  type="submit"
                >
                  {savingId === activeApplication.id
                    ? "Kaydediliyor"
                    : "Değerlendirmeyi kaydet"}
                </button>
              </form>
            </>
          ) : (
            <div className="admin-empty">Henüz başvuru yok.</div>
          )}
        </aside>
      </section>
    </main>
  );
}
