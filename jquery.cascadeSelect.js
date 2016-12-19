(function($) {
  var CASCADESELECT_DATAMARKER_INITED = "inited.cascadeSelect";
  var CASCADESELECT_DATAMARKER_OPTION = "option.cascadeSelect";
  var CASCADESELECT_DATAMARKER_PREVICOUSUPPERTIER = "previous-uppertier.cascadeSelect"

  var CASCADESELECT_CHANGEEVENT = "cascadeSelectChange";

  // Override $.fn.val, opt for cascadeSelect applied elements.
  (function() {
    var originVal = $.fn.val;
    $.fn.val = function(value) {
      if ( !arguments.length ) {
         return originVal.call(this);
      }  

      // Setter
      var r = originVal.call(this, value);
      return r.each(function() {
        if ($(this).data(CASCADESELECT_DATAMARKER_INITED)) {
          $(this).trigger(CASCADESELECT_CHANGEEVENT);
        }
      });
    };
  })();

  // Generate list by upper-tier.
  var getList = function(strUpperTier, dataSource) {
  	if (dataSource && (strUpperTier != undefined)) {
    	var upperTiers = strUpperTier.split(";");
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
  
  // Generate option html
  var genOptionHtml = function(value, text) {
  	return "<option value=\"" + value + "\">" + text + "</option>";
  };

  // Update select html
	var updateOptionHtml = function(select, data, upperTier) {
    var list = getList(upperTier, data.dataSource);
    var $select = $(select);
    if (list) {
      if ($select.data(CASCADESELECT_DATAMARKER_PREVICOUSUPPERTIER) !== upperTier) {
        var h = [];
        var allIds = [];
        $.each(list, function(i, itm) {
          allIds.push(itm.id);
          h.push(genOptionHtml(itm.id, itm.label));
        });
        // Generate default option
        h.unshift(genOptionHtml(allIds.join(";"), "全部"));
        $select.html(h.join(""));
        $select.data(CASCADESELECT_DATAMARKER_PREVICOUSUPPERTIER, upperTier);
        h = null;
        allIds = null;
      }
    } else {
			throw new Error("Missing data, key=" + upperTier);
    }
  };

  /**
   * $.fn.cascadeSelect plugin
   * @param {objct} option plugin config data
   * @return {jQuery} jQuery object
   *  option : 
   *     {
   *       upperTierGetter: {function},  // return upperTier key
   *       dataSource: {array}           // Data source
   *     }
   *
   */
  $.fn.cascadeSelect = function(option) {
    return this.each(function() {
    	var $this = $(this);
    	if (!$this.data(CASCADESELECT_DATAMARKER_INITED)) {
        $this.data(CASCADESELECT_DATAMARKER_INITED, true);
      }

      updateOptionHtml(this, option, option.upperTierGetter());
      $this.data(CASCADESELECT_DATAMARKER_OPTION, option);

      // Internal
      $this.bind("change", function() {
        var $this = $(this);
        var val = $this.val();
        updateOptionHtml(this, option, option.upperTierGetter());
        $this.val(val); // A trick, get the real value.
      });

      // For external API. Like $(elem).trigger("update");
      $this.bind("update", function() {
        $(this).trigger("change");
      });
    });
  };
})(jQuery);