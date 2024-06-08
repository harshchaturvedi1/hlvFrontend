const API_URL = process.env.REACT_APP_API_URL;

export const setupWallet = async (name, balance) => {
    const response = await fetch(`${API_URL}/wallet/setup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, balance })
    });
    return response.json();
};

export const getWallet = async (id) => {
    const response = await fetch(`${API_URL}/wallet/${id}`);
    return response.json();
};

export const transact = async (walletId, amount, description) => {
    const response = await fetch(`${API_URL}/transactions/transact/${walletId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, description })
    });
    return response.json();
};

export const getTransactions = async (walletId, skip = 0, limit = 10, sortBy, sortOrder) => {
    let url = `${API_URL}/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`;
    if (sortBy && sortOrder) {
        url += `&sort=${sortBy}&order=${sortOrder}`;
    }
    const response = await fetch(url);
    return response.json();
};

