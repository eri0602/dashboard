// src/modules/dashboard/RecentTransactions.jsx
import "../../styles/tables.css";

export default function RecentTransactions() {
    const transactions = [
        {
            id: "#TRX-00921",
            user: "Alex Smith",
            date: "Oct 24, 2023",
            amount: "$420.00",
            status: "Completed",
        },
        {
            id: "#TRX-00922",
            user: "Jane Doe",
            date: "Oct 24, 2023",
            amount: "$125.50",
            status: "Pending",
        },
        {
            id: "#TRX-00923",
            user: "Michael Lee",
            date: "Oct 23, 2023",
            amount: "$980.00",
            status: "Completed",
        },
    ];

    return (
        <>
            <p className="table-subtitle">Latest activity</p>
            
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.user}</td>
                            <td>{t.date}</td>
                            <td>{t.amount}</td>
                            <td>
                                <span className={`badge ${t.status.toLowerCase()}`}>
                                    {t.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
