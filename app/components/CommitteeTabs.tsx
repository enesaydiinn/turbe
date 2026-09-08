"use client";

import { useMemo, useState } from "react";

type CommitteeGroup = {
  description: string;
  names: string[];
  title: string;
};

type CommitteeTabsProps = {
  groups: CommitteeGroup[];
};

function getTurkishTitle(title: string) {
  return title.split("/")[0]?.trim() ?? title;
}

function getMultilingualTitle(title: string) {
  return title
    .split("/")
    .slice(1)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" / ");
}

function getInitials(name: string) {
  const words = name
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("tr-TR");
}

export function CommitteeTabs({ groups }: CommitteeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGroup = groups[activeIndex] ?? groups[0];

  const activeMeta = useMemo(() => {
    if (!activeGroup) {
      return null;
    }

    return {
      label: getTurkishTitle(activeGroup.title),
      multilingual: getMultilingualTitle(activeGroup.title),
    };
  }, [activeGroup]);

  if (!activeGroup || !activeMeta) {
    return null;
  }

  return (
    <div className="committee-tabs">
      <div
        aria-label="Kurul kategorileri"
        className="committee-tablist"
        role="tablist"
      >
        {groups.map((group, index) => {
          const label = getTurkishTitle(group.title);
          const isActive = activeIndex === index;

          return (
            <button
              aria-controls={`committee-panel-${index}`}
              aria-selected={isActive}
              className={`committee-tab${isActive ? " is-active" : ""}`}
              id={`committee-tab-${index}`}
              key={group.title}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              <span>{label}</span>
              <small>{group.names.length} isim</small>
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`committee-tab-${activeIndex}`}
        className="committee-panel"
        id={`committee-panel-${activeIndex}`}
        role="tabpanel"
      >
        <div className="committee-panel-head">
          <div>
            <p className="committee-panel-kicker">{activeMeta.multilingual}</p>
            <h3>{activeMeta.label}</h3>
            <p>{activeGroup.description}</p>
          </div>
          <div className="committee-count" aria-label={`${activeGroup.names.length} isim`}>
            <strong>{activeGroup.names.length}</strong>
            <span>İsim</span>
          </div>
        </div>

        <div className="committee-people-grid">
          {activeGroup.names.map((name, index) => (
            <article className="committee-person-card" key={`${name}-${index}`}>
              <span className="committee-initial" aria-hidden="true">
                {getInitials(name)}
              </span>
              <strong>{name}</strong>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
