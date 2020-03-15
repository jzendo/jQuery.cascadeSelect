var testData_ = {}

testData_.list1 = {
  "": [
    { id: 1, label: "label1" },
    { id: 2, label: "label2" }
  ]
};

testData_.list2 = {
  "1": [
    { id: 11, label: "label1-1" },
    { id: 12, label: "label1-2" }
  ],
  "2": [
    { id: 21, label: "label2-1" },
    { id: 22, label: "label2-2" }
  ]
};

testData_.list3 = {
  "11": [
    { id: 111, label: "label1-1-1" },
    { id: 112, label: "label1-1-2" }
  ],
  "12": [
    { id: 121, label: "label1-2-1" },
    { id: 122, label: "label1-2-2" }
  ],
  "21": [
    { id: 211, label: "label2-1-1" },
    { id: 212, label: "label2-1-2" }
  ],
  "22": [
    { id: 221, label: "label2-2-1" },
    { id: 222, label: "label2-2-2" }
  ]
};

testData_.getTopList = function (rootKey) {
  rootKey = rootKey === undefined ? '' : rootKey
  return testData_.list1[rootKey]
}

testData_.getIds = function (list) {
  return list.map(function (itm) {
    return itm.id
  })
}

testData_.getListByParent = function (parent, targetList) {
  parent = parent || ''
  return targetList[parent] || null
}

testData_.joinIds = function (id1, id2 /* , id3, .... */) {
  if (typeof id1 === 'object' && id1.constructor === Array) return id1.join(';')

  var ids = Array.prototype.slice.call(arguments)
  return ids.join(';')
}
