import React, { useState, useEffect } from "react";
import finnhub from "finnhub";

import useOnclickOutside from "react-cool-onclickoutside";

const SearchInput = () => {
  const [stock, setStock] = useState({});
  const [search, setSearch] = useState("");

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "cc3p4a2ad3i9vsk3v8ag";
  const finnhubClient = new finnhub.DefaultApi();

  useEffect(() => {
    finnhubClient.companyProfile2(
      { symbol: search },
      (error, data, response) => {
        try {
          setStock(data);
          console.log(data);
        } catch (error) {
          return console.log(error);
        }
      }
    );
  }, [search]);

  const ref = useOnclickOutside(() => {
    document.querySelector(".stock-wrapper").style.display = "none";
  });

  return (
    <div className="stock">
      <form className="search-input" onSubmit={(e) => e.preventDefault()}>
        <input
          name="companyName"
          ref={ref}
          className="stock-input"
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
            document.querySelector(".stock-wrapper").style.display = "flex";
          }}
          maxLength="35"
        />

        <button className="search-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
      </form>
      {stock.name && (
        <div
          ref={ref}
          id="stock"
          className="stock-wrapper"
          onClick={() => {
            document.querySelector(".stock-input").value = stock.ticker;
            document.querySelector(".stock-wrapper").style.display = "none";
          }}
        >
          <div>
            <img className="stock-img" src={stock.logo} alt={stock.name} />
          </div>
          <div>
            {stock.name}, {stock.country} ({stock.currency})
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
