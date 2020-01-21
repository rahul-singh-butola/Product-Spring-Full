function getOrderItemUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/orderitem";
}
 function getOrderUrl(){
 	var baseUrl = $("meta[name=baseUrl]").attr("content")
 	return baseUrl + "/api/order";
 }

//BUTTON ACTIONS
function addOrderItem(event){
	//Set the values to update
	console.log(timestamp);
	var x=10;
	 $("#orderitem-form input[name=order_id]").val(timestamp);
	 console.log($("#orderitem-form input[name=order_id]").val());
	var $form = $("#orderitem-form");
	var json = toJson($form);
	var url = getOrderItemUrl();
		console.log(json);
	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getOrderItemList();
	   },
	   error: handleAjaxError
	});

	return false;
}


function submitform(event){
	//Set the values to update
	var url = getOrderItemUrl()+ "/j/" + timestamp;


    	$.ajax({
    	   url: url,
    	   type: 'GET',
    	   success: function(data) {

    	   	alert("invoice generated");

    	   },
    	   error: handleAjaxError
    	});


	timestamp=null;
	var $form = $("#orderitem-form");
	var json = toJson($form);
	var url = getOrderItemUrl();


	return false;
}



function updateOrderItem(event){
	$('#edit-orderitem-modal').modal('toggle');
	//Get the ID
//	var id = $("#orderitem-edit-form input[name=id]").val();
	 $("#orderitem-edit-form input[name=order_id]").val(timestamp);
	//console.log(id);
	var url = getOrderItemUrl() + "/m/";

	//Set the values to update
	var $form = $("#orderitem-edit-form");
	var json = toJson($form);
     console.log(json);
	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getOrderItemList();
	   },
	   error: handleAjaxError
	});

	return false;
}


function getOrderItemList(){
	var url = getOrderItemUrl()+ "/p/" + timestamp;


	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayOrderItemList(data);
	   },
	   error: handleAjaxError
	});
}






function deleteOrderItem(id){
	var url = getOrderItemUrl() + "/" + id;

	$.ajax({
	   url: url,
	   type: 'DELETE',
	   success: function(data) {
	   		getOrderItemList();
	   },
	   error: handleAjaxError
	});
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;


function processData(){
	var file = $('#orderitemFile4')[0].files[0];
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	//If everything processed then return
	if(processCount==fileData.length){
		return;
	}

	//Process next row
	var row = fileData[processCount];
	processCount++;

	var json = JSON.stringify(row);
	var url = getOrderItemUrl();

	//Make ajax call
	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		uploadRows();
	   },
	   error: function(response){
	   		row.error=response.responseText
	   		errorData.push(row);
	   		uploadRows();
	   }
	});

}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS

function displayOrderItemList(data){
	var $tbody = $('#orderitem-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
		var buttonHtml = '<button onclick="deleteOrderItem(' + e.orderitem_id + ')">delete</button>' ;
		buttonHtml += ' <button onclick="displayEditOrderItem(' + e.orderitem_id + ')">edit</button>';
		console.log(row);
		var row = '<tr>'
		+ '<td>' + e.orderitem_id+ '</td>'
		+ '<td>' + e.product_name + '</td>'
		+ '<td>'  + e.barcode + '</td>'
			+ '<td>'  + e.selling_price + '</td>'
				+ '<td>'  + e.quantity + '</td>'
			+ '<td>'  + e.total_price + '</td>'
		+ '<td>' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);
	}
}

function displayEditOrderItem(id){
	var url = getOrderItemUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayOrderItem(data);
	   },
	   error: handleAjaxError
	});
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#orderitemFile4');
	$file.val('');
	$('#orderitemFileName4').html("Choose File");
	//Reset various counts
	processCount = 0;
	fileData = [];
	errorData = [];
	//Update counts
	updateUploadDialog();
}

function updateUploadDialog(){
	$('#rowCount4').html("" + fileData.length);
	$('#processCount4').html("" + processCount);
	$('#errorCount4').html("" + errorData.length);
}

function updateFileName(){
	var $file = $('#orderitemFile4');
	var fileName = $file.val();
	$('#orderitemFileName4').html(fileName);
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-orderitem-modal').modal('toggle');
}

function displayOrderItem(data){
	$("#orderitem-edit-form input[name=barcode]").val(data.barcode);
	$("#orderitem-edit-form input[name=quantity]").val(data.quantity);

	$('#edit-orderitem-modal').modal('toggle');
}


//INITIALIZATION CODE
function init(){
	$('#add-orderitem').click(addOrderItem);
	$('#update-orderitem').click(updateOrderItem);
	$('#refresh-data4').click(getOrderItemList);
	$('#upload-data4').click(displayUploadData);
	$('#process-data4').click(processData);
	$('#download-errors4').click(downloadErrors);
	$('#submit-data').click(submitform);
    $('#orderitemFile4').on('change', updateFileName)
}


  var date;
  var timestamp;
    console.log(timestamp);
    //  console.log(date);

     var tot_price=0;


   if(timestamp==null)
   {

  var d = new Date();
  timestamp = d.getTime();

  // var x=LocalDate.parse(d.toISOString, DateTimeFormatter.ISO_LOCAL_DATE)   ;

 date =new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()     ;


   var json= { "date": date, "order_id": timestamp };
   json=JSON.stringify(json);
   console.log(json);

var url =getOrderUrl();;
	console.log(json);
	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		//getOrderItemList();
	   },
	   error: handleAjaxError
	});



   }

  
$(document).ready(init);
$(document).ready(getOrderItemList);


