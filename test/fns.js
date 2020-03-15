/* global testData_, $ */

testData_.initPluginWithNormalData = function (readyFn) {
  $(function () {
    var $ele = $('<select id="list1"></select>&lt;=&gt;<select id="list2"></select>&lt;=&gt;<select id="list3"></select>')
    $ele.appendTo('#qunit-fixture')
    var cascadeSelectConfigA = {
      upperTierGetter: function () {
        return ''
      },
      dataSource: testData_.list1
    }

    var cascadeSelectConfigB = {
      upperTierGetter: function () {
        return $('#list1').val()
      },
      dataSource: testData_.list2
    }

    var cascadeSelectConfigC = {
      upperTierGetter: function () {
        return $('#list2').val()
      },
      dataSource: testData_.list3
    }

    var $list1 = $('#list1')
    var $list2 = $('#list2')
    var $list3 = $('#list3')

    $list1
      .cascadeSelect(cascadeSelectConfigA)
      .bind('cascadeSelectChange', function () {
        console.log('List1 fire the change.')
        // Update next tier
        $('#list2').trigger('update')
      })

    $list2
      .cascadeSelect(cascadeSelectConfigB)
      .bind('cascadeSelectChange', function () {
        console.log('List2 fire the change.')
        // Update next tier
        $('#list3').trigger('update')
      })

    $list3
      .cascadeSelect(cascadeSelectConfigC)
      .bind('cascadeSelectChange', function () {
        console.log('List3 fire the change.')
      })

    readyFn($list1, $list2, $list3)
  })
}
