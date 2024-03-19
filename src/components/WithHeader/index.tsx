import style from "./styles.module.css";

interface WithHeaderProps {
  children: React.ReactNode;
  width: `small` | `large`;
}

const WithHeader: React.FC<WithHeaderProps> = ({ children, width }) => {
  return (
    <div
      className={`${style.layout} ${
        width === "small" ? style.small : style.large
      }`}
    >
      <h1>Battleship</h1>
      {children}
    </div>
  );
};

export default WithHeader;
