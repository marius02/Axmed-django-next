"use client";

import React, { useState, useEffect } from "react";
import type { TableProps } from "antd";
import {
  getProducts,
  createProducts,
  updateProducts,
  deleteProduct,
} from "@/app/utils/products";
import {
  Button,
  Tooltip,
  Form,
  Input,
  Popconfirm,
  Table,
  InputNumber,
  Typography,
} from "antd";
import {
  CreditCardOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface Item {
  key: string;
  id: number;
  name: string;
  dose: string;
  presentation: string;
  unit: number;
  country: string;
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: string;
  id?: number;
  name: string;
  dose: string;
  presentation: string;
  unit: number;
  country: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const Dashboard: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [count, setCount] = useState(2);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record.key === editingKey;

  const add = () => {
    const newData: DataType = {
      key: `${count}`,
      name: "",
      dose: "",
      presentation: "",
      unit: 0,
      country: "",
    };
    setDataSource([...dataSource, newData]);
    setIsAdding(true);
    setCount(count + 1);
    setEditingKey(newData.key);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    const deletedData = dataSource.filter((item) => item.key === key);
    if (deletedData[0].id) {
      deleteProduct(deletedData[0].id);
    }
    setDataSource(newData);
  };

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      name: "",
      dose: "",
      presentation: "",
      unit: 0,
      country: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        let tmp;
        if (item.id) {
          tmp = updateProducts({ ...row, id: item.id });
        } else {
          tmp = createProducts(row);
        }
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }
      setIsAdding(false);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const cancel = (key: React.Key) => {
    if (isAdding) {
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
    }
    setIsAdding(false);
    setEditingKey("");
  };

  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "15%",
      editable: true,
    },
    {
      title: "Dose",
      dataIndex: "dose",
      width: "20%",
      editable: true,
    },
    {
      title: "Presentation",
      dataIndex: "presentation",
      width: "20%",
      editable: true,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: "10%",
      editable: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      width: "15%",
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return (
          <div className="flex flex-row">
            <div className="px-2">
              {editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => {
                      cancel(record.key);
                    }}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Tooltip title="Edit">
                  <Typography.Link
                    disabled={editingKey !== ""}
                    onClick={() => edit(record)}
                  >
                    <CreditCardOutlined className="yellow-600 mr-2" />
                  </Typography.Link>
                </Tooltip>
              )}
            </div>
            {!editable && (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Sure to delete?"
                  disabled={editingKey !== ""}
                  onConfirm={() => handleDelete(record.key)}
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const columns: TableProps["columns"] = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getProducts();
        if (data) {
          const newData: DataType[] = [];
          data.forEach((item: any, index: number) => {
            newData.push({ ...item, key: `${index}` });
          });
          setDataSource(newData);
          setCount(newData.length);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getData();
  }, []);

  return (
    <Form form={form} component={false}>
      <Tooltip title="Add a new Product">
        <Button onClick={add} type="primary" style={{ marginBottom: 16 }}>
          Add
          <PlusOutlined />
        </Button>
      </Tooltip>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </Form>
  );
};

export default Dashboard;
