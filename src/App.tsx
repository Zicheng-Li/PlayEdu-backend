import { Suspense } from "react";
import styles from "./App.module.less";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import LoadingPage from "./pages/loading";
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';

function App() {
  const Views = () => useRoutes(routes);

  return (
    <ConfigProvider locale={enUS}>
      <Suspense fallback={<LoadingPage />}>
        <div className={styles.App}>
          <Views />
        </div>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;


