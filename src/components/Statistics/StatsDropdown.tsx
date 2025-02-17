"use client";
import { useEffect, useRef, useState } from "react";

const categories = ["감정별 통계", "개인 통계", "월별 통계", "전체 통계"];

export default function StatsDropdown({
  onSelect,
}: {
  onSelect: (category: string) => void;
}) {
  const [selected, setSelected] = useState(categories[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 감지해서 드롭다운 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`dropdown ${open ? "open" : ""}`} ref={dropdownRef}>
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        {selected}
        <span className={`dropdown-icon ${open ? "rotate" : ""}`}>▼</span>{" "}
        {/* ✅ 아이콘 추가 */}
      </button>
      <ul
        className="dropdown-menu"
        style={{ display: open ? "block" : "none" }}
      >
        {categories.map((category) => (
          <li
            key={category}
            className={selected === category ? "active" : ""}
            onClick={() => {
              setSelected(category);
              onSelect(category);
              setOpen(false);
            }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}
