import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  countryList: PropTypes.array.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  showAdmins: PropTypes.bool.isRequired,
  currentMaxAdmin: PropTypes.number.isRequired,
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
  return adminOptions;
}

const CountryShapefileSelect = ({ countryList, onCountryChange, showAdmins, currentMaxAdmin }) => (
  <div className="country-shapefile-select">
    <form>
      <h3>Add shapefiles:</h3>
      <p>Please select a country:</p>
      <select className="country-select">
        {countryList.map(entry => (
          <option
            key={entry.id}
            value={entry.countryCode}
            onChange={() => onCountryChange(entry)}
          >{entry.countryName}</option>
        ))}
      </select>
      <br />
      <div>{showAdmins &&
        <select className="admin-select">
          {generateAdminOptions(currentMaxAdmin)}
        </select>
      }</div>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </div>
)

CountryShapefileSelect.propTypes = propTypes;

export default CountryShapefileSelect;
