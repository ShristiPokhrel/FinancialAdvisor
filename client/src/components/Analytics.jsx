import React from 'react';

const Analytics = ({ allTransaction }) => {
  // Ensure allTransaction is a Map
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

  return (
    <>
      <div className="row m-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total Transactions: {totalTransaction}</div>
            <div className="card-body">
              <h5>Income: {totalIncomeTransactions.length}</h5>
              <h5>Expense: {totalExpenseTransactions.length}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Transaction Distribution</div>
            <div className="card-body">
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${totalIncomePercent}%` }}
                  aria-valuenow={totalIncomePercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {totalIncomePercent.toFixed(2)}%
                </div>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${totalExpensePercent}%` }}
                  aria-valuenow={totalExpensePercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {totalExpensePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
