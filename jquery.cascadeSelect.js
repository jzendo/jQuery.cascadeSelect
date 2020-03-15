/* global jQuery */

(function ($) {
  // Data keys
  const KEY_DATA_INITED = 'inited.cascadeSelect'
  const KEY_DATA_OPTION = 'option.cascadeSelect'
  const KEY_DATA_PREVICOUSUPPERTIER = 'previous-uppertier.cascadeSelect'
  // Events
  const EVENT_CHANGE = 'cascadeSelectChange';

  // Override $.fn.val
  // Opt for elements which has used cascadeSelect plugin.
  (function (originVal) {
    $.fn.val = function (value) {
      // Getter
      if (!arguments.length) {
        return originVal.call(this)
      }

      // Setter
      const r = originVal.call(this, value)
      // Fire cascade changed
      return r.each(function () {
        if ($(this).data(KEY_DATA_INITED)) {
          $(this).trigger(EVENT_CHANGE)
        }
      })
    }
  })($.fn.val)

  // Generate list by upper-tier.
  const getList = function (strUpperTier, dataSource) {
    if (dataSource && strUpperTier !== undefined) {
      const upperTiers = strUpperTier.split(';')
      let r = []
      let upperTier

      for (let i = 0, len = upperTiers.length; i < len; i++) {
        upperTier = upperTiers[i]
        // Only for valid list.
        if (dataSource[upperTier]) {
          r = r.concat(dataSource[upperTier])
        }
      }
      return r
    }
    return null
  }

  // Generate option html
  const genOptionHtml = (value, text) =>
    '<option value="' + value + '">' + text + '</option>'

  // Update select html
  const updateOptionHtml = function (select, data, upperTier) {
    const list = getList(upperTier, data.dataSource)
    const $select = $(select)

    if (list) {
      if (
        $select.data(KEY_DATA_PREVICOUSUPPERTIER) !== upperTier
      ) {
        let h = []
        let allIds = []
        $.each(list, function (i, itm) {
          allIds.push(itm.id)
          h.push(genOptionHtml(itm.id, itm.label))
        })
        // Generate default option
        h.unshift(genOptionHtml(allIds.join(';'), data?.labels?.all ?? '全部'))
        $select.html(h.join(''))
        $select.data(KEY_DATA_PREVICOUSUPPERTIER, upperTier)
        h = null
        allIds = null
      }
    } else {
      throw new Error('Missing data, key=' + upperTier)
    }
  }

  /**
   * $.fn.cascadeSelect Plugin
   *
   * @param {Object} option config data for plugin
   * @param {function} option.upperTierGetter return upperTier key
   * @param {Array} option.dataSource data source
   * @param {?Object} option.labels label map
   * @return {jQuery}
   *
   */
  $.fn.cascadeSelect = function (option) {
    return this.each(function () {
      const $this = $(this)
      if (!$this.data(KEY_DATA_INITED)) {
        $this.data(KEY_DATA_INITED, true)
      }

      updateOptionHtml(this, option, option.upperTierGetter())

      $this.data(KEY_DATA_OPTION, option)

      // If value changed, then call updated.
      $this.bind('change', function () {
        const $this = $(this)
        const val = $this.val()
        updateOptionHtml(this, option, option.upperTierGetter())
        $this.val(val) // A trick, get the real value.
      })

      // For external API. Like $(elem).trigger("update");
      $this.bind('update', function () {
        const $this = $(this)
        $this.trigger('change')
      })
    })
  }
})(jQuery)
