module.exports = {
  // keep just the deepest adminLevel
  // the array is sorted e.g. ABW_0, AFG_0, AFG_1, AFG_2, AGO_0, AGO_1, AGO_2, AGO_3, AIA_0, etc.
  // so by selecting the entry right before the countryCode switches, we obtain the entry with the deepest adminLevel
  minifyCountryList: list => {
    return list.filter((entry, index) => {
      if (index === list.length - 1) {
        return list[index].countryCode;
      } else {
        return entry.countryCode !== list[index + 1].countryCode;
      }
    })
  },
}
