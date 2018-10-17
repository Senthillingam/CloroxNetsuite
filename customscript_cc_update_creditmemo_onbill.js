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
		nlapiLogExecution('Debug','type:',type);
		if(type == 'xedit' || type == 'edit'){
			var credits = nlapiGetFieldValue('custrecord_2663_applied_credits');		
			nlapiLogExecution('Debug','credits:',credits);
			if(credits != null && credits !='') {
				credits = credits.substring(1,credits.length-1);
				var creditString = credits.split(",");
			
			var vendorPayment = nlapiGetFieldValue('custrecord_2663_fm_trans_hash_string');
			nlapiLogExecution('Debug','vendorPayment:',vendorPayment);
			if(vendorPayment!=null && vendorPayment!='')
			{
			vendorPayment = vendorPayment.replace(/":/g,'":"').replace(/]]/g, ':]]"');
			nlapiLogExecution('Debug','vendorPayment:',vendorPayment);
			var vendorPaymentKeys = Object.keys(JSON.parse(vendorPayment));
			nlapiLogExecution('Debug','vendorPayment Keys:',vendorPaymentKeys);
			if(vendorPaymentKeys!=null && vendorPaymentKeys!=''){
				nlapiLogExecution('Debug','vendorPayment Keys:',vendorPaymentKeys.length);
				for(var vpk=0;vpk<vendorPaymentKeys.length;vpk++){
				var vendorPaymentid = vendorPaymentKeys[vpk];
				nlapiLogExecution('Debug','vendorPaymentid:',vendorPaymentid);
				
				var vendorPaymentRecord = nlapiLoadRecord('vendorpayment',vendorPaymentid);
				var alineCount = vendorPaymentRecord.getLineItemCount('apply');
				nlapiLogExecution('Debug','alineCount',alineCount);
					
					for(var i=1; i<= alineCount; i++){
						var billInternalid = vendorPaymentRecord.getLineItemValue('apply','internalid',i);
										
						for(var k=0;k<creditString.length;k++){
						var vendorCreditId = creditString[k].replace(/"/g , "");
						//var record = nlapiLoadRecord('vendorcredit',id);
						var vendorRecordResults = nlapiSearchRecord("vendorcredit",null,[["internalid","is",vendorCreditId]],[new nlobjSearchColumn("internalid"),
										new nlobjSearchColumn("amount"),new nlobjSearchColumn("appliedtolinkamount"),
										new nlobjSearchColumn("appliedtolinktype"),
										new nlobjSearchColumn("trandate"),
										new nlobjSearchColumn("tranid"),
										new nlobjSearchColumn("appliedtotransaction")]);
						var lineCount = vendorRecordResults.length;
						nlapiLogExecution('Debug','lineCount',lineCount);
						
						for (var vrr = 0; vrr < lineCount; vrr++)
						{
							var vendorRecord = vendorRecordResults[vrr];
						   var appliedtolinkamount = vendorRecord.getValue("appliedtolinkamount");
						   var appliedtotransaction = vendorRecord.getValue("appliedtotransaction");
						   var invoiceDate = vendorRecord.getValue("trandate");
						var vendorCreditRefNum = vendorRecord.getValue("tranid");
						nlapiLogExecution('Debug','appliedtotransaction -- billInternalid-->:',appliedtotransaction+'--'+billInternalid);
						if(billInternalid == appliedtotransaction){
						nlapiLogExecution('Error','Credit Memo Details -->:',appliedtolinkamount+'--'+appliedtotransaction+'--'+invoiceDate+'--'+vendorCreditRefNum);
						nlapiLogExecution('Debug','Credit Memo Details -->:',appliedtolinkamount+'--'+appliedtotransaction+'--'+invoiceDate+'--'+vendorCreditRefNum);
							if(invoiceDate!=null && invoiceDate!=''){
								invoiceDate = conertDate(invoiceDate);
							}
							
							var totString ='';
							var creditMemoString = "IN"+","+vendorCreditRefNum+","+invoiceDate+","+appliedtolinkamount+","+"CM";
							var credMemoFromBill = nlapiLookupField('vendorbill', billInternalid, 'custbody_rnl_credit_memo_details');
							nlapiLogExecution('Debug','credMemoFromBill',credMemoFromBill);
							nlapiLogExecution('Error','creditMemoString',creditMemoString);
							if(credMemoFromBill != null && credMemoFromBill != ''){
								if(credMemoFromBill.indexOf(vendorCreditRefNum) == -1) // added condition for not to add same bill info again when recreate/some other reasons
									totString = credMemoFromBill +";"+creditMemoString;
							}
							else{
								totString = creditMemoString;
							}
							if(totString != ''){
								var billId = nlapiSubmitField('vendorbill', billInternalid, 'custbody_rnl_credit_memo_details', totString);
								nlapiLogExecution('Debug','billId updated successfully with credit memo info',billId);
							}
						
													
												}
							
							
						}
				
						
					}
				
			}
			}
			}
			
			
		}
			
		}

	}
	}
	catch(err){
		nlapiLogExecution('Debug','Error at catch:',err);
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