interface InputProps {
  label?: string; // `label`은 선택 사항
  type?: string; // 기본값 "text"
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // 추가적인 스타일 적용 가능
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "w-full border rounded-md px-4 py-2 focus:outline-blue-500",
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* label이 있을 때만 렌더링 */}
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
};

export default Input;
