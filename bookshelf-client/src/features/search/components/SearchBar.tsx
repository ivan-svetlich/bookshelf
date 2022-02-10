import { useEffect } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { QueryArgs } from "../api/googleBooks";
import { SearchState } from "../hooks/useSearch";

interface SearchBarProps {
  args: QueryArgs;
  storeOnly: boolean;
  setArgs: React.Dispatch<React.SetStateAction<QueryArgs>>;
  setStoreOnly: React.Dispatch<React.SetStateAction<boolean>>;
  searchState: SearchState;
}

const SearchBar = ({
  args,
  storeOnly,
  setArgs,
  setStoreOnly,
  searchState,
}: SearchBarProps) => {
  const [progress, setProgress] = useState(0);
  const [variant, setVariant] = useState("primary");
  const [currentData, setCurrentData] = useState(searchState.data);

  useEffect(() => {
    if (searchState.loading) {
      setVariant("primary");
      const timeoutId = setTimeout(async () => {
        if (progress < 99) {
          setProgress((prev) => prev + 1);
        }
      }, 1);
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (searchState.data && progress > 0) {
      if (
        searchState.data.length > 0 &&
        searchState.data !== currentData &&
        args.searchTerm !== ""
      ) {
        setVariant("primary");
        setProgress(100);
        setCurrentData(searchState.data);
      } else if (searchState.data.length === 0) {
        setVariant("danger");
        setProgress(100);
      }
    } else if (searchState.error) {
      setVariant("danger");
      setProgress(100);
    }
  }, [
    args.searchTerm,
    currentData,
    progress,
    searchState.data,
    searchState.error,
    searchState.loading,
  ]);

  const handleChange = (queryArgs: QueryArgs) => {
    setProgress(0);
    setVariant("primary");
    setArgs(queryArgs);
  };

  const handleCheckbox = () => {
    setProgress(0);
    setVariant("primary");
    setStoreOnly((prev) => !prev);
    setArgs({ ...args, startIndex: 0 });
  };

  return (
    <div id="search-bar">
      <span id="search-span">Search for a book: </span>
      <div id="input-container">
        <input
          id="search-input"
          type="text"
          placeholder="Search"
          value={args.searchTerm}
          onChange={(e) =>
            handleChange({ ...args, searchTerm: e.target.value, startIndex: 0 })
          }
        />
        <ProgressBar
          id="progress-bar"
          variant={variant}
          animated={progress < 100}
          striped={progress === 100}
          now={progress}
        />
      </div>
      <div id="search-dropdown">
        <Form.Select
          defaultValue={args.field}
          onChange={(e) =>
            handleChange({ ...args, field: e.target.value, startIndex: 0 })
          }
        >
          <option value="intitle">Title</option>
          <option value="inauthor">Author</option>
          <option value="inpublisher">Publisher</option>
        </Form.Select>
      </div>
      <div id="search-products">
        <span>Only books available in BOOKSHELF STORE: </span>
        <input
          type="checkbox"
          onChange={(e) => handleCheckbox()}
          checked={storeOnly}
        />
      </div>
    </div>
  );
};

export default SearchBar;
