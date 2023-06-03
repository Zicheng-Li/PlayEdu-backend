import { Spin } from "antd";
import styles from "./index.module.less";

const LoadingPage = () => {
  return (
    <div className={styles["loading-parent-box"]}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;
