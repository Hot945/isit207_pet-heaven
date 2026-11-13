import chevronDownIcon from '../assets/chevron-down.svg';

export default function CustomSelect({ children, ...selectProps }) {
  return (
    <div className="select-wrapper">
      <select {...selectProps}>
        {children}
      </select>
      <img
        src={chevronDownIcon}
        alt=""
        className="select-custom-arrow"
        aria-hidden="true"
      />
    </div>
  );
}
