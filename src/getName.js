const getName = (str) => (str ? str.replace(/[^\w]/gi, '-') : '');

export default getName;
