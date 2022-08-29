import React, { useState, useEffect, useRef } from "react";
import finnhub from "finnhub";

import "./Stock.css";
import ChartBar from "./Chart.js";

// functions //

const GetApi = () => {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "cc3p4a2ad3i9vsk3v8ag";
  const finnhubClient = new finnhub.DefaultApi();

  const [stock, setStock] = useState({});
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const stockWrapper = useRef(null);

  const parsedDateBegin = Math.floor(new Date(dateBegin).getTime() / 1000);
  const parsedDateEnd = Math.floor(new Date(dateEnd).getTime() / 1000);

  // Gauna duomenis iš finnhub.com API //

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

  // Nustato date inputus iškart užkraunant puslapį //

  useEffect(() => {
    let currStart = new Date();
    currStart.setDate(currStart.getDate() - 31);
    let currStartDate = currStart.toISOString().substring(0, 10);
    setDateBegin(currStartDate);

    let curr = new Date();
    curr.setDate(curr.getDate());
    let currDate = curr.toISOString().substring(0, 10);
    setDateEnd(currDate);
  }, []);

  // Submitinus įdeda į inputą iš API gautą "ticker" value, paslepia search suggestions laukelį //

  const submitHandler = (e) => {
    e.preventDefault();
    setRefresh(search);
    document.querySelector(".stock-wrapper").style.display = "none";
    document.querySelector(".stock-input").value = stock.ticker;
  };

  return (
    <>
      <div className="top-bar">
        <div className="stock">
          <form className="search-input" onSubmit={(e) => submitHandler(e)}>
            {/* // INPUTAS // */}
            <input
              name="companyName"
              className="stock-input"
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
                document.querySelector(".stock-wrapper").style.display = "flex";
              }}
              onBlur={(e) => {
                stockWrapper.current.style.display = "none";
              }}
              maxLength="35"
            />
            {/* // INPUT END // */}
            <button className="search-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Search
            </button>
          </form>
          {/* // SEARCH SUGGESTIONS // */}
          {stock.name && (
            <div
              ref={stockWrapper}
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
        {/* // SEARCH SUGGESTIONS END // */}

        {/* // DATE INPUTS // */}
        <div className="date">
          <div>
            <label htmlFor="start">Start date:</label>
          </div>

          <div>
            <input
              type="date"
              id="start"
              onChange={(e) => {
                setDateBegin(e.target.value);
              }}
              defaultValue={dateBegin}
            />
          </div>
          <div>
            <label htmlFor="end">End date:</label>
          </div>
          <div>
            <input
              type="date"
              id="end"
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              defaultValue={dateEnd}
            />
          </div>
        </div>
        {/* // DATE INPUTS END // */}
      </div>
      {/* // COMPANY INFO DIV, kuris turėtų atsirasti tik pasubmitinus searchą // */}
      {stock.name && (
        <div className="company-info">
          <div className="company-info-wrapper">
            <div className="company-logo">
              <div>
                <img className="stock-img medium" src={stock.logo} alt="" />
              </div>
            </div>
            <div className="company-info-header">
              <div>
                <h1>
                  {stock.name}, {stock.country} ({stock.currency})
                </h1>
              </div>
              <div>
                <p>{stock.finnhubIndustry}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <main>
        {/* // CHART // */}
        <div className="stock-table">
          <ChartBar
            company={search}
            dateBegin={dateBegin}
            dateEnd={dateEnd}
            parsedDateBegin={parsedDateBegin}
            parsedDateEnd={parsedDateEnd}
          />
        </div>
      </main>
    </>
  );
};

export default GetApi;
