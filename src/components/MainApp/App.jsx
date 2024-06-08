import React from 'react';
import Wallet from '../Wallet/Wallet';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Transactions from '../Transactions/Transactions';


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Wallet />} />
                    <Route path="/transactions" element={<Transactions />} />
                </Routes>
            </BrowserRouter>

        </>
    );
}

export default App;
