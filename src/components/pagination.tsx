'use client'

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setPage: (number:number)=>void ;
};

const Pagination = ({ currentPage, totalPages, setPage }: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Always show page 1
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-[#FF6500] text-white"
            : "text-[#6B7280] hover:bg-gray-100"
        }`}
      >
        1
      </button>
    );

    // Show dots if not at start
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="start-dots" className="px-4 text-[#6B7280]">
          ...
        </span>
      );
    }

    // Show numbers around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= totalPages - 1) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 rounded-md ${
              currentPage === i
                ? "bg-[#FF6500] text-white"
                : "text-[#6B7280] hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Show dots if not at end
    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="end-dots" className="px-4 text-[#6B7280]">
          ...
        </span>
      );
    }

    // Show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-[#FF6500] text-white"
              : "text-[#6B7280] hover:bg-gray-100"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex overflow-hidden items-center w-full justify-center gap-4 mt-14">
      <Button
      
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-50 flex justify-center items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="md:block hidden"> Previous</p>
      </Button>

      <div className="flex items-center gap-1 md:mx-14">
        {renderPageNumbers()}
      </div>

      <Button
       
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50 flex justify-center items-center gap-1"
      >
        <p className="md:block hidden"> Next</p>

        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;






