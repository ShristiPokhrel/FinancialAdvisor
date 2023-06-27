import React from 'react';
import { Progress} from 'antd';

const Analytics = ({ allTransaction }) => {
  // Ensure total allTransaction is a Map
  if (!(allTransaction instanceof Map)) {
    return <div>Error: Invalid transaction data</div>;
  }

  const totalTransaction = allTransaction.size;
  const totalIncomeTransactions = Array.from(allTransaction.values()).filter(
    (transaction) => transaction.type === 'income'
  );
  const totalExpenseTransactions = Array.from(allTransaction.values()).filter(
    (transaction) => transaction.type === 'expense'
  );
  const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

 // Convert Map to array for calculations
 const transactionArray = Array.from(allTransaction.values());

 // Total turnover
 const totalTurnover = transactionArray.reduce((acc, transaction) => acc + transaction.amount, 0);
 const totalIncomeTurnover = transactionArray
   .filter((transaction) => transaction.type === 'income')
   .reduce((acc, transaction) => acc + transaction.amount, 0);
 const totalExpenseTurnover = transactionArray
   .filter((transaction) => transaction.type === 'expense')
   .reduce((acc, transaction) => acc + transaction.amount, 0);
 const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
 const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <>
      <div className="row m-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total Transactions: {totalTransaction}</div>
            <div className="card-body">
              <h5 className="text-success">Income: {totalIncomeTransactions.length}</h5>
              <h5 className="text-danger">Expense: {totalExpenseTransactions.length}</h5>
            </div>
          
        
        <div>
          <Progress type="circle"
          strokeColor={'green'}
          className="mx-2"
          percent={totalIncomePercent.toFixed(0)} />
          <Progress type="circle"
          strokeColor={'red'}
          className="mx-2"
          percent={totalExpensePercent.toFixed(0)} />
        </div>
        </div>
        
       
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total Trunover: {totalTransaction}</div>
            <div className="card-body">
              <h5 className="text-success">Income: {totalIncomeTurnover}</h5>
              <h5 className="text-danger">Expense: {totalExpenseTurnover}</h5>
            </div>
          
        
        <div>
          <Progress type="circle"
          strokeColor={'green'}
          className="mx-2"
          percent={totalIncomeTurnoverPercent.toFixed(0)} />
          <Progress type="circle"
          strokeColor={'red'}
          className="mx-2"
          percent={totalExpenseTurnoverPercent.toFixed(0)} />
        </div>
        </div>
        
       
        </div>



        
      </div>
      
      
    </>
  );
};

export default Analytics;
