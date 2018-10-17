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
	}
	catch(err){
		nlapiLogExecution('Error','Error at catch:',err);
	}
}