var events = {}

export function on (eventName, callback) {
  if (!events[eventName]) {
    events[eventName] = []
  }
  events[eventName].push(callback)
}
// 触发事件
export function emit (eventName, params) {
  (events[eventName] || []).forEach(function (callback) {
    if (typeof callback === 'function') {
      callback(params);
    }
  })
}