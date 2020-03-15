/*!
 * jQuery CascadeSelect Plugin <by zendo <jzendo@example.com>>
 * - Ver: 0.0.2, Build: Sun, 15 Mar 2020 16:19:51 GMT
 * - Repos: https://github.com/jzendo/jquery.cascadeSelect.git
 */
"use strict";

(function ($) {
  var KEY_DATA_INITED = 'inited.cascadeSelect';
  var KEY_DATA_OPTION = 'option.cascadeSelect';
  var KEY_DATA_PREVICOUSUPPERTIER = 'previous-uppertier.cascadeSelect';
  var EVENT_CHANGE = 'cascadeSelectChange';

  (function (originVal) {
    $.fn.val = function (value) {
      if (!arguments.length) {
        return originVal.call(this);
      }

      var r = originVal.call(this, value);
      return r.each(function () {
        if ($(this).data(KEY_DATA_INITED)) {
          $(this).trigger(EVENT_CHANGE);
        }
      });
    };
  })($.fn.val);

  var getList = function getList(strUpperTier, dataSource) {
    if (dataSource && strUpperTier !== undefined) {
      var upperTiers = strUpperTier.split(';');
      var r = [];
      var upperTier;

      for (var i = 0, len = upperTiers.length; i < len; i++) {
        upperTier = upperTiers[i];

        if (dataSource[upperTier]) {
          r = r.concat(dataSource[upperTier]);
        }
      }

      return r;
    }

    return null;
  };

  var genOptionHtml = function genOptionHtml(value, text) {
    return '<option value="' + value + '">' + text + '</option>';
  };

  var updateOptionHtml = function updateOptionHtml(select, data, upperTier) {
    var list = getList(upperTier, data.dataSource);
    var $select = $(select);

    if (list) {
      if ($select.data(KEY_DATA_PREVICOUSUPPERTIER) !== upperTier) {
        var _ref, _data$labels;

        var h = [];
        var allIds = [];
        $.each(list, function (i, itm) {
          allIds.push(itm.id);
          h.push(genOptionHtml(itm.id, itm.label));
        });
        h.unshift(genOptionHtml(allIds.join(';'), (_ref = data === null || data === void 0 ? void 0 : (_data$labels = data.labels) === null || _data$labels === void 0 ? void 0 : _data$labels.all) !== null && _ref !== void 0 ? _ref : '全部'));
        $select.html(h.join(''));
        $select.data(KEY_DATA_PREVICOUSUPPERTIER, upperTier);
        h = null;
        allIds = null;
      }
    } else {
      throw new Error('Missing data, key=' + upperTier);
    }
  };

  $.fn.cascadeSelect = function (option) {
    return this.each(function () {
      var $this = $(this);

      if (!$this.data(KEY_DATA_INITED)) {
        $this.data(KEY_DATA_INITED, true);
      }

      updateOptionHtml(this, option, option.upperTierGetter());
      $this.data(KEY_DATA_OPTION, option);
      $this.bind('change', function () {
        var $this = $(this);
        var val = $this.val();
        updateOptionHtml(this, option, option.upperTierGetter());
        $this.val(val);
      });
      $this.bind('update', function () {
        var $this = $(this);
        $this.trigger('change');
      });
    });
  };
})(jQuery);
