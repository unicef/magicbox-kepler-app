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

import React, {Component} from 'react';
import classnames from 'classnames';
import styled, {ThemeProvider} from 'styled-components';
import PropTypes from 'prop-types';
import {FileUpload} from 'kepler.gl/components';
import {LoadingSpinner} from 'kepler.gl/components';
import {themeLT} from 'kepler.gl/styles';
import {Icons} from 'kepler.gl/components/';
import config from '../../../config';
import {shapefileHashEnglish} from './english-shapefile-hash';
import shortid from 'shortid';
import {updateVisData, addDataToMap} from 'kepler.gl/actions';

import {LOADING_METHODS, QUERY_TYPES, ASSETS_URL} from '../../constants/default-settings';

import DataGallery from './data-viewer';

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

const StyledMapIcon = styled.div`
  background-image: url("${ASSETS_URL}icon-demo-map.jpg");
  background-repeat: no-repeat;
  background-size: 64px 48px;
  width: 64px;
  height: 48px;
  border-radius: 2px;
`;

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


const client_url = location.origin; // will be something like http://localhost:8080
const server_url = client_url.substr(0, client_url.length-4) + config.server_port; // change that to http://localhost:5000


class LoadDataModal extends Component {
    constructor(props) {
      super(props)
    }

    state = {
      countryAndAdminList: []
    }

    componentDidMount() {
      fetch(server_url + '/api/countries')
        .then(res => res.json())
        .then(result => {
          let resultWithIds = result.map(entry => {
            return {
              ...entry,
              countryName: shapefileHashEnglish[(entry.countryCode).toLowerCase()] || entry.countryCode, // in case there's not a matched proper name
              id: shortid.generate()
            };
          });
          resultWithIds.sort((a, b) => {
            let codeA = a.countryName.toLowerCase();
            let codeB = b.countryName.toLowerCase();
            if (codeA > codeB) return 1;
            if (codeA < codeB) return -1;
            return 0;
          });
          // console.log('sorted result', resultWithIds);
          this.setState({ countryAndAdminList: resultWithIds });
        }).catch(err => console.log(err));
    }


  render() {
    const {loadingMethod, currentOption, previousMethod, sampleMaps, isMapLoading} = this.props;
    console.log("isMapLoading & loadingMethod.id & state " + loadingMethod.id + ", " + isMapLoading + ", " + this.state.countryAndAdminList.length)
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
                  <DataGallery
                    // sampleData={currentOption}
                    sampleMaps={this.state.countryAndAdminList}
                    back={() => this.props.onSetLoadingMethod(previousMethod.id)}
                    onLoadSampleData={this.props.onLoadSampleData}/>
                ) : null}
              </div>)
          }
        </div>
      </ThemeProvider>
    );
  }
}

const Tabs = ({method, toggleMethod}) => (
  <ModalTab className="load-data-modal__tab">
    <div className="load-data-modal__tab__inner">
      {LOADING_METHODS.map(
        ({id, label}) =>
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

const TrySampleData = ({onClick}) => (
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

export default LoadDataModal;
