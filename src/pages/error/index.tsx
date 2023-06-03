import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="The page you visited does not exist"
      className={styles["main"]}
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Back to top
        </Button>
      }
    />
  );
};

export default ErrorPage;
