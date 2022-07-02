import "./Input.css";
const Input = ({ type, onChange, children, value }) => {
  return (
    <div className="input-container">
      <label>{children}</label>
      <input value={value} onChange={onChange} type={type} />
    </div>
  );
};

export default Input;
