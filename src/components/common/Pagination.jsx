import './Pagination.css';
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const showNavigation = totalPages > 5;

  let startPage = 1;
  let endPage = totalPages;

  if (showNavigation) {
    startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    endPage = startPage + 2;
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const handlePageChange = (page) => {
    if (page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {showNavigation && (
        <>
          <button
            type="button"
            className="icon first"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            aria-label="첫 페이지"
          >
            <CaretDoubleLeftIcon />
          </button>

          <button
            type="button"
            className="icon previous"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            <CaretLeftIcon />
          </button>
        </>
      )}

      <div className="page-list">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`page ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {showNavigation && (
        <>
          <button
            type="button"
            className="icon next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            <CaretRightIcon />
          </button>

          <button
            type="button"
            className="icon last"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지"
          >
            <CaretDoubleRightIcon />
          </button>
        </>
      )}
    </nav>
  );
}

export default Pagination;
