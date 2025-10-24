import React from "react";
import { useAppSelector, useAppDispatch } from "Redux/hooks";
import { setCurrentPage } from "Redux/slices/itemsListSlice";
import s from "./Pagination.module.css";

interface ItemsState {
  currentPage: number;
  items: unknown[];
  itemsPerPage: number;
}

interface RootState {
  items: ItemsState;
}

const paginationData = (state: RootState): ItemsState => state.items;

const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, items, itemsPerPage } = useAppSelector(paginationData);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className={s.pagination}>
      <button
        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span>
        {" "}
        Page {currentPage} of {totalPages}{" "}
      </span>
      <button
        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
