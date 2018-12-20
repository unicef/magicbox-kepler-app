// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { FileUpload } from 'kepler.gl/components';
import { LoadingSpinner } from 'kepler.gl/components';
import { themeLT } from 'kepler.gl/styles';
import { Icons } from 'kepler.gl/components';
import shortid from 'shortid';
import { addDataToMap } from 'kepler.gl/actions';
import * as topojson from 'topojson-client';
import { LOADING_METHODS, QUERY_TYPES, ASSETS_URL } from '../../constants/default-settings';
import Processors from 'kepler.gl/processors';
import config from '../../../config';
import CountryShapefileSelect from './country-shapefile-select';
import SampleMapGallery from './sample-map-gallery';
import { shapefileHashEnglish } from './english-shapefile-hash';
import helper_alphabetize from '../../helpers/helper-alphabetize'

const propTypes = {
  // query options
  loadingMethod: PropTypes.object.isRequired,
  currentOption: PropTypes.object.isRequired,
  sampleMaps: PropTypes.array.isRequired,

  // call backs
  onFileUpload: PropTypes.func.isRequired,
  onLoadSampleData: PropTypes.func.isRequired,
  onSetLoadingMethod: PropTypes.func.isRequired
};

const BackLink = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;
  color: ${props => props.theme.titleColorLT};
  cursor: pointer;
  margin-bottom: 40px;

  :hover {
    font-weight: 500;
  }

  span {
    white-space: nowrap;
  }
  svg {
    margin-right: 10px;
  }
`;

const ModalTab = styled.div`
  align-items: flex-end;
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 32px;
  justify-content: space-between;

  .load-data-modal__tab__inner {
    display: flex;
  }
  .load-data-modal__tab__item {
    border-bottom: 3px solid transparent;
    cursor: pointer;
    margin-left: 32px;
    padding: 16px 0;
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.subtextColorLT};

    :first-child {
      margin-left: 0;
      padding-left: 0;
    }

    :hover {
      color: ${props => props.theme.textColorLT};
    }
  }

  .load-data-modal__tab__item.active {
    color: ${props => props.theme.textColorLT};
    border-bottom: 3px solid ${props => props.theme.textColorLT};
    font-weight: 500;
  }
`;

/* this is the thumbnail next to the "Click here to access sample maps/data" button */
// const StyledMapIcon = styled.div`
//   background-image: url("${ASSETS_URL}icon-demo-map.jpg");
//   background-repeat: no-repeat;
//   background-size: 64px 48px;
//   width: 64px;
//   height: 48px;
//   border-radius: 2px;
// `;

const StyledTrySampleData = styled.div`
  display: flex;
  margin-bottom: 12px;

  .demo-map-title {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .demo-map-label {
    font-size: 11px;
    color: ${props => props.theme.labelColorLT};
  }

  .demo-map-action {
    display: flex;
    font-size: 14px;
    align-items: center;
    color: ${props => props.theme.titleColorLT};
    cursor: pointer;

    :hover {
      font-weight: 500;
    }

    span {
      white-space: nowrap;
    }
    svg {
      margin-left: 10px;
    }
  }
`;

const StyledSpinner = styled.div`
  text-align: center;
  span {
    margin: 0 auto;
  }
`;

const generateAdminLevels = (deepestLevel) => {
  // parse int to ensure the value passed in Array() is a number; else, the function won't work properly.
  // if deepestLevel is, say, 3, the function will give us array [0, 1, 2, 3]
  let adminLevels = [...Array(parseInt(deepestLevel, 10) + 1).keys()]
    .map(value => {
      return { adminLevel: value, id: shortid.generate() };
    });
  return adminLevels;
}

const client_url = window.location.origin; // will be something like http://localhost:8080
const server_url = client_url.substr(0, client_url.length - 4) + config.server_port; // change that to http://localhost:5000

