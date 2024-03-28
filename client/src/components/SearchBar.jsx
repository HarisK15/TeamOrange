import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import CluckBox from './CluckBox';
import './SearchBar.css';
import UsersList from './UsersList';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], clucks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search function to reduce number of server requests
  const debouncedSearchRef = useRef(_.debounce(search, 500));

  useEffect(() => {
    debouncedSearchRef.current = _.debounce(search, 500);
  }, [search]);

  useEffect(() => {
    if (query) {
      debouncedSearchRef.current(query);
    } else {
      setResults({ users: [], clucks: [] });
    }
    // Cancel the debounce on useEffect cleanup.
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [query]);

  return (
    <div className='search-bar' data-testid='search-bar'>
      <input
        className='search-field'
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search ...'
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {results.users.length > 0 && (
            <>
              <h3 className="users-title">Users</h3>
              {results.users.map((user) => (
                <div key={user._id} className='user'>
                  <Link to={`/Profile/${user._id}`}>
                    <h4>{user.userName}</h4>
                  </Link>
                </div>
              ))}
            </>
          )}
          {results.clucks.length > 0 && (
            <>
              <h3 className="clucks-title">Clucks</h3>
              {results.clucks.map((cluck) => (
                <CluckBox key={cluck._id} cluck={cluck} profileView={true}/>
              ))}
            </>
          )}
          <div className="follow-users">
          <UsersList />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
