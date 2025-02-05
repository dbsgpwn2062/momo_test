import React from "react";

const Calendar: React.FC<{
  currentDate: Date;
  changeMonth: (direction: "prev" | "next") => void;
  onDateSelect: (date: string) => void;
}> = ({ currentDate, changeMonth, onDateSelect }) => {
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 월 첫 요일
    const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;

    return Array.from({ length: totalCells }).map((_, index) => {
      const day = index - firstDayOfWeek + 1;
      const isValidDay = day > 0 && day <= daysInMonth;

      return (
        <td
          key={index}
          className={`relative p-4 border cursor-pointer ${
            isValidDay ? "text-gray-700 hover:bg-gray-200" : "text-gray-300"
          }`}
          onClick={() =>
            isValidDay && onDateSelect(`${year}-${month + 1}-${day}`)
          }
        >
          {isValidDay && (
            <span className="absolute top-1 left-1 text-sm">{day}</span>
          )}
        </td>
      );
    });
  };

  return (
    <div className="relative h-full flex flex-col p-4 bg-white shadow-lg rounded-lg">
      {/* 월 이동 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth("prev")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          이전
        </button>
        <h2 className="text-3xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth("next")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          다음
        </button>
      </div>

      {/* 캘린더 */}
      <table className="w-full h-full text-center border-collapse">
        <thead>
          <tr>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <th key={day} className="p-2 border-b">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {renderCalendarDays().slice(weekIndex * 7, (weekIndex + 1) * 7)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
