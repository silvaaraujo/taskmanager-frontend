(function($) {
	
	alert = {};

	alert.show = function(msg) { 
		$.bootstrapGrowl(msg);
	};
	
	alert.info = function(msg) { 
		$.bootstrapGrowl(msg, {
			type: 'info'
		});
	};
	
	alert.success = function(msg) { 
		$.bootstrapGrowl(msg, {
			type: 'success'
		});
	};
	
	alert.error = function(msg) { 
		$.bootstrapGrowl(msg, {
			type: 'danger'
		});
	};
	
	alert.warning = function(msg) { 
		$.bootstrapGrowl(msg, {
			type: 'warning'
		});
	};

})(jQuery);