jQuery.extend(jQuery.jgrid.defaults, { 
    width: 880,
    height: "auto",
    cellEdit: false,
    sortable: true,
    loadonce:true,
    viewrecords: true,
    sortorder: "desc",
    shrinkToFit: true,
    recordtext: "Element {0} - {1} of {2}",
    rowList:[10,20,50,100,200,500],
    onPaging: function() { sendGridState() }
    
});
