import { Button, message, Modal } from "antd";
import React, { useState } from "react";
import moment from "moment";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Displaymodal({ record, data, setData }) {
  // console.log(record.name);
  // const { record } = record;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setloading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    // console.log(record.record.name);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    setloading(true);
    await updateDoc(doc(db, "Patients", record.id), {
      // ...d,
      // unixTime: moment().unix(),
      isDeleted: true,
    });
    setloading(false);
    setIsModalVisible(false);
    message.success("Record deleted successfully!!");

    setData((d) => d.filter((a) => a.id !== record.id));

    // for (var d of data) {
    //   if (d.id != rowId) {
    // update data
    // set Data
    // }
    // }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Other
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        id={record.id}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleDelete} loading={loading}>
            Delete
          </Button>,

          // <Button key="back" onClick={handleCancel}>
          //   Return
          // </Button>,

          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,

          // <Button
          //   key="link"
          //   href="https://google.com"
          //   type="primary"
          //   onClick={handleOk}
          // >
          //   Search on Google
          // </Button>,
        ]}
      >
        {/* New Component */}
        <p>Name: {record.name}</p>
        <p>Amount: {record.amount}</p>
        <p>Address: {record.address}</p>
        <p>Prescription: {record.prescription}</p>
        <p>
          <b>Signs and Symptoms:</b> {record.signsAndSymptoms}
        </p>
        <p>
          Date:
          {moment.unix(record.unixTime).format("DD MMM, YYYY [at] hh:mm:ss a")}
        </p>
      </Modal>
    </>
  );
}
