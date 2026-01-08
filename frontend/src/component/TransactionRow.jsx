import PropTypes from "prop-types";

export default function TransactionRow({ transaction, onDelete }) {
  return (
    <li style={{ marginBottom: "10px", padding: "5px", borderBottom: "1px solid #eee" }}>
      <strong>{transaction.titre}</strong> : {transaction.montant} € ({transaction.type})
      
      <button 
        onClick={() => onDelete(transaction._id)} 
        style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
      >
        Supprimer
      </button>
    </li>
  );
}

//Verification des types des éléments transaction
TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    titre: PropTypes.string.isRequired,
    montant: PropTypes.number.isRequired,
    type: PropTypes.string,
  }).isRequired,
  
  onDelete: PropTypes.func.isRequired,
};