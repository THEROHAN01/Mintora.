import React from 'react';
import "./style.css";
import { Select, Table } from 'antd';
import { useState } from 'react';
import { Option } from 'antd/es/mentions';
import { Radio } from 'antd';
import searchImg from '../../assets/search.svg';
import { unparse } from "papaparse";





function TransactionsTable({transactions}) {
    const[search, setSearch] = useState("");
    const[typeFilter,setTypeFilter]= useState("");
    const[sortKey,setsortKey] = useState("");




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
    

     let filteredTransactions = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter));
     let sortedTransactions = filteredTransactions.sort((a,b) => {
        if(sortKey === "date"){
            return new Date(a.date) - new Date(b.date);
        }else if(sortKey === "amount"){
            return parseFloat(a.amount) - parseFloat(b.amount);
        } else {
            return 0;
        }
     }) ;


     function exportCSV(){
        var csv = unparse({
            fields: ["name", "type","tag", "date","amount"],
            data: transactions,
        });
        var blob = new Blob ([csv], {type:"text/csv;charset=utf-8"});
        var url = URL.createObjectURL(blob);
        const link= document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
      
        return (
        <>

        <div 
            style={{
                width:"96%",
                padding:"0rem 2rem"
            }}>

       

        <div  style={{
            display:"flex",
            justifyContent:"space-between",
            gap:"1rem",
            alignItems:"center",
            marginBottom:"1rem"
        }}>
        <div className='input-flex'>
            <img src={searchImg} width="16"/>
            <input
                value = { search }
                placeholder='Search by Name'
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        
        <Select
            className = "select-input"
            onChange={(value) => setTypeFilter(value)}
            value = {typeFilter}
            placeholder = "Filter"
            allowClear
        >
            <Option value="">All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
            </Select>    
        </div>    
        <div className='my-table'>
        <div
            style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                width:"100%",
                marginBottom:"1rem"
            }}
            >
            <h2 style={{color:"var(--theme)"}}> My Transactions</h2>    
            <Radio.Group
                className='input-radio'
                onChange={(e) => setsortKey(e.target.value)}
                value={sortKey}
                >
                    <Radio.Button value ="">No Sort</Radio.Button>
                    <Radio.Button value ="date">Sort by Date</Radio.Button>
                    <Radio.Button value ="ammount">Sort by Amount</Radio.Button>

                </Radio.Group>

                <div 
                    style={{
                        display:"flex",
                        justifyContent:"center",
                        gap:"1rem",
                        width:"400px"
                    }}>

                    <div onClick={exportCSV} className='btn'>
                        Export To CSV
                    </div>
                    <label for="file-csv" className='btn btn-blue'>
                        Import from CSV
                    </label>
                    <input 
                        id="file-csv"
                        type="file"
                        accept='.csv'
                        required
                        style={{display:'none'}}
                        />


                </div>
                </div>


        <Table className='table' dataSource = { sortedTransactions } columns = { columns } />
                    </div>
            </div>
            </>
        );


}

export default TransactionsTable;
