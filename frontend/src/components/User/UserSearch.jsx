import React, { useState } from 'react';

const UserSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email..."
        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded text-sm font-medium transition"
      >
        Search
      </button>
    </form>
  );
};

export default UserSearch;
