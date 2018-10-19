import PropTypes from 'prop-types';
import React, {Component} from 'react';
import shortid from 'shortid';

export default class CountrySelectModal extends Component {
  static propTypes = {
    countryCode: PropTypes.string.isRequired,
    currentAdminLevel: PropTypes.number.isRequired,
    availableAdminOptions: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    countryCode: 'AFG',
    currentAdminLevel: 0,
    availableAdminOptions: generateAdminOptions(2)
  };

  constructor(props) {
    super(props);
    this.state = {
      countryCode: this.props.options[0].countryCode,
      currentAdminLevel: 0,
      availableAdminOptions: generateAdminOptions(this.props.options[0].adminLevel)
    };
  }

  handleCountryInput = (e) => {
    let newCountryCode = e.target.value;
    let newAdminLevel = this.props.options.find(entry => entry.countryCode === newCountryCode).adminLevel;
    console.log(newCountryCode, newAdminLevel);
    this.setState({
      countryCode: newCountryCode,
      currentAdminLevel: 0,
      availableAdminOptions: generateAdminOptions(newAdminLevel)
    });
  }

  handleLevelInput = (e) => {
    this.setState({ currentAdminLevel: e.target.value });
  }

  handleSubmit = (e) => {
    this.props.onSubmit(this.state);
    e.preventDefault();
  }

  render() {
    let countryOptions = this.props.options.map(opt =>
      <option key={opt.id} value={opt.countryCode}>{opt.countryCode}</option>
    );
    return (
      <div>
        <form>
          <label>Select a country:</label>
          <select
            value={this.state.countryCode}
            onChange={this.handleCountryInput}>
            {countryOptions}
          </select>
          <br />
          <label>Select the admin level:</label>
            <p>Level 0 = country-level; level 1 = province-level or equivalent; level 2 = district-level or equivalent; and so on</p>
          <select
            value={this.state.currentAdminLevel}
            onChange={this.handleLevelInput}>
            {this.state.availableAdminOptions}
          </select>
          <br />
          <button name="Submit" onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    );
  }

}

function generateAdminOptions(deepestLevel) {
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
