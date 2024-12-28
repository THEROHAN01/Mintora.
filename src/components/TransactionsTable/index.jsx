import React from 'react';
import "./style.css";
import { Select, Table } from 'antd';
import { useState } from 'react';
import { Option } from 'antd/es/mentions';



function TransactionsTable({transactions}) {
    const[search, setSearch] = useState("");
    const[typeFilter,setTypeFilter]= useState("");



     const columns = [
        {
            title: 'Name',
            dataIndex: "name",
            key: "name"
        },
        {
            title: 'Amount',
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: 'Tag',
            dataIndex: "tag",
            key: "tag"
        },
        {
            title: 'Type',
            dataIndex: "type",
            key: "type"
        },
        {
            title: 'Date',
            dataIndex: "date",
            key: "date"
        }
        
     ];

     let filteredTransactions = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));


        return (
        <>
        
        <input 
        className='input'
        value = {search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search by name'
        />
        <Select
            className = "select-input"
            onChange={(e) => setTypeFilter(value)}
            value = {typeFilter}
            placeholder = "Filter"
            allowClear
        >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
            </Select>    
        <Table className='table' dataSource = { filteredTransactions } columns = { columns  } />

            </>
        );


}

export default TransactionsTable;
