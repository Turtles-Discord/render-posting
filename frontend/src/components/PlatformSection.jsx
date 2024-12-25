import { motion } from 'framer-motion';

const PlatformSection = ({ platform, accounts, onAccountsUpdate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-green-400 mb-4 capitalize">
        {platform} Accounts
      </h2>
      
      {accounts.length === 0 ? (
        <p className="text-gray-400">No {platform} accounts connected</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{account.username}</p>
                <p className="text-gray-400 text-sm">Followers: {account.followers}</p>
              </div>
              <button
                onClick={() => onAccountsUpdate(account.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={() => {/* Add connect account logic */}}
      >
        Connect New Account
      </button>
    </motion.div>
  );
};

export default PlatformSection; 