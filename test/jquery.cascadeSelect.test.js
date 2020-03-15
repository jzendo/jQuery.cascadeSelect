/* global QUnit, $, testData_ */
QUnit.module('$.fn.cascadeSelect')

QUnit.test('namespace', function (assert) {
  assert.ok(typeof $.fn.cascadeSelect === 'function', 'Passed!')
})

QUnit.test('constructor', function (assert) {
  var $ele = $('<div></div>')
  $ele.appendTo('#qunit-fixture')

  var result

  try {
    $ele.cascadeSelect()
    result = 1
  } catch (e) {
    result = 2
  }

  assert.equal(result, 2, 'should fire a exception without options')
})

QUnit.test('init plugin with normal data', function (assert) {
  var done = assert.async()

  testData_.initPluginWithNormalData(function ($list1, $list2, $list3) {
    var testSize = function ($list, no) {
      assert.equal($list.size(), 1, 'List ' + no + ' here!')
    }

    var testDefaultVal = function ($list) {
      var firstValue = $list.find('option').attr('value')
      var otherValues = $list.find('option').filter(':not(:eq(0))').map(function (i, ele) { return $(ele).attr('value') }).get()
      var joinedId = testData_.joinIds.apply(null, otherValues)

      assert.equal($list.val(), firstValue, 'default value is first item')
      assert.equal(firstValue, joinedId, 'the first value is all other joined!')
    }

    testSize($list1, 1)
    testSize($list2, 1)
    testSize($list3, 1)

    testDefaultVal($list1)
    testDefaultVal($list2)
    testDefaultVal($list3)

    done()
  })
})

QUnit.test('function with normal data', function (assert) {
  var done = assert.async()

  var setAndGet = function ($list, dataMap, parentValue) {
    var list = testData_.getListByParent(parentValue, dataMap)
    var ids = testData_.getIds(list)
    var firstValue = ids[0]
    var lastValue = ids[ids.length - 1]
    $list.val(firstValue)

    return {
      firstValue,
      lastValue,
      ids
    }
  }

  testData_.initPluginWithNormalData(function ($list1, $list2, $list3) {
    var result1 = setAndGet($list1, testData_.list1)
    var result2 = setAndGet($list2, testData_.list2, result1.firstValue)
    var result3 = setAndGet($list3, testData_.list3, result2.firstValue)

    assert.equal($list1.val(), result1.firstValue, 'match the list 1 selected value!')
    assert.equal($list2.val(), result2.firstValue, 'match the list 2 selected value!')
    assert.equal($list3.val(), result3.firstValue, 'match the list 3 selected value!')

    assert.equal($list2.find('option').size(), result2.ids.length + 1, 'should has some items, including the check-all item!')
    assert.equal($list3.find('option').size(), result3.ids.length + 1, 'should has some items, including the check-all item!')

    $list2.val(result2.lastValue)

    var ids = testData_.getIds(testData_.getListByParent(result2.lastValue, testData_.list3))
    assert.equal($list3.val(), testData_.joinIds(ids), 'Change the parent will reset the child list with the first item (default) !')

    done()
  })
})
