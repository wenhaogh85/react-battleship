import style from "./styles.module.css";

interface BannerProps {
  title: string;
  color: `maroon` | `dark-grey` | `violet`;
}

const Banner: React.FC<BannerProps> = ({ title, color }) => {
  return (
    <div
      className={`${style.banner} ${
        color === `maroon`
          ? style.maroon
          : color === `violet`
          ? style.violet
          : style.darkGrey
      }`}
    >
      <h2>{title}</h2>
    </div>
  );
};

export default Banner;
