import React from "react";

const Users = ({ users }) => {
  return (
    <div className="border-2 bg-orange-200 shadow-md border-slate-800 rounded p-4">
      <h2 className="text-xl font-bold">Players</h2>
      <hr className="border-2 border-slate-800 bg-slate-800 mb-3 mt-1" />
      <div
        className="max-w-sm max-h-60 overflow-y-auto overflow-hidden"
        style={{maxHeight: 300}}
      >
        {users && users.map((user, index) => (
          <div className="border-b border-slate-800 py-2" key={index}>
            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
