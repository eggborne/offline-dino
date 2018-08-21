function ColumnGenerator() {
	this.insertLayout = function(id,layoutArray,destination,bordered,labeled) {
		var parent
		destination ? parent = destination : parent = "#stage"
		var border = '';
		var columnLabel = '';
		bordered ? border = ';border: 1px solid black' : false
		var rows = layoutArray.length
		console.log("making " + rows + " rows")
		$(parent).append('<div id='+id+'></div>')
		$(parent).prepend('<h3>grid id: #'+id+'</h3>')
		for (var r=0;r<rows;r++) {
			var columns = layoutArray[r][0].length
			// set the row's height if specified
			var rowHeight = (layoutArray[r][1] || 'auto')
			// make the row divs
			$('#'+id).append(`<div id="row-`+r+`" class="row generated"></div>`)
			// grab the row div you just made
			var newRow = $('#row-'+r)
			// put the columns in
			for (var c=0;c<columns;c++) {
				if (labeled) {
					columnLabel = `#column-`+r+`-`+c+`<p>height:`+rowHeight
				}
				var columnWidth = layoutArray[r][0][c]
				newRow.append(`<div id="column-`+r+`-`+c+`" class="col-xs-`+columnWidth+` generated" style="height:`+rowHeight+border+`">`+columnLabel+`</div>`)
			}
		}
	}
}
// var exampleLayout =
// [
//   [[4,4,4],'220px'],
//   [[4,3,2,3],'60px'],
//   [[4,4,4],'100px'],
//   [[1,2,1,3,5],'200px'],
// 	[[3,4,5],"300px"]
// ]
