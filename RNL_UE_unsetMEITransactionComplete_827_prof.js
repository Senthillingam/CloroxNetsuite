/**
 * Copyright Cognizant Technology Solutions 2017.
 * 
 * This user event script will update the 'IS MEI TRANSACTION COMPLETE' to False if there are any updates or changes
 * in the Invoice/ Credit Memo Transactions.
 * Check box on Invoice and Credit Memo Transactions is to identify the transaction complete for MEI 891/896 pipelines.
  * 
 * Version    Date            Author           Remarks
 * 1.00       14 August 2017     Senthil             Initial version.
 * 
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */

function userEventBeforeSubmit(type)
{
	try
	{
		var recType = nlapiGetRecordType();
		var currentContext = nlapiGetContext();
		var isMEITranComplete=nlapiGetFieldValue('custbody_is_mei_tran_complete');
		nlapiLogExecution('DEBUG', 'isMeiTranComplete-recType-type-ExecContext', isMEITranComplete +'-'+recType +'-'+type+'-'+currentContext.getExecutionContext());

	if ( (type=='edit' || type =='create') && (currentContext.getExecutionContext() == 'userinterface') 
				&& (recType=='creditmemo' || recType=='invoice' ) && (isMEITranComplete=='T')){
				nlapiSetFieldValue('custbody_is_mei_tran_complete','F');
			}
	}
	catch(err)
	{
		nlapiLogExecution('DEBUG', 'error', err.message);
	}
}
