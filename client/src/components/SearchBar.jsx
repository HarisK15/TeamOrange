import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import _ from "lodash";
import CluckBox from "./CluckBox";

const SearchBar = () => {
  const [query, setQuery] = useState("");
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
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {results.users.length > 0 && (
            <>
              <h3>Users</h3>
              {results.users.map((user) => (
                <div key={user._id}>
                  <h2>{user.userName}</h2>
                </div>
              ))}
            </>
          )}
          {results.clucks.length > 0 && (
            <>
              <h3>Clucks</h3>
              {results.clucks.map((cluck) => (
                <CluckBox key={cluck._id} cluck={cluck} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
