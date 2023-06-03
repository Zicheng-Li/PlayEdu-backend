import React, { useState, useEffect } from "react";
import { Modal, Form, TreeSelect, Input, message } from "antd";
import styles from "./create.module.less";
import { useSelector } from "react-redux";
import { user, department } from "../../../api/index";
import { UploadImageButton } from "../../../compenents";
import { ValidataCredentials } from "../../../utils/index";

interface PropInterface {
  open: boolean;
  depIds: any;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const MemberCreate: React.FC<PropInterface> = ({
  open,
  depIds,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const memberDefaultAvatar = useSelector(
    (state: any) => state.systemConfig.value.memberDefaultAvatar
  );
  const [avatar, setAvatar] = useState<string>(memberDefaultAvatar);

  useEffect(() => {
    if (open) {
      getParams();
    }
  }, [open]);

  useEffect(() => {
    form.setFieldsValue({
      email: "",
      name: "",
      password: "",
      avatar: memberDefaultAvatar,
      idCard: "",
      dep_ids: depIds,
    });
    setAvatar(memberDefaultAvatar);
  }, [form, open, depIds]);

  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setDepartments(new_arr);
      }
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    if (values.idCard !== "" && !ValidataCredentials(values.idCard)) {
      message.error("Please enter正确的ID！");
      return;
    }
    user
      .storeUser(
        values.email,
        values.name,
        values.avatar,
        values.password,
        values.idCard,
        values.dep_ids
      )
      .then((res: any) => {
        message.success("Save Successfully！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Addstudent"
        centered
        forceRender
        open={open}
        width={484}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
        maskClosable={false}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div className="member-form float-left mt-24">
          <Form
            form={form}
            name="create-basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="studentAvatar"
              labelCol={{ style: { marginTop: 15, marginLeft: 46 } }}
              name="avatar"
              rules={[{ required: true, message: "请UploadstudentAvatar!" }]}
            >
              <div className="d-flex">
                {avatar && (
                  <img className="form-avatar mr-16" src={avatar} alt="" />
                )}
                <div className="d-flex">
                  <UploadImageButton
                    text="ChangeAvatar"
                    onSelected={(url) => {
                      setAvatar(url);
                      form.setFieldsValue({ avatar: url });
                    }}
                  ></UploadImageButton>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="studentName"
              name="name"
              rules={[{ required: true, message: "Please enterstudentName!" }]}
            >
              <Input style={{ width: 274 }} placeholder="Please fill instudentName" />
            </Form.Item>
            <Form.Item
              label="Login Email"
              name="email"
              rules={[{ required: true, message: "Please enterLogin Email!" }]}
            >
              <Input
                allowClear
                style={{ width: 274 }}
                placeholder="Please enterstudentLogin Email"
              />
            </Form.Item>
            <Form.Item
              label="Login Password"
              name="password"
              rules={[{ required: true, message: "Please enterLogin Password!" }]}
            >
              <Input.Password
                allowClear
                style={{ width: 274 }}
                placeholder="Please enterLogin Password"
              />
            </Form.Item>
            <Form.Item
              label="Department"
              name="dep_ids"
              rules={[{ required: true, message: "Please selectstudentDepartment!" }]}
            >
              <TreeSelect
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                style={{ width: 274 }}
                treeData={departments}
                multiple
                allowClear
                treeDefaultExpandAll
                placeholder="Please selectstudentDepartment"
              />
            </Form.Item>
            <Form.Item label="ID" name="idCard">
              <Input
                style={{ width: 274 }}
                allowClear
                placeholder="Please fill instudentID"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
