// src/components/Button.jsx
const Button = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
