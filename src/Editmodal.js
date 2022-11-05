import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Select, message } from "antd";
import { db } from "./firebase";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
} from "firebase/firestore";

export default function Editmodal({
  modalVisible,
  setModalVisible,
  activeRecord,
  data,
  setData,
  limitValue,
  setLimitValue,
}) {
  //   const handleOk = () => {
  //     setModalVisible(false);
  //   };

  const patientsRef = collection(db, "Patients");

  const getData = async () => {
    setLoading(true);
    var q = query(
      patientsRef,
      where("isDeleted", "!=", true),
      orderBy("isDeleted"),
      orderBy("unixTime", "desc"),
      limit(limitValue)
    );

    const firebasequery = await getDocs(q);

    var newData = firebasequery.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    // console.log(newData);
    setData(newData);
    // getTotalAmount();
    setLoading(false);
    // console.log();
  };

  const { Option } = Select;

  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    setLoading(true);
    await updateDoc(doc(db, "Patients", activeRecord.id), {
      ...values,
    });
    message.success("Record updated successfully!!");
    getData();
    setLoading(false);
    setModalVisible(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Modal
        title="Edit Info"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="Cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        // centered="true"
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
            name: `${activeRecord.name}`,
            age: `${activeRecord.age}`,
            phoneNumber: `${activeRecord.phoneNumber}`,
            address: `${activeRecord.address}`,
            gender: `${activeRecord.gender}`,
            signsAndSymptoms: `${activeRecord.signsAndSymptoms}`,
            amount: `${activeRecord.amount}`,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone No."
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Please input gender!",
              },
            ]}
          >
            <Select placeholder="Gender" disabled={loading}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Signs and symptoms"
            name="signsAndSymptoms"
            rules={[
              {
                required: true,
                message: "Please input Data!",
              },
            ]}
          >
            <Input.TextArea autoSize />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input Amount!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
