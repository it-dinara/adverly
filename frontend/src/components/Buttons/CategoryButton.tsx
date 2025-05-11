import React from "react";
import s from "./CategoryButton.module.css";

interface ButtonProps {
  label: string;
  onClick?: () => void; // Optional callback for button click
}

const CategoryButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button type="button" className={s.category} onClick={onClick}>
      <div className={s.label}>{label}</div>
      <span className={s.icon}>
        <svg
          width="7"
          height="13"
          viewBox="0 0 7 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.54136 6.0045L0 1.00901L1.10991 0L6.56855 6.0045L1.10991 12.009L0 11L4.54136 6.0045Z"
            fill="#000000"
          ></path>
        </svg>
      </span>
    </button>
  );
};

export default CategoryButton;
