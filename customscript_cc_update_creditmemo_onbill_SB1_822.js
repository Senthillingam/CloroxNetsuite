/**
 * Module Description -- This script is used to get bill credit record information and update in credit memo custom field on bill record.
 * 
 * Version    Date            Author           Remarks
 * 1.00            
 *
 */

function afterRecordSubmit(type){	
	try
	{	
		nlapiLogExecution('Error','type:',type);
		if(type == 'xedit' || type == 'edit'){
			var credits = nlapiGetFieldValue('custrecord_2663_applied_credits');
			nlapiLogExecution('Error','credits:',credits);
			if(credits != null && credits !=''){
				credits = credits.substring(1,credits.length-1);
				var creditString = credits.split(",");
				nlapiLogExecution('Error','creditString:',creditString);
				for(var k=0;k<creditString.length;k++){
					var id = creditString[k].replace(/"/g , "");
					var record = nlapiLoadRecord('vendorcredit',id);
					var lineCount = record.getLineItemCount('apply');
					nlapiLogExecution('Error','lineCount',lineCount);
					for(var i=1; i<= lineCount; i++){
						var apply = record.getLineItemValue('apply','apply',i);
						nlapiLogExecution('Error','k--i--Apply',k+'-'+i+'-'+apply);
						if(apply == 'T'){
							var billInternalid = record.getLineItemValue('apply','internalid',i);
							nlapiLogExecution('Error','billInternalid:::-->',billInternalid);
							
							var amount = record.getLineItemValue('apply','amount',i);
							nlapiLogExecution('Error','amount:::-->',amount);
							
							var refNo = record.getFieldValue('tranid');
							var tranDate = record.getFieldValue('trandate');
							tranDate = conertDate(tranDate);
							var userTotal = record.getFieldValue('usertotal');
														
							var totString ='';
							var creditMemoString = "IN"+","+refNo+","+tranDate+","+userTotal+","+"CM";
							//var creditMemoString = "IN"+","+refNo+","+tranDate+","+amount+","+"CM";
							
							var credMemoFromBill = nlapiLookupField('vendorbill', billInternalid, 'custbody_rnl_credit_memo_details');
							nlapiLogExecution('Error','credMemoFromBill',credMemoFromBill);
							nlapiLogExecution('Error','creditMemoString',creditMemoString);
							if(credMemoFromBill != null && credMemoFromBill != ''){
								if(credMemoFromBill.indexOf(refNo) == -1) // added condition for not to add same bill info again when recreate/some other reasons
									totString = credMemoFromBill +";"+creditMemoString;
							}
							else{
								totString = creditMemoString;
							}
							if(totString != ''){
								var billId = nlapiSubmitField('vendorbill', billInternalid, 'custbody_rnl_credit_memo_details', totString);
								nlapiLogExecution('Error','billId updated successfully with credit memo info',billId);
							}
						}
					}
				}
			}
		}

	}
	catch(err){
		nlapiLogExecution('Error','Error at catch:',err);
	}
}

function conertDate(DateString){
	var date = new Date(DateString);
	year = date.getFullYear();
	month = date.getMonth()+1;
	dt = date.getDate();

	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
	return year+'-' + month + '-'+dt;
}