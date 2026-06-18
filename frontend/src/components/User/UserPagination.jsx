import React from 'react';

const UserPagination = ({ currentPage, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Showing Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{lastPage}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              &larr;
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                  p === currentPage
                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-offset-0'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === lastPage}
              onClick={() => onPageChange(currentPage + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              &rarr;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserPagination;
