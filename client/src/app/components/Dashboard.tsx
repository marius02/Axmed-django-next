"use client";

import React, { useState, useEffect } from "react";
import type { TableProps } from "antd";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  InputNumber,
  Typography,
} from "antd";

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
  return (
    <>
    </>
  );
}

export default Dashboard;