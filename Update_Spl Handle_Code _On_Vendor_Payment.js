/**
 * Module Description -- This script is used to update special handle code on vendor payment from selected first bill record. 
 * And used to update check number field on vendor payment record from bank account NEXT CHECK NUMBER 
 * 
 * Version    Date            Author           Remarks
 * 1.00            
 *
 */

function afterRecordSubmit(type){	
	try
	{
		var recType = nlapiGetRecordType();
		var recId = nlapiGetRecordId();
		var lineCount = nlapiGetLineItemCount('apply');
		nlapiLogExecution('Debug','lineCount',lineCount);
		for(var i=1; i<= lineCount; i++){
			var apply = nlapiGetLineItemValue('apply','apply',i);
			var trantype = nlapiGetLineItemValue('apply','trantype',i);
			nlapiLogExecution('Error','i--Trantype--Apply',i+'-'+trantype+'-'+apply);
			if(apply == 'T' && trantype=='VendBill'){
				var billInternalid = nlapiGetLineItemValue('apply','internalid',i);
				nlapiLogExecution('Error','billInternalid',billInternalid);
				var splHandleCode = nlapiLookupField('vendorbill', billInternalid, 'custbody_cc_spl_handle_code');
				nlapiLogExecution('Error','splHandleCode',splHandleCode);
				//nlapiSetFieldValue('custbody_cc_spl_handle_code',splHandleCode);
				nlapiSubmitField(recType, recId, 'custbody_cc_spl_handle_code', splHandleCode);
				break;
			}
		}		
		nlapiLogExecution('Error','type',type);
		if(type == 'create'){
			var	prefAccNumber = '102002'; // Using this Number from account because we are only replacing check number this account. 
			var vndrPaymentAccount = nlapiGetFieldValue('account');
			nlapiLogExecution('Debug','vndrPaymentAccount',vndrPaymentAccount);		
			var vndrPaymentCheck = nlapiGetFieldValue('tranid');
			nlapiLogExecution('Debug','vndrPaymentCheck',vndrPaymentCheck);
			//var isValid = vndrPaymentCheck.indexOf('/');
			//nlapiLogExecution('Debug','isValid',isValid);
			//if(isValid != -1){
			var accRec = nlapiLoadRecord('account',vndrPaymentAccount);
			var nextCheckNumber = accRec.getFieldValue('curdocnum');
			var accNumber = accRec.getFieldValue('acctnumber');
			if(prefAccNumber == accNumber){
				nlapiLogExecution('Debug','nextCheckNumber',nextCheckNumber);
				var id = nlapiSubmitField(recType, recId, ['tranid','memo'], [nextCheckNumber,nextCheckNumber]);
				nlapiLogExecution('Audit','Nxt Check updated on vendor payment',id);
			}
		}
		//}
		
		if(type == 'edit' || type == 'create' || type == 'xedit'){// for updating the Bill Credit on the the Vendor Bill while creating the PFA
nlapiLogExecution('Debug','EVENT TYPE',type);
		var lineCountAP = nlapiGetLineItemCount('apply');
		nlapiLogExecution('Debug','lineCountAP',lineCountAP);
		for(var i=1; i<= lineCountAP; i++){
			nlapiLogExecution('Debug','START',i);
			var apply = nlapiGetLineItemValue('apply','apply',i);
			var trantype = nlapiGetLineItemValue('apply','trantype',i);
			var internalId = nlapiGetLineItemValue('apply','internalid',i);
			nlapiLogExecution('Error','i--Trantype--Apply--internalId',i+'-'+trantype+'-'+apply+'-'+internalId);
			if(apply == 'T' && trantype=='VendBill'){
				var billInternalid = nlapiGetLineItemValue('apply','internalid',i);
				nlapiLogExecution('Error','billInternalid',billInternalid);
				var billRecordResults = nlapiSearchRecord("vendorbill",null,[["internalid","is",billInternalid]],[new nlobjSearchColumn("internalid"),
										new nlobjSearchColumn("applyinglinkamount"),
										new nlobjSearchColumn("applyinglinktype"),
										new nlobjSearchColumn("applyingtransaction")]);
										
						var lineCount = billRecordResults.length;
						nlapiLogExecution('Debug','lineCount of billRecordResults',lineCount);
						
						for (var brr = 0; brr < lineCount; brr++)
						{
						var billRecord = billRecordResults[brr];
						
						var applyinglinkamount = billRecord.getValue("applyinglinkamount");
						var applyinglinktype = billRecord.getValue("applyinglinktype");
						var applyingtransactionValue = billRecord.getText("applyingtransaction");
						var applyingtransactionId = billRecord.getValue("applyingtransaction");
						
						nlapiLogExecution('Error','Credit Memo Details -->:',billInternalid+'-::-'+applyinglinkamount+'--'+applyinglinktype+'--'+applyingtransactionId+'--'+applyingtransactionValue);
											
						if(applyingtransactionValue !=null && applyingtransactionValue !='' && applyingtransactionValue.substring(0, 11)=='Bill Credit'){
						
						var vendorCreditRecord = nlapiLoadRecord('vendorcredit',applyingtransactionId);
						var refNum = '';
						var invoiceDate = '';
						if (vendorCreditRecord!=null && vendorCreditRecord!=''){
						refNum = vendorCreditRecord.getFieldValue('initialtranid');
						invoiceDate = vendorCreditRecord.getFieldValue('trandate');
						}
						if(invoiceDate!=null && invoiceDate!=''){
								invoiceDate = convertDate(invoiceDate);
							}
						if(applyinglinkamount>0){
								applyinglinkamount = '-'+applyinglinkamount;
							}
							var totString ='';
							var creditMemoString = "IN"+","+refNum+","+invoiceDate+","+(applyinglinkamount)+","+(applyinglinkamount)+","+"CM";
							var credMemoFromBill = nlapiLookupField('vendorbill', billInternalid, 'custbody_rnl_credit_memo_details');
							nlapiLogExecution('Debug','credMemoFromBill',credMemoFromBill);
							nlapiLogExecution('Error','creditMemoString',creditMemoString);
							if(credMemoFromBill != null && credMemoFromBill != ''){
								if(credMemoFromBill.indexOf(refNum) == -1) // added condition for not to add same bill info again when recreate/some other reasons
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
			nlapiLogExecution('Debug','END',i);
		}
		
			
			
		}
	}
	catch(err){
		nlapiLogExecution('Error','Error at catch:',err);
	}
}

function convertDate(DateString){
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