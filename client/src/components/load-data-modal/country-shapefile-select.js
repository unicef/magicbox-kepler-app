/* A stateless component for the selection of country shapefiles */

import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const propTypes = {
  adminList: PropTypes.array.isRequired,
  mobilityAdminList: PropTypes.array.isRequired,
  countryList: PropTypes.array.isRequired,
  mobilityCtryList: PropTypes.array.isRequired,
  onAdminChange: PropTypes.func.isRequired,
  onMobilityAdminChange: PropTypes.func.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  onMobilityCountryChange: PropTypes.func.isRequired,
  onShapefileSelected: PropTypes.func.isRequired,
  onMobilitySelected: PropTypes.func.isRequired,
  showAdmins: PropTypes.bool.isRequired,
  showMobilityAdmins: PropTypes.bool.isRequired,
  submitReady: PropTypes.bool.isRequired,
  submitMobilityReady: PropTypes.bool.isRequired
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

const adminSelectTemplate = (adminList, onAdminChange) => {
  return (
    <div>
      <label>Administrative level: </label>
      <select name="mobility-admin-select" onChange={onAdminChange}>
        {generateOptions(adminList, "admin")}
      </select>
    </div>
  );
}

const CountryShapefileSelect = ({ adminList, mobilityAdminList, countryList, mobilityCtryList, onAdminChange, onMobilityAdminChange, onCountryChange, onMobilityCountryChange, onShapefileSelected, onMobilitySelected, showMobilityAdmins, showAdmins, submitReady, submitMobilityReady }) => (
  <div className="country-shapefile-select">
    <form onSubmit={onShapefileSelected}>
      <h3>Add shapefiles:</h3>
      <p>Please select a country to see available administrative levels:</p>
      <label>Country: </label>
      <select name="country-select" onChange={onCountryChange}>
        {generateOptions(countryList, "country")}
      </select>
      <div>{showAdmins &&
        adminSelectTemplate(adminList, onAdminChange)
      }</div>
      <div>{submitReady && <input type="submit" value="Submit" />}</div>
    </form>
    <form onSubmit={onMobilitySelected}>
      <h3>Add mobility data:</h3>
      <p>Please select a country to access mobility:</p>
      <label>Country: </label>
      <select name="mobility-country-select" onChange={onMobilityCountryChange}>
        {generateOptions(mobilityCtryList, "country")}
      </select>
      <div>{showMobilityAdmins &&
        adminSelectTemplate(mobilityAdminList, onMobilityAdminChange)
      }</div>
      <div>{submitMobilityReady && <input type="submit" value="Submit" />}</div>
    </form>
  </div>
);

CountryShapefileSelect.propTypes = propTypes;

export default CountryShapefileSelect;
