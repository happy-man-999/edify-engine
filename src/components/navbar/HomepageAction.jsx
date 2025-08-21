import React from 'react';
import UserMenu from './UserMenu';

export default function HomepageAction() {
  return (
    <div className="flex items-center space-x-4">
      {/*<button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="bg-[#42677D] hover:bg-[#355263] text-white px-4 py-2 rounded-md transition shadow-sm">
        <i className="fas fa-plus mr-2"></i> New World
      </button>*/}
      <UserMenu />
    </div>
  );
}