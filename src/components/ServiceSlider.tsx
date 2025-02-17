"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ServiceSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="/images/slide1.png" alt="감성 일기 작성" />
      </div>
      <div>
        <img src="/images/slide2.png" alt="AI 감정 분석" />
      </div>
      <div>
        <img src="" alt="OTT 추천" />
      </div>
    </Slider>
  );
};

export default ServiceSlider;
