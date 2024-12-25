import AccountConnector from './AccountConnector';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PlatformSection = ({ platform, accounts, onAccountsUpdate }) => {
  const handleConnect = async (accountNumber) => {
    const width = 600;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const authUrl = `/api/auth/${platform}?accountNumber=${accountNumber}`;
    
    const popup = window.open(
      authUrl,
      `${platform}_auth_${accountNumber}`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event) => {
      if (event.data.type === 'AUTH_SUCCESS' && 
          event.data.platform === platform && 
          event.data.accountNumber === accountNumber) {
        popup.close();
        toast.success(`Successfully connected ${platform} account ${event.data.username}`);
        onAccountsUpdate();
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  const handleDisconnect = async (accountNumber) => {
    try {
      await axios.delete(`/api/auth/${platform}/${accountNumber}`);
      toast.success(`Disconnected ${platform} account successfully`);
      onAccountsUpdate();
    } catch (error) {
      toast.error(`Failed to disconnect account: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-400 capitalize">
          {platform}
        </h2>
        <span className="text-gray-400">
          {accounts.length} connected
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {Array.from({ length: 50 }, (_, i) => i + 1).map((number) => {
          const account = accounts.find(a => a.accountNumber === number);
          
          return (
            <AccountConnector
              key={number}
              number={number}
              platform={platform}
              account={account}
              onConnect={() => handleConnect(number)}
              onDisconnect={() => handleDisconnect(number)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSection; 