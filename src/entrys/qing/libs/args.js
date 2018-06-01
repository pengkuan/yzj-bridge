const ArrayFrom = Array.from


export default ArrayFrom? ArrayFrom : (args) => {
  // avoid leaking arguments:
  // http://jsperf.com/closure-with-arguments
  var len = args.length
  var arr = []
  for (var i = 0; i < len; i ++) {
    arr.push(args[i])
  }
  return arr
}