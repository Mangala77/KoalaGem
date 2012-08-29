/*
*	JQGrid state managment
*
*	@requires json2.js - http://www.json.org/json2.js (JSON serializer)
*   @requires jstorage.js - http://www.jstorage.info (jStorage plugin)
*/

var nonModelColumns = ["cb", "subgrid", "rn"];

//************************** Utils functions *************************************************
function swap(key1, key2, arr) {
	if (typeof (arr[key1]) !== 'undefined' && typeof (arr[key2]) !== 'undefined') {
		var tmp = arr[key1];
		arr[key1] = arr[key2]
		arr[key2] = tmp;
	}
};

//*************************** Grid state object ************************************
function GridState(options) {
	this.stateOpts = {
		storageKey: null,
		columns: false,
		filters: false,
		selection: false,
		expansion: false,
		pager: false,
		order: false
	};
	this.colsData = null;
	this.filtersData = null;
	this.pagerData = null;
	this.orderData = null;
	this.selRows = [];
	this.expRows = [];

	this.save = function(grid) {
		if (grid) {
			this.refreshOptions(grid);
			this.refresh(grid);
		}

		var dataToSave = {};
		if (this.stateOpts.columns)
			dataToSave.colsData = this.colsData;
		if (this.stateOpts.filters)
			dataToSave.filtersData = this.filtersData;
		if (this.stateOpts.selection)
			dataToSave.selRows = this.selRows;
		if (this.stateOpts.expansion)
			dataToSave.expRows = this.expRows;
		if (this.stateOpts.pager)
			dataToSave.pagerData = this.pagerData;
		if (this.stateOpts.order)
			dataToSave.orderData = this.orderData;

		$.jStorage.set(this.stateOpts.storageKey, dataToSave);
		return this;
	};
	this.load = function(storageKey) {
		if (storageKey)
			this.stateOpts.storageKey = storageKey;

		if (this.stateOpts.storageKey) {
			var savedState = $.jStorage.get(this.stateOpts.storageKey);
			if (savedState) {
				this.colsData = savedState.colsData;
				this.filtersData = savedState.filtersData;
				this.selRows = !savedState.selRows ? [] : savedState.selRows;
				this.expRows = !savedState.expRows ? [] : savedState.expRows;
				this.pagerData = savedState.pagerData;
				this.orderData = savedState.orderData;
			}
		}

		return this;
	};
	this.refresh = function(grid) {
		this.refreshOptions(grid);

		if (this.stateOpts.columns)
			this.refreshColumns(grid);

		if (this.stateOpts.filters)
			this.refreshFilters(grid);

		if (this.stateOpts.selection)
			this.refreshSelection(grid);

		if (this.stateOpts.pager)
			this.refreshPagerData(grid);

		if (this.stateOpts.order)
			this.refreshOrderData(grid);

		return this;
	};
	this.refreshOptions = function(gridOrOpts) {
		gridOrOpts = gridOrOpts || '';

		var opts = typeof (gridOrOpts) === 'string'
				   ? gridOrOpts
				   : jQuery.isFunction(gridOrOpts.getGridParams)
					 ? gridOrOpts.getGridParams('stateOptions')
					 : gridOrOpts;

		if (jQuery.isFunction(opts))
			opts = opts.call(gridOrOpts);

		if (typeof (opts) === 'string') {
			this.stateOpts.storageKey = opts;
			this.stateOpts.columns = this.stateOpts.filters =
			this.stateOpts.selection = this.stateOpts.expansion = 
			this.stateOpts.pager = this.stateOpts.order = true;
		}
		else if (typeof (opts) === 'object')
			jQuery.extend(this.stateOpts, opts);

		return this;
	}
	this.refreshColumns = function(grid) {
		this.colsData = { count: 0, cols: {} };

		var nonModelColCount = 0;
		var colModel = grid.getGridParam('colModel');
		for (i = 0; i < colModel.length; i++) {
			if (jQuery.inArray(colModel[i].name, nonModelColumns) != -1) {
				nonModelColCount++;
				continue;
			}

			this.colsData.count++;
			this.colsData.cols[colModel[i].name] = {
				hidden: colModel[i].hidden,
				width: colModel[i].width,
				uiIndex: i - nonModelColCount
			};
		}

		return this;
	};
	this.refreshFilters = function(grid) {
		var prmNames = grid.getGridParam('prmNames');
		var postData = grid.getGridParam('postData');
		var sFilter = grid.searchGrid('sFilter');
		if (sFilter) {
			var fltrData = postData[sFilter];
			var searchBtn = jQuery('div.ui-pg-div span.ui-icon.ui-icon-search');
			if (prmNames.search && postData[prmNames.search]) {
				searchBtn.parent().addClass('ui-state-default ui-corner-all');
				this.filtersData = JSON.parse(fltrData);
			}
			else if (fltrData === '') {
				searchBtn.parent().removeClass('ui-state-default ui-corner-all');
				this.filtersData = null;
			}
		}

		return this;
	};
	this.refreshSelection = function(grid) {
		this.selRows = grid.getGridParam('multiselect')
					   ? grid.getGridParam('selarrrow')
					   : [grid.getGridParam('selrow')];

		return this;
	};
	this.refreshPagerData = function(grid) {
		this.pagerData = {
			page: grid.getGridParam('page'),
			rowNum: grid.getGridParam('rowNum')
		};

		return this;
	};
	this.refreshOrderData = function(grid) {
		this.orderData = {
			sortName: grid.getGridParam('sortname'),
			sortOrder: grid.getGridParam('sortorder')
		};

		return this;
	};
	this.updateGridOptions = function(gridOpts) {
		if (this.stateOpts.columns && this.colsData && this.colsData.count === gridOpts.colModel.length) {
			for (i = 0; i < gridOpts.colModel.length; i++) {
				var curState = this.colsData.cols[gridOpts.colModel[i].name];
				if (typeof (curState) === 'undefined' || curState == null)
					continue;

				gridOpts.colModel[i].width = curState.width;
				gridOpts.colModel[i].hidden = curState.hidden;

				if (curState.uiIndex != i) {
					swap(curState.uiIndex, i, gridOpts.colModel);
					swap(curState.uiIndex, i, gridOpts.colNames);
					i--;
				}
			}

			gridOpts.shrinkToFit = false;
		}

		if (this.stateOpts.selection && this.selRows.length > 0) {
			if (gridOpts.multiselect)
				gridOpts.selarrrow = this.selRows;
			else
				gridOpts.selrow = this.selRows[0];
		}

		if (this.stateOpts.pager && this.pagerData) {
			gridOpts.page = this.pagerData.page;
			gridOpts.rowNum = this.pagerData.rowNum;
		}

		if (this.stateOpts.order && this.orderData) {
			gridOpts.sortname = this.orderData.sortName;
			gridOpts.sortorder = this.orderData.sortOrder;
		}

		return this;
	};
	this.updateFilters = function(filterDlg) {
		function assignValues(fltRow, fltVals) {
			fltRow.find('select[name=field]').val(fltVals.field).change();
			fltRow.find('select[name=op]').val(fltVals.op).change();
			fltRow.find('.vdata').val(fltVals.data).change();
		}

		if (this.stateOpts.filters && this.filtersData) {
			jQuery(filterDlg).find('select[name=groupOp]').val(this.filtersData.groupOp);
			var fltRow = jQuery(filterDlg).find('tr.sf:last');
			if (this.filtersData.rules.length > 0) {
				assignValues(fltRow, this.filtersData.rules[0]);

				var index = 1;
				while (index < this.filtersData.rules.length) {
					jQuery(filterDlg).searchFilter().add();
					fltRow = jQuery(filterDlg).find('tr.sf:last');
					assignValues(fltRow, this.filtersData.rules[index]);

					index++;
				}
			}
		}

		return this;
	};
	this.updateExpansion = function(grid) {
		var gridRowIds = grid.getDataIDs();
		for(var i=0 ; i < gridRowIds.length ; i++) {
			if(jQuery.inArray(gridRowIds[i], this.expRows) != -1)
				grid.expandSubGridRow(gridRowIds[i]);
			else 
				grid.collapseSubGridRow(gridRowIds[i])
		}
	};
	this.addExpRow = function(rowId){
		var indx = jQuery.inArray(rowId, this.expRows);
		if(indx == -1)
			this.expRows.push(rowId);
	};
	this.delExpRow = function(rowId){
		var indx = jQuery.inArray(rowId, this.expRows);
		if(indx != -1)
			this.expRows.splice(indx, 1);
	};

	this._init = function(options) {
		if (options) {
			this.refreshOptions(options);

			if (typeof (options) === 'string') {
				this.load(options);
			}
		}
	};

	this._init(options);
}

