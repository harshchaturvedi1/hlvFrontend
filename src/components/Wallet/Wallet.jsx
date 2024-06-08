import React, { useEffect, useState } from "react";
import "./Wallet.css";
import { getWallet, setupWallet, transact } from "../../Services/api";
import { Link, useNavigate } from "react-router-dom";

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");

  const handleSetup = async (name, balance) => {
    try {
      const wallet = await setupWallet(name, balance);
      localStorage.setItem("walletId", wallet.id);
      setWallet(wallet);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransact = async (amount, description) => {
    try {
      const result = await transact(wallet.id, amount, description);
      if (result.error) {
        setError(result.error);
      } else {
        setWallet({ ...wallet, balance: result.balance });
        setError("");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const walletId = localStorage.getItem("walletId");
    setLoading(true);
    if (walletId) {
      // Fetch wallet details if walletId is present in local storage
      // This will happen when the user has already set up a wallet
      fetchWallet(walletId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWallet = async (walletId) => {
    try {
      const wallet = await getWallet(walletId);
      setWallet(wallet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div>Loading...</div>
      ) : wallet ? (
        <WalletDetails
          wallet={wallet}
          onTransact={handleTransact}
          error={error}
          setWallet={setWallet}
        />
      ) : (
        <SetupForm onSetup={handleSetup} />
      )}
    </div>
  );
};

const SetupForm = ({ onSetup }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !balance.trim()) {
      setError("Name and Initial Balance are required");
      return;
    }

    try {
      await onSetup(name, parseFloat(balance));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Setup Wallet</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          required
        />
        <button type="submit">Setup</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

const WalletDetails = ({ wallet, onTransact, error, setWallet }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isCredit, setIsCredit] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionAmount = isCredit
      ? parseFloat(amount)
      : -parseFloat(amount);
    onTransact(transactionAmount, description);
  };

  const handleNewWallet = () => {
    localStorage.removeItem("walletId");
    setWallet(null);
  };

  return (
    <div className="form-container">
      <h2>Wallet: {wallet.name}</h2>
      <h3>
        Balance:{" "}
        {wallet.balance !== undefined ? wallet.balance.toFixed(4) : "N/A"}
      </h3>
      <div className="totransactions">
        <button onClick={() => navigate("/transactions")}>
          View Wallet transactions
        </button>
        <button onClick={() => handleNewWallet()}>New Wallet</button>
      </div>
      <h3>Initiate a Transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="number"
          step="0.0001"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="transaction-type">
          <label>
            <input
              type="radio"
              name="transactionType"
              checked={isCredit}
              onChange={() => setIsCredit(true)}
            />
            Credit
          </label>
          <label>
            <input
              type="radio"
              name="transactionType"
              checked={!isCredit}
              onChange={() => setIsCredit(false)}
            />
            Debit
          </label>
        </div>
        <button type="submit">Submit</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Wallet;
