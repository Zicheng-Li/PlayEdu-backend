import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Cascader, message } from "antd";
import styles from "./create.module.less";
import { department } from "../../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const DepartmentCreate: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [parent_id, setParentId] = useState<number>(0);

  useEffect(() => {
    if (open) {
      getParams();
    }
  }, [open]);

  useEffect(() => {
    form.setFieldsValue({
      name: "",
      parent_id: [0],
    });
  }, [form, open]);

  const getParams = () => {
    department.createDepartment().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        new_arr.unshift({
          label: "As a first-level department",
          value: 0,
        });
        setDepartments(new_arr);
      } else {
        const new_arr: Option[] = [];
        new_arr.unshift({
          label: "As a first-level department",
          value: 0,
        });
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
    department
      .storeDepartment(values.name, parent_id || 0, 0)
      .then((res: any) => {
        message.success("Save Successfully!");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {
    if (value !== undefined) {
      let it = value[value.length - 1];
      setParentId(it);
    } else {
      setParentId(0);
    }
  };

  const displayRender = (label: any, selectedOptions: any) => {
    return label[label.length - 1];
  };

  return (
    <>
      <Modal
        title="New Departments"
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
              label="Affiliated"
              name="parent_id"
              rules={[{ required: true, message: "Please select Affiliated!" }]}
            >
              <Cascader
                style={{ width: 200 }}
                allowClear
                placeholder="Please select Affiliated"
                onChange={handleChange}
                options={departments}
                changeOnSelect
                expand-trigger="hover"
                displayRender={displayRender}
              />
            </Form.Item>
            <Form.Item
              label="Department Name"
              name="name"
              rules={[{ required: true, message: "Please enter Department Name!" }]}
            >
              <Input
                style={{ width: 200 }}
                allowClear
                placeholder="Please enter Department Name"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
