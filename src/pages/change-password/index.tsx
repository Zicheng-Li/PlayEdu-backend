import { Row, Col, Form, Input, Button, message } from "antd";
// import styles from "./create.module.less";
import { login } from "../../api/index";
import { useNavigate } from "react-router-dom";
import { BackBartment } from "../../compenents";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    login
      .passwordChange(values.old_password, values.new_password)
      .then((res: any) => {
        message.success("Save Successfully！");
        navigate(-1);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="Change Password" />
          </div>
          <div className="float-left">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Old Password"
                name="old_password"
                rules={[{ required: true, message: "Please enter Old Password!" }]}
              >
                <Input.Password placeholder="Please enter Old Password" allowClear />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="new_password"
                rules={[{ required: true, message: "Please enter New Password!" }]}
              >
                <Input.Password placeholder="Please enter New Password" allowClear />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button
                  className="ml-15"
                  htmlType="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChangePasswordPage;
