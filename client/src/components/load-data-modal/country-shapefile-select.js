/* A stateless component for the selection of country shapefiles */

import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import styled from 'styled-components';

const propTypes = {
  adminList: PropTypes.array.isRequired,
  countryList: PropTypes.array.isRequired,
  onAdminChange: PropTypes.func.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  onShapefileSelected: PropTypes.func.isRequired,
  showAdmins: PropTypes.bool.isRequired,
  submitReady: PropTypes.bool.isRequired,
};

const VisualizationForm = styled.form`
  p {
    font-size: 13px;
    margin-bottom: 2px;
    color: #29323C;
  }

  select {
    width: 40%;
    padding: 2px;
    border-radius: 3px;
    background-color: white;
  }

  select:nth-child(2) {
    margin-bottom: 15px;
  }

  input[type="checkbox"] {
    vertical-align: middle;
  }

  input[type="submit"] {
    margin-top: 10px;
    padding: 6px;
    background-color: #0068EA;
    border-radius: 5px;
    color: white;
    border-radius: 3px;
    border-color: #0068EA;
  }

  input[type="submit"]:disabled {
    background-color: #e7e7e7;
    border-color: #e7e7e7;
    color: #6c757d;
  }
`;

const generateOptions = (items, type) => {
  let [valueName, textName] =
    type === "country" ? ["countryCode", "countryName"]
      : type === "admin" ? ["adminLevel", "adminLevel"]
        : ["", ""];
  let options = items.map(entry => <option key={entry.id} value={entry[valueName]}>{entry[textName]}</option>);
  options.unshift(<option key={shortid.generate()} value="" hidden> -- select an option -- </option>);
  return options;
};

const CountryShapefileSelect = ({ adminList, countryList, onAdminChange, onCountryChange, onShapefileSelected, showAdmins, submitReady }) => (
  <div className="country-shapefile-select">
    <VisualizationForm onSubmit={onShapefileSelected}>
      <p>In order to create a visualization, please provide the following inputs:</p>
      <p>PLEASE SELECT A COUNTRY:</p>
      {/* <label>Country: </label> */}
      <select name="country-select" onChange={onCountryChange}>
        {generateOptions(countryList, "country")}
      </select>
      <div>
        <div>
          <p>ADMINISTRATIVE LEVEL: </p>
          <select disabled={showAdmins?"":"disabled"} name="admin-select" onChange={onAdminChange}>
            {generateOptions(adminList, "admin")}
          </select>
          <div>
            <input type="checkbox" name="get-health-sites" value="true" disabled={showAdmins?"":"disabled"} />VIEW HEALTH SITES
          </div>
          <div>
            <input type="checkbox" name="get-schools" value="true" disabled={showAdmins?"":"disabled"} />VIEW SCHOOLS
          </div>
        </div>
      </div>
      <div><input type="submit" value="GENERATE" style={{cursor:'pointer'}} disabled={submitReady?"":"disabled"} /></div>
    </VisualizationForm>
  </div>
);

CountryShapefileSelect.propTypes = propTypes;

export default CountryShapefileSelect;
