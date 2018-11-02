import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const propTypes = {
  countryList: PropTypes.array.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  showAdmins: PropTypes.bool.isRequired,
  currentMaxAdmin: PropTypes.number.isRequired,
  onAdminChange: PropTypes.func.isRequired,
  submitReady: PropTypes.bool.isRequired,
  onShapefileSelected: PropTypes.func.isRequired
};

const generateCountryOptions = (countryList) => {
  let countryOptions = countryList.map(entry => (
    <option key={entry.id} value={entry.countryCode}>
      {entry.countryName}
    </option>
  ))
  countryOptions.unshift(
    <option key={shortid.generate()} value> -- select an option -- </option>
  )
  return countryOptions;
};

const generateAdminOptions = (deepestLevel) => {
  // parse int to ensure the value passed in Array() is a number; else, the function won't work properly.
  // if deepestLevel is, say, 3, the function will give us array [0, 1, 2, 3]
  let adminLevels = [...Array(parseInt(deepestLevel, 10) + 1).keys()]
    .map(value => {
      return {  adminLevel: value, id: shortid.generate() };
    });
  let adminOptions = adminLevels.map(opt =>
    <option key={opt.id} value={opt.adminLevel}>{opt.adminLevel}</option>
  );
  adminOptions.unshift(
    <option key={shortid.generate()} value> -- select an option -- </option>
  )
  return adminOptions;
};

const CountryShapefileSelect = ({ countryList, onCountryChange, showAdmins, currentMaxAdmin, onAdminChange, submitReady, onShapefileSelected }) => (
  <div className="country-shapefile-select">
    <form onSubmit={onShapefileSelected}>
      <h3>Add shapefiles:</h3>
      <p>Please select a country to see available administrative levels:</p>
      <label>Country: </label>
      <select name="country-select" onChange={onCountryChange}>
        {generateCountryOptions(countryList)}
      </select>
      <div>{showAdmins &&
        <div>
          <label>Administrative levels: </label>
          <select name="admin-select" onChange={onAdminChange}>
            {generateAdminOptions(currentMaxAdmin)}
          </select>
        </div>
      }</div>
      <div>{submitReady && <input type="submit" value="Submit" />}</div>
    </form>
  </div>
);

CountryShapefileSelect.propTypes = propTypes;

export default CountryShapefileSelect;
