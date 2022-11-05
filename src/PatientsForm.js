import React, { useState } from "react";
import { Button, Form, Input, Select, Alert, message } from "antd";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import moment from "moment";
const { Option } = Select;

export default function PatientsForm() {
  const [form] = Form.useForm();
  const patientsRef = collection(db, "Patients");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // console.log("Success:", values);
    await addDoc(patientsRef, {
      ...values,
      unixTime: moment().unix(),
      isDeleted: false,
    });
    // Alert not working!
    message.success("Patient added successfully!", [3]);
    form.resetFields();
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Forms should have the following fields
  // amount: 200
  // noOfDays: "15"
  // prescription: "Heparsulph"
  // signsAndSymptoms: "Thirsty , Foodie"

  return (
    // <div className="outerContainer">
    <div>
      <Button
        style={{ float: "right", margin: "20px" }}
        type="link"
        onClick={() => {
          window.location.href = "/#/";
        }}
      >
        Go To Table
      </Button>
      <div style={{ textAlign: "center" }}>
        <div className="formContainer">
          <h1>Add Patient</h1>
          <Form
            form={form}
            name="basic"
            style={{ maxWidth: "600px" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelAlign="top"
          >
            <Form.Item
              labelCol={{ span: 8 }}
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              label="Age"
              name="age"
              rules={[{ required: true, message: "Please input your age!" }]}
            >
              <Input type="number" disabled={loading} />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input type="tel" disabled={loading} />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please input your gender" }]}
            >
              <Select placeholder="Gender" disabled={loading}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              labelCol={{ span: 8 }}
              label="Signs and Symptoms"
              name="signsAndSymptoms"
              rules={[
                {
                  required: true,
                  message: "Please input your Signs and Symptoms!",
                },
              ]}
            >
              <Input.TextArea autoSize disabled={loading} />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 8 }}
              label="Prescription"
              name="prescription"
              rules={[
                { required: true, message: "Please input your prescription!" },
              ]}
            >
              <Input.TextArea autoSize disabled={loading} />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 8 }}
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please input your amount!" }]}
            >
              <Input type="number" disabled={loading} />
            </Form.Item>

            <Button
              className="submitButton"
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Add Patient
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
