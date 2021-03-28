import { FormControl, MenuItem, Select, CardContent} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData, prettyPrintStat} from './utils';
import numeral from 'numeral';
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {
  const [countries,setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  },[]);

  // https://disease.sh/v3/covid-19/countries


  // For using this api we gonna use useEFFECT
  // USE EFFECT = Runs a piece of code 
  //  based on a given condition
  // This code inside here will run once 
  //  when the component loads and not again
  // async -> send a request, wait for it, do something
  
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, 
            value: country.countryInfo.iso2 //UK, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
    };
    getCountriesData();
  }, []);
  
  // https://disease.sh/v3/covid-19/all
  // https://disease.sh/v3/covid-19/countries/
  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide' ? 
      'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data); // All of the data from the country response
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };
  
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select 
              variant="outlined" 
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all the countries and show a dropdown 
              list of the options */}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
            <InfoBox 
              isRed
              active={casesType === "cases"}
              onClick={e => setCasesType("cases")}
              title = "Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)}
            />
            
            <InfoBox 
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title = "Recovered Cases" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)}
            />

            <InfoBox
              isRed 
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title = "Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}
            />
        </div>

        
        <Map 
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        {/*Map*/}
      </div>
      <div className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
              <Table countries={tableData}/>
          <h3>WorldWide new Cases </h3>  
            <LineGraph />
        </CardContent>

      </div>
      
    </div>
  );
}

export default App;
