import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { Button, Checkbox, Form, Input, Select, Table, Modal } from "antd";
import Displaymodal from "./Displaymodal";
import Editmodal from "./Editmodal";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";

export default function HomePage({ user }) {
  // console.log(user);
  const patientsRef = collection(db, "Patients");
  const [data, setData] = useState([]);

  const [limitValue, setLimitValue] = useState(10);

  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState({});

  const closeModal = () => {
    setModalVisible(false);
  };

  // API DATA
  // address: "Test 4"
  // age: "18"
  // amount: "8888"
  // gender: "male"
  // id: "ObCa4bVABsGRD0uWuROp"
  // name: "Test 4"
  // phoneNumber: "9657867002"
  // prescription: "Test 4"
  // signsAndSymptoms: "Test 4"
  // unixTime: 1656698141

  const columns = [
    {
      title: "Sr. No.",
      key: "index",
      width: "10px",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "unixTime",
      key: "unixTime",
      align: "center",
      render: (text, record) =>
        moment.unix(text).format("DD MMM, YYYY [at] hh:mm:ss a"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Other Info",
      align: "center",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Displaymodal
          id={record.id}
          record={record}
          data={data}
          setData={setData}
        />
        // <></>
      ),
    },
  ];

  const searchData = async () => {
    setLoading(true);
    var q = query(
      patientsRef,
      orderBy(searchBy),
      startAt(search),
      endAt(search + "\uf8ff")
    );

    const firebasequery = await getDocs(q);

    var newData = firebasequery.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    setData(newData);
    setLoading(false);
  };

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "inline-flex",
          width: "100%",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <h3>Welcome {user.displayName} !</h3>
        <Button
          // style={{ float: "right", margin: "20px" }}
          type="link"
          onClick={() => {
            window.location.href = "/#/form";
          }}
        >
          Add new Patient
        </Button>
      </div>

      {/* <Button style={{ marginLeft: "10px" }} onClick={getAll}>
                Get all
            </Button> */}

      {/* <span style={{ marginBottom: "10px" }}> */}
      <div style={{ margin: "10px 10px" }}>
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <label>Limit :</label>
          <Input
            type={"number"}
            value={limitValue}
            onChange={(e) => setLimitValue(e.target.value)}
            style={{ width: "100px", marginLeft: "10px" }}
          />
        </span>
        <Button onClick={getData} style={{ marginLeft: "5px" }}>
          Get Data
        </Button>

        <span style={{ float: "right", marginRight: "20px" }}>
          <Input
            type={"text"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "200px", marginLeft: "10px" }}
          />
          <Select
            value={searchBy}
            onChange={(val) => setSearchBy(val)}
            style={{ width: "100px", margin: "0px 10px" }}
          >
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="age">Age</Select.Option>
            <Select.Option value="phoneNumber">Phone Number</Select.Option>
          </Select>
          <Button onClick={searchData}>Search</Button>
        </span>
      </div>
      {/* </span> */}

      <Table
        columns={columns}
        // bordered={true}
        dataSource={data}
        loading={loading}
        pagination={false}
        // sticky={true}

        onRow={(record) => {
          return {
            onDoubleClick: () => {
              setModalVisible(true);
              setActiveRecord(record);
              // console.log("Record double clicked");
              // console.log(record);
            },
          };
        }}
      />
      {modalVisible && (
        <Editmodal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          activeRecord={activeRecord}
          data={data}
          setData={setData}
          limitValue={limitValue}
          setLimitValue={setLimitValue}
        />
      )}
    </div>
  );
}

// Improve CSS of Form and evrthing else
// Add Modal and add all other info in it
// Limit should be configurable
// Search table

/*
	<mODAL
		visible={isVisble}
	>
		<Data Component 
			data={data}
		/>

	<mODAL>


*/
