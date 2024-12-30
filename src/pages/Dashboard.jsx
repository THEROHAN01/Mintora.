import  { useEffect, useState } from 'react';
import Header from "../components/Header/index.jsx";
import Cards from '../components/Cards';
import { toast } from 'react-toastify';
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import AddIncomeModal from '../components/Modals/addincome.jsx';
import AddExpenseModal from '../components/Modals/addExpense.jsx';
import moment from "moment";
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionsTable from '../components/TransactionsTable/index.jsx';


function Dashboard() {
  const user = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [loading,setLoading] = useState(false);
  const [isExpenseModalVisible , setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible ] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () =>{
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel  = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };


    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction); // this function will add the doc
    calculateBalance();
  };



  useEffect(() => {
    // Get all the docs from a collection 
    fetchTransactions();

  },[]);

  useEffect(() => {
    calculateBalance();
  },[transactions]);


 // we will have have to make an array of transactions , we will have to fetch that array and refrest it 
  async function addTransaction(transaction){
    try{
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      
        toast.success("Transaction Added!");
        // fetchTransactions();
           // Update the state directly instead of refetching
    setTransactions((prev) => [...prev, transaction]);

      
    }catch(e){
      console.error("Error adding document: ", e);
      
        toast.error("Coudn't add transaction")    
    }
  };

  

  async function fetchTransactions(){
    setLoading(true);
    if(user){
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }


  
  function calculateBalance(){
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      console.log(typeof transaction.amount, transaction.amount);

      if(transaction.type === "income")
      {
        incomeTotal += transaction.amount;
      }else{
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);

  };

  return (
    <div>
      
      <Header/>

      {loading ? ( <p> Loading... </p>
      
    
      ):( 
       <>
      <Cards 
        income = {income}
        expense = {expense}
        totalBalance = {totalBalance}

        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        />

       <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel= {handleIncomeCancel}
        onFinish={onFinish}
        /> 

       <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel= {handleExpenseCancel}
        onFinish={onFinish}
        /> 

        <TransactionsTable transactions={transactions} />

      </>)
      }


        
    
    </div>
  )
}

export default Dashboard;
