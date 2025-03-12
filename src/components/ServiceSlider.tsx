"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/styles/ServiceSlider.module.css";

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
      <div className={styles.slideContainer}>
        <img
          src="../images/slide11.png"
          alt="감성 일기 작성"
          className={styles.slideImage}
        />
      </div>
      <div className={styles.slideContainer}>
        <img
          src="../images/slide12.png"
          alt="AI 감정 분석"
          className={styles.slideImage}
        />
      </div>
      <div className={styles.slideContainer}>
        <img
          src="/images/slide13.png"
          alt="OTT 추천"
          className={styles.slideImage}
        />
      </div>
    </Slider>
  );
};

export default ServiceSlider;
