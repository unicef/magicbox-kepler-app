module.exports = {
  alphabetize_list: (list, nameKey) => {
    list.sort((a, b) => {
      let codeA = a[nameKey].toLowerCase();
      let codeB = b[nameKey].toLowerCase();
      if (codeA > codeB) return 1;
      if (codeA < codeB) return -1;
      return 0;
    });
  }
}
