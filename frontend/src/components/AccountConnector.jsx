const AccountConnector = ({ number, platform, account, onConnect, onDisconnect }) => {
  return (
    <div className={`
      p-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      ${account ? 'bg-green-900/50 border border-green-500' : 'bg-gray-700'}
    `}>
      <div className="text-xl font-semibold text-gray-300 mb-2">
        {number}
      </div>
      
      {account ? (
        <div className="space-y-2">
          <span className="text-sm text-green-400 block truncate">
            {account.username}
          </span>
          <button 
            className="w-full px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            onClick={onDisconnect}
            title="Disconnect account"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          className="w-full px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
          onClick={onConnect}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default AccountConnector; 