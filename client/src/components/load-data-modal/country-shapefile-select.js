/* A stateless component for the selection of country shapefiles */

import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const propTypes = {
  adminList: PropTypes.array.isRequired,
  countryList: PropTypes.array.isRequired,
  onAdminChange: PropTypes.func.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  onShapefileSelected: PropTypes.func.isRequired,
  showAdmins: PropTypes.bool.isRequired,
  submitReady: PropTypes.bool.isRequired,
};

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
    <form onSubmit={onShapefileSelected}>
      <h3>Add borderfile:</h3>
      <p>Please select a country to see available administrative levels:</p>
      <label>Country: </label>
      <select name="country-select" onChange={onCountryChange}>
        {generateOptions(countryList, "country")}
      </select>
      <div>{showAdmins &&
        <div>
          <label>Administrative level: </label>
          <select name="admin-select" onChange={onAdminChange}>
            {generateOptions(adminList, "admin")}
          </select>
          <div>
            <input type="checkbox" name="get-health-sites" value="true" />Get health sites
          </div>
          <div>
            <input type="checkbox" name="get-schools" value="true" />Get schools
          </div>
        </div>
      }</div>
      <div>{submitReady && <input type="submit" value="Submit" />}</div>
    </form>
  </div>
);

CountryShapefileSelect.propTypes = propTypes;

export default CountryShapefileSelect;
