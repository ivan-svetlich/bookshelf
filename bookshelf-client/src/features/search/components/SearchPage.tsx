import "../styles/searchStyles.css";
import { useState } from "react";
import SearchBar from "./SearchBar";
import ItemCard from "./ItemCard";
import Paginator from "./Paginator";
import useQuery from "../../../utils/hooks/useQuery";
import { SearchState, useSearch } from "../hooks/useSearch";
import SubHeader from "../../header/components/SubHeader";
import Loading from "../../loading/Loading";
import Book from "../../../types/book";

const SearchPage = () => {

  const query = useQuery();
  const [storeOnly, setStoreOnly] = useState(query.get("store-only") === "true")
  // const { _args: args, setArgs } = useFetch(storeOnly, {
  //   searchTerm: query.get("q") ? query.get("q") as string : '', 
  //   field: query.get("field") ? query.get("field") as string : 'intitle', 
  //   filter: 'partial',
  //   startIndex: parseInt(query.get("startIndex") ? query.get("startIndex") as string : '0'), 
  //   }, 500
  // );
  const {searchState, args, setArgs} = useSearch({
      searchTerm: query.get("q") ? query.get("q") as string : '', 
      field: query.get("field") ? query.get("field") as string : 'intitle', 
      filter: 'partial',
      startIndex: parseInt(query.get("start-index") ? query.get("start-index") as string : '0'), 
      },
      storeOnly,
      500)

  const {loading, data, error}: SearchState = searchState;

  return (
    <div>
      <SubHeader title="Search" icon='fas fa-search'></SubHeader>
      <div id="search-page">
          <SearchBar 
            args={args} 
            storeOnly={storeOnly} 
            setArgs={setArgs} 
            setStoreOnly={setStoreOnly}
            searchState={searchState} 
          />
          <div id="item-cards">
            {loading && <Loading />}
            {error && 'Oops! Something went wrong! Reload the page and try again.'}
            {data && data.length > 0 && data.map((item: Book) => (
              <ItemCard item={item}/>
            )) 
            }
          </div>
          {args.searchTerm && data && data.length === 0 && 'No results'}
          {data && data.length > 0 && <Paginator args={args} handleChange={setArgs} data={data} />}
      </div>
    </div>
  );
};

export default SearchPage;