import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, Cascader, message } from "antd";
import styles from "./create.module.less";
import { resourceCategory } from "../../../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const ResourceCategoryCreate: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<any>([]);
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
    resourceCategory.createResourceCategory().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        new_arr.unshift({
          label: "As a first-level category",
          value: 0,
        });
        setCategories(new_arr);
      } else {
        const new_arr: Option[] = [];
        new_arr.unshift({
          label: "As a first-level category",
          value: 0,
        });
        setCategories(new_arr);
      }
    });
  };

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          label: categories[id][i].name,
          value: categories[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          label: categories[id][i].name,
          value: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    resourceCategory
      .storeResourceCategory(values.name, parent_id || 0, 0)
      .then((res: any) => {
        message.success("Save successfully!");
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
        title="New Category"
        centered
        forceRender
        maskClosable={false}
        open={open}
        width={416}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
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
                options={categories}
                changeOnSelect
                expand-trigger="hover"
                displayRender={displayRender}
              />
            </Form.Item>
            <Form.Item
              label="Category Name"
              name="name"
              rules={[{ required: true, message: "Please enter the category name!" }]}
            >
              <Input
                style={{ width: 200 }}
                allowClear
                placeholder="Please enter the category name"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
