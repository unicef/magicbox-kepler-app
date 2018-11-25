module.exports = {
  fetch_default_user_map: (addDataToMap, props) => {
    console.log(props.user)
    let fetch_defaut_path = '/api/maps/default/'
    let token = 'default'
    if (props.user) {
      if (props.user.tokenStr) {
       token = props.user.tokenStr
      }
    }
    fetch_defaut_path += token
    fetch(fetch_defaut_path)
      .then(res => res.json()) // transform the data into json
      .then(obj => {
        console.log('Arrived')
        console.log(obj)
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
      })
      .catch(err => console.log(err))
  }
}