class LoadDataModal extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    adminList: [],
    mobilityAdminList: [],
    countryAndAdminList: [],
    mobilityCtryAndAdminList: [],
    countrySelected: '',
    mobilityCtrySelected: '',
    adminSelected: '',
    mobilityAdminSelected: '',
    isShapefileListLoading: true,
    submitReady: false,
    submitMobilityReady: false
  }

  handleCountryChange = (event) => {
    let code = event.target.value;
    this.setCountryAndAdminList('adminList', 'countrySelected', 'countryAndAdminList', 'submitReady', code);
  }

  handleAdminChange = (event) => {
    let admin = event.target.value;
    this.setAdmin('submitReady', 'adminSelected', admin);
  }

  setAdmin = (submitVarName, adminVarName, admin) => {
    if (admin !== "") {
      this.setState({
        [submitVarName]: true,
        [adminVarName]: admin
      });
    }
    else {
      this.setState({ [submitVarName]: false });
    }
  }

  handleMobilityAdminChange = (event) => {
    let admin = event.target.value;
    this.setAdmin('submitMobilityReady', 'mobilityAdminSelected', admin);
  }

  handleMobilityCountryChange = (event) => {
    let code = event.target.value;
    this.setCountryAndAdminList('mobilityAdminList', 'mobilityCtrySelected', 'mobilityCtryAndAdminList', 'submitMobilityReady', code);
  }

  setCountryAndAdminList = (adminListVarName, ctrySelectedVarName, cntryAndAdminListVarName, submitVarName, code) => {
    if (code !== "") {
      let country = this.state[cntryAndAdminListVarName].find(e => e.countryCode === code);
      let maxAdmin = parseInt(country.adminLevel, 10)
      let adminList = generateAdminLevels(maxAdmin);

      this.setState({
        [adminListVarName]: adminList,
        [ctrySelectedVarName]: country
      });
    } else
      this.setState({
        [submitVarName]: false,
        [adminListVarName]: [],
        [ctrySelectedVarName]: ''
      });
  }

  handleShapefileChoice = (event) => {
    event.preventDefault();
    let countryCode = this.state.countrySelected.countryCode;
    let adminLevel = this.state.adminSelected;
    this.fetchSelectedShapefile(countryCode, adminLevel)
  }

  fetchSelectedShapefile = (countryCode, adminLevel) => {
    fetch(`/api/shapefiles/countries/${countryCode}/${adminLevel}`)
    .then(res => res.json())
    .then(t => {
      let geojson = topojson.feature(t, t.objects.collection);
      let dataSets = {
        datasets: [
          {
            info: {
              id: `shapefile-${countryCode}-${adminLevel}`,
              label: `Shapefile for ${countryCode} L-${adminLevel}`
            },
            data: Processors.processGeojson(geojson)
          }
        ]
      };
      this.props.dispatch(addDataToMap(dataSets));
      this.setState({
        adminList: [],
        countryAndAdminList: [],
        countrySelected: '',
        adminSelected: '',
        isShapefileListLoading: true,
        submitReady: false
      })
    })
    .catch(err => console.log(err));
  }

  handleMobilityChoice = (event) => {
    event.preventDefault();
    let form = event.target;
    let countryCode = this.state.mobilityCtrySelected.countryCode;
    let adminLevel = this.state.mobilityAdminSelected;
    this.fetchSelectedMobilityData(countryCode, adminLevel);
  }

  fetchSelectedMobilityData = (countryCode, adminLevel) => {
    fetch(`/api/mobility/countries/${countryCode}/${adminLevel}`)
      .then(res => res.json())
      .then(result => {
        console.log(result);
        let dataSets = {
          datasets: [
            {
              info: {
                id: `mobility data ${countryCode}`,
                label: `Mobility data for ${countryCode}`
              },
              data: Processors.processCsvData(result.data)
            }
          ]
        };
        this.props.dispatch(addDataToMap(dataSets));
        this.setState({
          mobilityAdminList: [],
          mobilityCtryAndAdminList: [],
          mobilityCtrySelected: '',
          mobilityAdminSelected: '',
          submitMobilityReady: false
        })
      }).catch(err => console.log(err));
  }

  fetchCountries = (path) => {
    fetch(path)
      .then(res => res.json())
      .then(result => {
        let resultWithIds = result.map(entry => {
          return {
            ...entry,
            countryName: shapefileHashEnglish[(entry.countryCode).toLowerCase()] || entry.countryCode, // in case there's not a matched proper name
            id: shortid.generate()
          };
        });
        helper_alphabetize.alphabetize_list(resultWithIds, 'countryName');
        if (path === '/api/shapefiles/countries'){
          this.setState({
            countryAndAdminList: resultWithIds,
            isShapefileListLoading: false
          });
        } else if (path === '/api/mobility/countries') {
          this.setState({
            mobilityCtryAndAdminList: resultWithIds
          });
        }
      }).catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchCountries('/api/shapefiles/countries');
    this.fetchCountries('/api/mobility/countries');
  }

  render() {
    const { loadingMethod, currentOption, previousMethod, sampleMaps, isMapLoading } = this.props;
    return (
      <ThemeProvider theme={themeLT}>
        <div className="load-data-modal">
          {isMapLoading ? (
            <StyledSpinner>
              <LoadingSpinner />
            </StyledSpinner>
          ) : (
              <div>
                {loadingMethod.id !== 'sample' ? (
                  <Tabs
                    method={loadingMethod.id}
                    toggleMethod={this.props.onSetLoadingMethod}
                  />
                ) : null}
                {loadingMethod.id === 'upload' ? (
                  <FileUpload onFileUpload={this.props.onFileUpload} />
                ) : null}
                {loadingMethod.id === 'sample' ? (
                  <div className="gallery">
                    <BackLink onClick={() => this.props.onSetLoadingMethod(previousMethod.id)}>
                      <Icons.LeftArrow height="12px" />
                      <span>Back</span>
                    </BackLink>
                    <SampleMapGallery
                      sampleData={currentOption}
                      sampleMaps={sampleMaps}
                      onLoadSampleData={this.props.onLoadSampleData} />
                    <div className="shapefile-gallery">
                      {this.state.isShapefileListLoading ? (
                        <StyledSpinner>
                          <LoadingSpinner />
                        </StyledSpinner>
                      ) : (

                          <CountryShapefileSelect
                            adminList={this.state.adminList}
                            mobilityAdminList={this.state.mobilityAdminList}
                            countryList={this.state.countryAndAdminList}
                            mobilityCtryList={this.state.mobilityCtryAndAdminList}
                            onAdminChange={this.handleAdminChange}
                            onMobilityAdminChange={this.handleMobilityAdminChange}
                            onCountryChange={this.handleCountryChange}
                            onMobilityCountryChange={this.handleMobilityCountryChange}
                            onShapefileSelected={this.handleShapefileChoice}
                            showAdmins={!!this.state.countrySelected}
                            showMobilityAdmins={!!this.state.mobilityCtrySelected}
                            submitReady={this.state.submitReady}
                            onMobilitySelected={this.handleMobilityChoice}
                            submitMobilityReady={this.state.submitMobilityReady} />
                        )}
                    </div>
                  </div>
                ) : null}
              </div>)
          }
        </div>
      </ThemeProvider>
    );
  }
};

const Tabs = ({ method, toggleMethod }) => (
  <ModalTab className="load-data-modal__tab">
    <div className="load-data-modal__tab__inner">
      {LOADING_METHODS.map(
        ({ id, label }) =>
          id !== 'sample' ? (
            <div
              className={classnames('load-data-modal__tab__item', {
                active: method && id === method
              })}
              key={id}
              onClick={() => toggleMethod(id)}
            >
              <div>{label}</div>
            </div>
          ) : null
      )}
    </div>
    <TrySampleData onClick={() => toggleMethod(QUERY_TYPES.sample)} />
  </ModalTab>
);

const TrySampleData = ({ onClick }) => (
  <StyledTrySampleData className="try-sample-data">
    <div className="demo-map-title">
      <div className="demo-map-label">Select shapefile from</div>
      <div className="demo-map-action" onClick={onClick}>
        <span>MagicBox</span>
        <Icons.ArrowRight height="16px" />
      </div>
    </div>
  </StyledTrySampleData>
);

LoadDataModal.propTypes = propTypes;

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  dispatchToProps
)(LoadDataModal);
