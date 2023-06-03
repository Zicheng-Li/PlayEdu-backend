import { useState, useEffect } from "react";
import styles from "./index.module.less";
import { Spin, Input, Button, message } from "antd";
import { login as loginApi, system } from "../../api/index";
import { setToken } from "../../utils/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/images/login/banner.png";
import icon from "../../assets/images/login/icon.png";
import "./login.less";
import { loginAction } from "../../store/user/loginUserSlice";
import {
  SystemConfigStoreInterface,
  saveConfigAction,
} from "../../store/system/systemConfigSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaVal, setCaptchaVal] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const fetchImageCaptcha = () => {
    setCaptchaVal("");
    setCaptchaLoading(true);
    system.getImageCaptcha().then((res: any) => {
      setImage(res.data.image);
      setCaptchaKey(res.data.key);
      setCaptchaLoading(false);
    });
  };

  const loginSubmit = async () => {
    if (!email) {
      message.error("Please enter Admin Email");
      return;
    }
    if (!password) {
      message.error("Please enter Password");
      return;
    }
    if (!captchaVal) {
      message.error("Please enter the graphic verification code");
      return;
    }
    if (captchaVal.length !== 4) {
      message.error("Graphical CAPTCHA ERROR");
      return;
    }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      let res: any = await loginApi.login(
        email,
        password,
        captchaKey,
        captchaVal
      );
      setToken(res.data.token); //将token写入本地
      await getSystemConfig(); //获取系统配置并写入store
      await getUser(); //获取Login用户的信息并写入store

      navigate("/", { replace: true });
    } catch (e) {
      console.error("error", e);
      setLoading(false);
      fetchImageCaptcha(); //刷新图形验证码
    }
  };

  const getUser = async () => {
    let res: any = await loginApi.getUser();
    dispatch(loginAction(res.data));
  };

  const getSystemConfig = async () => {
    let res: any = await system.getSystemConfig();
    let data: SystemConfigStoreInterface = {
      systemName: res.data["system.name"],
      systemLogo: res.data["system.logo"],
      systemApiUrl: res.data["system.api_url"],
      systemPcUrl: res.data["system.pc_url"],
      systemH5Url: res.data["system.h5_url"],
      memberDefaultAvatar: res.data["member.default_avatar"],
      courseDefaultThumbs: res.data["default.course_thumbs"],
    };
    dispatch(saveConfigAction(data));
  };

  const keyUp = (e: any) => {
    if (e.keyCode === 13) {
      loginSubmit();
    }
  };

  useEffect(() => {
    fetchImageCaptcha();
  }, []);

  return (
    <div className={styles["login-content"]}>
      <div className={styles["banner-box"]}>
        <img className={styles["banner"]} src={banner} alt="" />
      </div>
      <div className={styles["login-box"]}>
        <div className={styles["left-box"]}>
          <img className={styles["icon"]} src={icon} alt="" />
        </div>
        <div className={styles["right-box"]}>
          <div className={styles["title"]}>Login</div>
          <div className="login-box d-flex mt-50">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: 400, height: 54 }}
              placeholder="Please enter Admin Email"
              onKeyUp={(e) => keyUp(e)}
              allowClear
            />
          </div>
          <div className="login-box d-flex mt-50">
            <Input.Password
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              allowClear
              style={{ width: 400, height: 54 }}
              placeholder="Please enter Password"
            />
          </div>
          <div className="d-flex mt-50">
            <Input
              value={captchaVal}
              style={{ width: 260, height: 54 }}
              placeholder="Please enter the graphic verification code"
              onChange={(e) => {
                setCaptchaVal(e.target.value);
              }}
              allowClear
              onKeyUp={(e) => keyUp(e)}
            />
            <div className={styles["captcha-box"]}>
              {captchaLoading && (
                <div className={styles["catpcha-loading-box"]}>
                  <Spin size="small" />
                </div>
              )}

              {!captchaLoading && (
                <img
                  className={styles["captcha"]}
                  onClick={fetchImageCaptcha}
                  src={image}
                />
              )}
            </div>
          </div>
          <div className="login-box d-flex mt-50">
            <Button
              style={{ width: 400, height: 54 }}
              type="primary"
              onClick={loginSubmit}
              loading={loading}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
