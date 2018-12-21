module.exports = {
  fetch_default_user_map: (addDataToMap, props) => {
    console.log(props.user)
    let token = 'default'
    if (props.user) {
      if (props.user.tokenStr) {
       token = props.user.tokenStr
      }
    }
    const url = '/api/maps/default';
    fetch(url, {
      method: 'GET',
      headers: {
        'x-access-token' : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(obj => {
        if (!obj.error) {
          let dataSets = {datasets: obj.datasets.map(s => { return {
            info: {
              id: s.data.id,
              label: s.data.label,
              color: s.data.color
            },
            data: {
              fields: s.data.fields,
              rows: s.data.allData
            }
          }}), config: obj.config}

          // addDataToMap action to inject dataset into kepler.gl instance
          props.dispatch(addDataToMap(dataSets))

        }
      })
      .catch(err => console.log(err))
  }
}
