import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Cascader, message } from "antd";
import styles from "./update.module.less";
import { department } from "../../../api/index";

interface PropInterface {
  id: number;
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const DepartmentUpdate: React.FC<PropInterface> = ({
  id,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [parent_id, setParentId] = useState<number>(0);
  const [sort, setSort] = useState<number>(0);

  useEffect(() => {
    if (open) {
      getParams();
    }
  }, [open]);

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
      }
      if (id === 0) {
        return;
      }
      getDetail();
    });
  };

  const getDetail = () => {
    department.department(id).then((res: any) => {
      let data = res.data;
      let arr = data.parent_chain.split(",");
      let new_arr: any[] = [];
      arr.map((num: any) => {
        new_arr.push(Number(num));
      });
      form.setFieldsValue({
        name: data.name,
        parent_id: new_arr,
      });
      setParentId(data.parent_id);
      setSort(data.sort);
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (departments[id][i].id === id) {
        console.log("截断");
      } else if (!departments[departments[id][i].id]) {
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
      .updateDepartment(id, values.name, parent_id || 0, sort)
      .then((res: any) => {
        message.success("Save Successfully！");
        onCancel();
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {
    if (value !== undefined) {
      let it = value[value.length - 1];
      if (it === id) {
        setParentId(0);
      } else {
        setParentId(it);
      }
    } else {
      setParentId(0);
    }
  };

  const displayRender = (label: any, selectedOptions: any) => {
    if (selectedOptions && selectedOptions[0]) {
      let current = selectedOptions[selectedOptions.length - 1].value;
      if (current === id) {
        message.error("不能选择自己作为父类");
        return "无";
      }
    }

    return label[label.length - 1];
  };

  return (
    <>
      <Modal
        title="EditDepartment"
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
              rules={[{ required: true, message: "Please selectAffiliated!" }]}
            >
              <Cascader
                style={{ width: 200 }}
                allowClear
                placeholder="Please selectAffiliated"
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
              rules={[{ required: true, message: "Please enterDepartment Name!" }]}
            >
              <Input style={{ width: 200 }} placeholder="Please enterDepartment Name" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
