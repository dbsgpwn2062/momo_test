export default function Button({
  text,
  type = "button", // ✅ 기본값을 "button"으로 설정
  onClick,
}: {
  text: string;
  type?: "button" | "submit" | "reset"; // ✅ type 속성 추가
  onClick?: () => void;
}) {
  return (
    <button
      type={type} // ✅ 버튼 타입 적용
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {text}
    </button>
  );
}
