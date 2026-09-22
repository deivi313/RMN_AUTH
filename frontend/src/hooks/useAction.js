import { getError } from '../api/axios';

// Runs an API call, shows any error, and reloads the list on success.
// Returns true/false so forms know whether to clear themselves.
export default function useAction(reload, setError) {
  return async (action) => {
    try {
      await action();
      setError('');
      await reload();
      return true;
    } catch (err) {
      setError(getError(err));
      return false;
    }
  };
}
