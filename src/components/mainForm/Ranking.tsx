import React from "react";

const Ranking: React.FC = () => {
  const rankings = [
    {
      rank: 1,
      title: "눈물의 여왕",
      logo: "https://poc-cf-image.cjenm.com/resize/459/public/pcms/photogroup/B120239784/kr/B120239784photogroup1709887488282.jpg?v=1709887488",
    },
    {
      rank: 2,
      title: "더 위쳐",
      logo: "https://i.namu.wiki/i/sfRZ-_1Q-tXydUrMtUnupHd4bpNw2KBQjy2INB-HkW7ZUItTJYh7-_AJihNzVqYEiPjMEklnYdvZEmtyZ6PgMw.webp",
    },
    {
      rank: 3,
      title: "범죄도시",
      logo: "https://mblogthumb-phinf.pstatic.net/MjAyMTAyMTFfMTg0/MDAxNjEzMDE2ODUwOTcz.Ns3YiSf2gEhNuXjy_mkej8MNo5RPTpXR61sqOFUmkt0g.OISBWC3YyQCuRYbtpKW1uPbNDpqOpDFwxtdRSmxsyIog.JPEG.sugirl22/0.jpg?type=w800",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-bold mb-4">통계 (미터기 📊)</h3>
      <div className="flex justify-center space-x-8">
        {rankings.map((item) => (
          <div key={item.rank} className="flex flex-col items-center">
            <div className="text-5xl font-bold text-yellow-500 mb-4">
              {item.rank}
            </div>
            <img
              src={item.logo}
              alt="Logo"
              className="w-50 h-80 mb-4 rounded-lg shadow-lg"
            />
            <span className="text-center text-sm">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
