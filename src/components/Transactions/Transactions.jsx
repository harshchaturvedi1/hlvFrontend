import React, { useEffect, useState } from "react";
import "./Transactions.css";
import { getTransactions } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

const Transactions = () => {
  const [walletId, setWalletId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // Default sorting by date
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order
  const navigate = useNavigate();

  useEffect(() => {
    const walletIdTemp = localStorage.getItem("walletId");
    if (walletIdTemp) {
      setWalletId(walletIdTemp);
    }
  }, []);

  useEffect(() => {
    if (walletId) {
      fetchTransactions();
    }
  }, [walletId, page, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    const limit = 10; // Assuming 10 transactions per page
    const skip = (page - 1) * limit;
    const response = await getTransactions(
      walletId,
      skip,
      limit,
      sortBy,
      sortOrder
    );
    const totalCount = response.totalCount || 0; // Assuming the total count is provided in the response
    setTransactions(response.transactions);
    setTotalPages(Math.ceil(totalCount / limit));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (event) => {
    const { name, value } = event.target;
    if (name === "sortBy") {
      setSortBy(value);
      setSortOrder("asc"); // Reset sort order when changing sort criteria
    } else if (name === "sortOrder") {
      setSortOrder(value);
    }
  };

  // Prepare CSV data
  const headers = [
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
    { label: "Balance", key: "balance" },
    { label: "Description", key: "description" },
    { label: "Type", key: "type" },
  ];

  const csvData = transactions.map((transaction) => ({
    date: new Date(transaction.date).toLocaleString(),
    amount: transaction.amount.toFixed(4),
    balance: transaction.balance.toFixed(4),
    description: transaction.description,
    type: transaction.type,
  }));

  return (
    <div className="transactions">
      <h2>Transactions</h2>
      <div className="controls">
        <select name="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
        <select name="sortOrder" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span className="pagecount">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
      <div className="totransactions">
        <button onClick={() => navigate("/")}>Go To Wallet</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Description</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td>{transaction.amount.toFixed(4)}</td>
              <td>{transaction.balance.toFixed(4)}</td>
              <td>{transaction.description}</td>
              <td>{transaction.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <CSVLink
          data={csvData}
          headers={headers}
          filename="transactions.csv"
          className="btn btn-primary"
        >
          Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default Transactions;