//************************ Grid extensions to manipulate state *********************
(function($) {
	if ($.fn.jqGrid) {
		$.fn.extend({
			_baseJqGrid: $.fn.jqGrid,
			jqGrid: function(opts) {
				if (typeof (opts) !== "object") {
					var func = $.fn.jqGrid[opts];
					if (!func)
						throw ("jqGrid - No such method: " + opts)

					var args = $.makeArray(arguments).slice(1);
					return func.apply(this, args);
				}
				
				var gState = null;
				if(opts.stateOptions){
					gState = new GridState(opts.stateOptions);
					gState.load();
					gState.updateGridOptions(opts);
				}

				var gridSelector = this;
				var overrEvts = {};
					
				if(typeof(opts.loadBeforeSend) !== 'undefined')
					overrEvts.loadBeforeSend = opts.loadBeforeSend;
				opts.loadBeforeSend = function(xmlHttpReq) {
					var grid = $(gridSelector);
					var gState = grid.gridState();
					if (gState) {
						gState.refreshFilters(grid);
						gState.refreshPagerData(grid);
						gState.refreshOrderData(grid);
						gState.save();
					}

					var evts = grid.data('overrEvents');
					if (evts && evts.loadBeforeSend)
						evts.loadBeforeSend.call(this, xmlHttpReq);
				};

				if(typeof(opts.gridComplete) !== 'undefined')
					overrEvts.gridComplete = opts.gridComplete;
				opts.gridComplete = function() {
					var grid = $(gridSelector);
					var gState = grid.gridState();
					if(gState){
						var selRows = gState.selRows;
							
						grid.resetSelection();
						$(selRows).each(function(index, elem) {
							grid.setSelection(elem);
						});
							
						gState.updateExpansion(grid);
					}                        
						
					var evts = grid.data('overrEvents');
					if (evts && evts.gridComplete)
						evts.gridComplete.call(this);
				};
					
				if(typeof(opts.subGridRowExpanded) !== 'undefined')
					overrEvts.subGridRowExpanded = opts.subGridRowExpanded;
				opts.subGridRowExpanded = function(pID, id) {
					var grid = $(gridSelector);
					var gState = grid.gridState();
					if(gState){
						gState.addExpRow(id);
						gState.save();
					}
							
					var evts = grid.data('overrEvents');
					if (evts && evts.subGridRowExpanded)
						evts.subGridRowExpanded.call(this, pID, id);
				};
					
				if(typeof(opts.subGridRowColapsed) !== 'undefined')
					overrEvts.subGridRowColapsed = opts.subGridRowColapsed;
				opts.subGridRowColapsed = function(pID, id) {
					var grid = $(gridSelector);
					var gState = grid.gridState();
					if(gState){
						gState.delExpRow(id);
						gState.save();
					}
							
					var evts = grid.data('overrEvents');
					if (evts && evts.subGridRowColapsed)
						evts.subGridRowColapsed.call(this, pID, id);
				};

				var result = this._baseJqGrid.call(this, opts);
				if (result.length && result[0].grid) {
					if(gState)
						result.gridState(gState);
					
					result.data('overrEvents', overrEvts);

					if (result[0].grid.dragEnd) {
						$.extend(result[0].grid, {
							_baseDragEnd: result[0].grid.dragEnd,
							dragEnd: function() {
								this._baseDragEnd.call(this);
								var gState = result.gridState();
								if (gState) {
									gState.refreshColumns(result);
									gState.save();
								}
							}
						});

						$.extend(result[0].grid.dragEnd, result[0].grid._baseDragEnd);
					}
				}

				return result;
			}
		});

		$.extend($.fn.jqGrid, $.fn._baseJqGrid);

		if ($.fn.ShowHideCol) {
			$.jgrid.extend({
				_baseShowHideCol: $.fn.ShowHideCol,
				ShowHideCol: function(colname, show) {
					var result = this._baseShowHideCol.call(this, colname, show);
					var gState = this.gridState();
					if (gState) {
						gState.refreshColumns(this);
						gState.save();
					}

					return result;
				}
			});
			
			$.extend($.fn.ShowHideCol, $.fn._baseShowHideCol);
		}

		if ($.fn.setGridParam) {
			$.jgrid.extend({
				_baseSetGridParam: $.fn.setGridParam,
				setGridParam: function(newParams) {
					var grid = $(this);					
					var overrEvts = grid.data('overrEvents');

					if(typeof(newParams.loadBeforeSend) !== 'undefined'){
						overrEvts.loadBeforeSend = newParams.loadBeforeSend;
						newParams.loadBeforeSend = undefined;
					}
				
					if(typeof(newParams.gridComplete) !== 'undefined'){
						overrEvts.gridComplete = newParams.gridComplete;
						newParams.gridComplete = undefined;
					}
				
					if(typeof(newParams.subGridRowExpanded) !== 'undefined'){
						overrEvts.subGridRowExpanded = newParams.subGridRowExpanded;
						newParams.subGridRowExpanded = undefined;
					}
					
					if(typeof(newParams.subGridRowColapsed) !== 'undefined'){
						overrEvts.subGridRowColapsed = newParams.subGridRowColapsed;
						newParams.subGridRowColapsed = undefined;
					}
					
					var result = grid._baseSetGridParam.call(this, newParams);
					grid.data('overrEvents', overrEvts);

					if(typeof(newParams.stateOptions) !== 'undefined'){
						if(newParams.stateOptions){
							var gState = grid.gridState();
							if(!gState){
								gState = new GridState(newParams.stateOptions);
								gState.load();
							}
							else
								gState.refreshOptions(newParams.stateOptions);

							grid.gridState(gState)
						}
						else
							grid.gridState(null);
					}

					return result;
				}
			});

			$.extend($.fn.setGridParam, $.fn._baseSetGridParam);
		}

		if ($.fn.getGridParam) {
			$.jgrid.extend({
				_baseGetGridParam: $.fn.getGridParam,
				getGridParam: function(pName) {
					var overrEvts =  $(this).data('overrEvents') || {};
					switch (pName) {
						case 'beforeRequest':
							return overrEvts.beforeRequest;
						case 'gridComplete':
							return overrEvts.gridComplete;
						case 'subGridRowExpanded':
							return overrEvts.subGridRowExpanded;
						case 'subGridRowColapsed':
							return overrEvts.subGridRowColapsed;
						default:
							return this._baseGetGridParam.call(this, pName);
					}
				}
			});

			$.extend($.fn.getGridParam, $.fn._baseGetGridParam);
		}

		if ($.fn.remapColumns) {
			$.jgrid.extend({
				_baseRemapColumns: $.fn.remapColumns,
				remapColumns: function(permutation, updateCells, keepHeader) {
					this._baseRemapColumns.call(this, permutation, updateCells, keepHeader);
					var gState = this.gridState();
					if (gState) {
						gState.refreshColumns(this);
						gState.save();
					}
				}
			});

			$.extend($.fn.remapColumns, $.fn._baseRemapColumns);
		}

		if ($.fn.searchGrid) {
			$.jgrid.extend({
				_baseSearchGrid: $.fn.searchGrid,
				searchGrid: function(opts) {
					var options = this.data('searchOptions');
					if (!options)
						options = {};

					if (typeof (opts) === 'string')
						return options[opts];

					this.data('searchOptions', $.extend(options, opts));
					var result = this._baseSearchGrid.call(this, opts);
					var gState = this.gridState();
					if (gState) {
						var filterDlg = $('#fbox_' + this.attr('id'));
						gState.updateFilters(filterDlg);
					}

					return result;
				}
			});

			$.extend($.fn.searchGrid, $.fn._baseSearchGrid);
		}

		if ($.fn.setSelection) {
			$.jgrid.extend({
				_baseSetSelection: $.fn.setSelection,
				setSelection: function(selection, onsr) {
					this._baseSetSelection.call(this, selection, onsr);
					var gState = this.gridState();
					if (gState) {
						gState.refreshSelection(this);
						gState.save();
					}
				}
			});

			$.extend($.fn.setSelection, $.fn._baseSetSelection);
		}

		if ($.fn.resetSelection) {
			$.jgrid.extend({
				_baseResetSelection: $.fn.resetSelection,
				resetSelection: function() {
					this._baseResetSelection.call(this);
					var gState = this.gridState();
					if (gState) {
						gState.selRows = [];
						gState.save();
					}
				}
			});

			$.extend($.fn.resetSelection, $.fn._baseResetSelection);
		}

		$.jgrid.extend({
			gridState: function(gState) {
				if(gState === null){
					this.removeData('gridState');
					return this;
				}

				if (typeof(gState) === 'object') {
					this.data('gridState', gState);
					return this;
				}
				
				return this.data('gridState');
			}
		});
	}
})(jQuery);