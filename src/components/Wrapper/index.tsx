import style from "./styles.module.css";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className={style.wrapper}>{children}</div>;
};

export default Wrapper;
