import { useState, useEffect } from "react";
import {
  Row,
  Form,
  Input,
  Image,
  Button,
  Tabs,
  message,
  Switch,
  Checkbox,
  Slider,
  Space,
} from "antd";
// import styles from "./index.module.less";
import { appConfig } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import type { TabsProps } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

const SystemConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");
  const [thumb, setThumb] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [tabKey, setTabKey] = useState(1);
  const [nameChecked, setNameChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [idCardchecked, setIdCardChecked] = useState(false);

  useEffect(() => {
    getDetail();
  }, [tabKey]);

  const getDetail = () => {
    appConfig.appConfig().then((res: any) => {
      let configData = res.data;
      for (let i = 0; i < configData.length; i++) {
        if (configData[i].key_name === "system.name") {
          form.setFieldsValue({
            "system.name": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.logo") {
          form.setFieldsValue({
            "system.logo": configData[i].key_value,
          });
          if (configData[i].key_value !== "") {
            setLogo(configData[i].key_value);
          }
        } else if (configData[i].key_name === "system.api_url") {
          form.setFieldsValue({
            "system.api_url": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.pc_url") {
          form.setFieldsValue({
            "system.pc_url": configData[i].key_value,
          });
        } else if (configData[i].key_name === "system.h5_url") {
          form.setFieldsValue({
            "system.h5_url": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.poster") {
          setThumb(configData[i].key_value);
          form.setFieldsValue({
            "player.poster": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.disabled_drag") {
          let value = 0;
          if (configData[i].key_value === "1") {
            value = 1;
          }
          form.setFieldsValue({
            "player.disabled_drag": value,
          });
        } else if (
          configData[i].key_name === "player.is_enabled_bullet_secret"
        ) {
          let value = 0;
          if (configData[i].key_value === "1") {
            value = 1;
          }
          form.setFieldsValue({
            "player.is_enabled_bullet_secret": value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_text") {
          if (configData[i].key_value.indexOf("{name}") != -1) {
            setNameChecked(true);
          }
          if (configData[i].key_value.indexOf("{email}") != -1) {
            setEmailChecked(true);
          }
          if (configData[i].key_value.indexOf("{idCard}") != -1) {
            setIdCardChecked(true);
          }
          form.setFieldsValue({
            "player.bullet_secret_text": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_color") {
          form.setFieldsValue({
            "player.bullet_secret_color": configData[i].key_value,
          });
        } else if (configData[i].key_name === "player.bullet_secret_opacity") {
          let value = 0;
          if (configData[i].key_value !== "") {
            value = Number(configData[i].key_value) * 100;
          }
          form.setFieldsValue({
            "player.bullet_secret_opacity": value,
          });
        } else if (configData[i].key_name === "system.pc_index_footer_msg") {
          form.setFieldsValue({
            "system.pc_index_footer_msg": configData[i].key_value,
          });
        } else if (configData[i].key_name === "member.default_avatar") {
          setAvatar(configData[i].key_value);
          form.setFieldsValue({
            "member.default_avatar": configData[i].key_value,
          });
        } else if (configData[i].key_name === "minio.access_key") {
          form.setFieldsValue({
            "minio.access_key": configData[i].key_value,
          });
        } else if (configData[i].key_name === "minio.secret_key") {
          form.setFieldsValue({
            "minio.secret_key": configData[i].key_value,
          });
        } else if (configData[i].key_name === "minio.bucket") {
          form.setFieldsValue({
            "minio.bucket": configData[i].key_value,
          });
        } else if (configData[i].key_name === "minio.endpoint") {
          form.setFieldsValue({
            "minio.endpoint": configData[i].key_value,
          });
        } else if (configData[i].key_name === "minio.domain") {
          form.setFieldsValue({
            "minio.domain": configData[i].key_value,
          });
        }
      }
    });
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ "player.is_enabled_bullet_secret": 1 });
    } else {
      form.setFieldsValue({ "player.is_enabled_bullet_secret": 0 });
    }
  };

  const onDragChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ "player.disabled_drag": 1 });
    } else {
      form.setFieldsValue({ "player.disabled_drag": 0 });
    }
  };

  const addName = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{name}";
    } else {
      value = value.replace("{name}", "");
    }
    form.setFieldsValue({
      "player.bullet_secret_text": value,
    });
    setNameChecked(!nameChecked);
  };

  const addEmail = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{email}";
    } else {
      value = value.replace("{email}", "");
    }
    form.setFieldsValue({
      "player.bullet_secret_text": value,
    });
    setEmailChecked(!emailChecked);
  };
  const addIdCard = (e: CheckboxChangeEvent) => {
    var value = form.getFieldValue("player.bullet_secret_text");
    if (e.target.checked) {
      value += "{idCard}";
    } else {
      value = value.replace("{idCard}", "");
    }
    form.setFieldsValue({
      "player.bullet_secret_text": value,
    });
    setIdCardChecked(!idCardchecked);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    values["player.bullet_secret_opacity"] =
      values["player.bullet_secret_opacity"] / 100;
    appConfig.saveAppConfig(values).then((res: any) => {
      message.success("Save Successfully！");
      setLoading(false);
      getDetail();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Website Settings`,
      children: (
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          style={{ width: 1000, paddingTop: 30 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {logo && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Web Logo"
              name="system.logo"
              labelCol={{ style: { marginTop: 4, marginLeft: 54 } }}
            >
              <div className="d-flex">
                <Image preview={false} height={40} src={logo} />
                <div className="d-flex ml-24">
                  <UploadImageButton
                    text="Change Logo"
                    onSelected={(url) => {
                      setLogo(url);
                      form.setFieldsValue({ "system.logo": url });
                    }}
                  ></UploadImageButton>
                </div>
                <div className="helper-text ml-24">
                 (Recommended size: 240x80px, support JPG, PNG)
                </div>
              </div>
            </Form.Item>
          )}
          {!logo && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Website Logo"
              name="system.logo"
            >
              <div className="d-flex">
                <div className="d-flex ml-24">
                  <UploadImageButton
                    text="ChangeLogo"
                    onSelected={(url) => {
                      setLogo(url);
                      form.setFieldsValue({ "system.logo": url });
                    }}
                  ></UploadImageButton>
                </div>
                <div className="helper-text ml-24">
                (Recommended size: 240x80px, support JPG, PNG)
                </div>
              </div>
            </Form.Item>
          )}
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Website Title"
            name="system.name"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill in Website Title"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Website Footer"
            name="system.pc_index_footer_msg"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inWebsite Footer"
            />
          </Form.Item>
          {/* <Form.Item
            style={{ marginBottom: 30 }}
            label="API访问地址"
            name="system.api_url"
          >
            <Input style={{ width: 274 }} placeholder="Please fill inAPI访问地址" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="PC端访问地址"
            name="system.pc_url"
          >
            <Input style={{ width: 274 }} placeholder="Please fill inPC端访问地址" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="H5端访问地址"
            name="system.h5_url"
          >
            <Input style={{ width: 274 }} placeholder="Please fill inH5端访问地址" />
          </Form.Item> */}
          <Form.Item
            style={{ marginBottom: 30 }}
            wrapperCol={{ offset: 3, span: 21 }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: `Play Settings`,
      children: (
        <Form
          form={form}
          name="n-basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          style={{ width: 1000, paddingTop: 30 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item style={{ marginBottom: 30 }} label="Dragging bar">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="player.disabled_drag" valuePropName="checked">
                <Switch onChange={onDragChange} />
              </Form.Item>
              <div className="helper-text ml-24">
                (Open and prohibit students from dragging the progress bar in the first study to prevent brushing up the lesson)
              </div>
            </Space>
          </Form.Item>
          <Form.Item style={{ marginBottom: 30 }} label="Watermark">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="player.is_enabled_bullet_secret"
                valuePropName="checked"
              >
                <Switch onChange={onSwitchChange} />
              </Form.Item>
              <div className="helper-text ml-24">
              (After opening the player will randomly appear running watermark to prevent the spread of recorded screens)
              </div>
            </Space>
          </Form.Item>
          <Form.Item style={{ marginBottom: 30 }} label="Watermark content">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="player.bullet_secret_text">
                <Input
                  style={{ width: 274 }}
                  allowClear
                  placeholder="Customized Watermark content"
                />
              </Form.Item>
              <Checkbox
                checked={nameChecked}
                className="ml-24"
                onChange={addName}
              >
                Name
              </Checkbox>
              <Checkbox
                checked={emailChecked}
                className="ml-24"
                onChange={addEmail}
              >
                Email
              </Checkbox>
              <Checkbox
                checked={idCardchecked}
                className="ml-24"
                onChange={addIdCard}
              >
                ID
              </Checkbox>
            </Space>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Text color"
            name="player.bullet_secret_color"
          >
            <Input type="color" style={{ width: 32, padding: 0 }} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Watermark opacity"
            name="player.bullet_secret_opacity"
          >
            <Slider style={{ width: 400 }} range defaultValue={[0, 100]} />
          </Form.Item>
          {thumb && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Player cover"
              name="player.poster"
              labelCol={{ style: { marginTop: 75, marginLeft: 42 } }}
            >
              <div className="d-flex">
                <Image
                  preview={false}
                  height={180}
                  src={thumb}
                  style={{ borderRadius: 6 }}
                />
                <div className="d-flex ml-24">
                  <UploadImageButton
                    text="Change cover"
                    onSelected={(url) => {
                      setThumb(url);
                      form.setFieldsValue({ "player.poster": url });
                    }}
                  ></UploadImageButton>
                  <div className="helper-text ml-24">
                  (Recommended size: 1920x1080px, video playback does not start when the display)
                  </div>
                </div>
              </div>
            </Form.Item>
          )}
          {!thumb && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Player cover"
              name="player.poster"
            >
              <div className="d-flex">
                <div className="d-flex">
                  <UploadImageButton
                    text="Change cover"
                    onSelected={(url) => {
                      setThumb(url);
                      form.setFieldsValue({ "player.poster": url });
                    }}
                  ></UploadImageButton>
                  <div className="helper-text ml-24">
                  (Recommended size: 1920x1080px, video playback does not start when the display)
                  </div>
                </div>
              </div>
            </Form.Item>
          )}
          <Form.Item
            style={{ marginBottom: 30 }}
            wrapperCol={{ offset: 3, span: 21 }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "3",
      label: `Student Settings`,
      children: (
        <Form
          form={form}
          name="m-basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          style={{ width: 1000, paddingTop: 30 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {avatar && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Default avatar"
              name="member.default_avatar"
              labelCol={{ style: { marginTop: 14, marginLeft: 28 } }}
            >
              <div className="d-flex">
                <Image
                  preview={false}
                  width={60}
                  height={60}
                  src={avatar}
                  style={{ borderRadius: "50%" }}
                />
                <div className="d-flex ml-24">
                  <UploadImageButton
                    text="Change Avatar"
                    onSelected={(url) => {
                      setAvatar(url);
                      form.setFieldsValue({ "member.default_avatar": url });
                    }}
                  ></UploadImageButton>
                  <div className="helper-text ml-24">(Default Avatar for new trainees)</div>
                </div>
              </div>
            </Form.Item>
          )}
          {!avatar && (
            <Form.Item
              style={{ marginBottom: 30 }}
              label="Default Avatar"
              name="member.default_avatar"
            >
              <div className="d-flex">
                <div className="d-flex">
                  <UploadImageButton
                    text="ChangeAvatar"
                    onSelected={(url) => {
                      setAvatar(url);
                      form.setFieldsValue({ "member.default_avatar": url });
                    }}
                  ></UploadImageButton>
                  <div className="helper-text ml-24">(Default Avatar for new students)</div>
                </div>
              </div>
            </Form.Item>
          )}
          <Form.Item
            style={{ marginBottom: 30 }}
            wrapperCol={{ offset: 3, span: 21 }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "4",
      label: `MinIO Storage`,
      children: (
        <Form
          form={form}
          name="IO-basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          style={{ width: 1000, paddingTop: 30 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: 30 }}
            label="AccessKey"
            name="minio.access_key"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inAccessKey"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="SecretKey"
            name="minio.secret_key"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inSecretKey"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Bucket"
            name="minio.bucket"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inBucket"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Endpoint"
            name="minio.endpoint"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inEndpoint"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            label="Domain"
            name="minio.domain"
          >
            <Input
              style={{ width: 274 }}
              allowClear
              placeholder="Please fill inDomain"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 30 }}
            wrapperCol={{ offset: 3, span: 21 }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Tabs
          className="float-left"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Row>
    </>
  );
};

export default SystemConfigPage;
