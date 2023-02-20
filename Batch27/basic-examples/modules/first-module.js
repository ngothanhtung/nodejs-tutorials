// exports.hello = function () {
//   return 'Hello Nodejs';
// };

function hello() {
  console.log('Hello Nodejs');
  return 'Hello Nodejs';
}

// Legacy
module.exports = hello;
// ES6
// export default hello;
