import React, { useState, useEffect } from "react";
import { Modal, Select, Switch, Form, Input, message } from "antd";
import styles from "./create.module.less";
import { adminUser } from "../../../../api/index";

interface PropInterface {
  roleId: number;
  refresh: boolean;
  open: boolean;
  onCancel: () => void;
}

export const SystemAdministratorCreate: React.FC<PropInterface> = ({
  roleId,
  refresh,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    if (open) {
      getParams();
    }
  }, [refresh, open]);

  useEffect(() => {
    let roleIds = [];
    if (roleId) {
      roleIds.push(roleId);
    }
    form.setFieldsValue({
      email: "",
      name: "",
      password: "",
      is_ban_login: 0,
      roleIds: roleIds,
    });
  }, [form, open, roleId]);

  const getParams = () => {
    adminUser.createAdminUser().then((res: any) => {
      const arr = [];
      let roles = res.data.roles;
      for (let i = 0; i < roles.length; i++) {
        arr.push({
          label: roles[i].name,
          value: roles[i].id,
        });
      }
      setRoles(arr);
    });
  };

  const onFinish = (values: any) => {
    adminUser
      .storeAdminUser(
        values.name,
        values.email,
        values.password,
        values.is_ban_login,
        values.roleIds
      )
      .then((res: any) => {
        message.success("Save Successfully!");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {};

  const onChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ is_ban_login: 1 });
    } else {
      form.setFieldsValue({ is_ban_login: 0 });
    }
  };

  return (
    <>
      <Modal
        title="Add Admin"
        centered
        forceRender
        open={open}
        width={416}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
        maskClosable={false}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div className="float-left mt-24">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Select Role"
              name="roleIds"
              rules={[{ required: true, message: "Please select Role!" }]}
            >
              <Select
                style={{ width: 200 }}
                mode="multiple"
                allowClear
                placeholder="Please select role"
                onChange={handleChange}
                options={roles}
              />
            </Form.Item>
            <Form.Item
              label="Admin Name"
              name="name"
              rules={[{ required: true, message: "Please enterAdminName!" }]}
            >
              <Input
                allowClear
                style={{ width: 200 }}
                placeholder="Please enter Admin Name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enterstudentEmail!" }]}
            >
              <Input
                allowClear
                style={{ width: 200 }}
                placeholder="Please enterstudentEmail"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enterLogin Password!" }]}
            >
              <Input.Password
                allowClear
                style={{ width: 200 }}
                placeholder="Please enterLogin Password"
              />
            </Form.Item>

            <Form.Item
              label="Disable Login"
              name="is_ban_login"
              valuePropName="checked"
            >
              <Switch onChange={onChange} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
