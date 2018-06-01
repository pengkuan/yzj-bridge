var Q = require('q');

function Promise(fun){
  var deferred = Q.defer();
  fun.on('end' , deferred.resolve);
  return deferred.promise;
}

function tasks(array , cb){
  var list = [];
  array.forEach(function(task){
      list.push(Promise(task));
  });

  if (list.length == 0) {
    cb && cb();
    return;
  }
  
  return Q.all(list).then(function(){
    cb && cb();
  });
}

module.exports = tasks;