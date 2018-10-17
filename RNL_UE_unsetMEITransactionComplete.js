
/**
 * Copyright Cognizant Technology Solutions 2017.
 * 
 * This user event script will update the 'IS MEI 896 TRANSACTION COMPLETE' and 'IS MEI 261 TRANSACTION COMPLETE' to False if there are any updates or changes
 * in the Invoice/ Credit Memo/ Cash Sale / Cash Refunds Transactions.
 * Check box on Cash Sale, Cash Refunds, Invoice and Credit Memo Transactions is to identify the transaction complete for MEI 891/896/261 pipelines.
  * 
 * Version    Date            Author           Remarks
 * 1.00       14 August 2017   Senthil           Initial version.
 * 2.00       11 Sept 2017     Senthil             Initial version.
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
		var isMEI896TranComplete=nlapiGetFieldValue('custbody_is_mei_896_tran_complete');
		var isMEI261TranComplete=nlapiGetFieldValue('custbody_is_mei_261_tran_complete');
		nlapiLogExecution('DEBUG', 'isMEI896TranComplete-isMEI261TranComplete-recType-type-ExecContext', isMEI896TranComplete +'-'+ isMEI261TranComplete +'-'+recType +'-'+type+'-'+currentContext.getExecutionContext());

	if ( (type=='edit' || type =='create') && ((currentContext.getExecutionContext() == 'userinterface') || (currentContext.getExecutionContext() == 'scheduled')) 
		&& (recType=='creditmemo' || recType=='invoice' || recType=='cashrefund' || recType=='cashsale' ) && (isMEI896TranComplete=='T')){
				nlapiSetFieldValue('custbody_is_mei_896_tran_complete','F');
			}
	if ( (type=='edit' || type =='create') && ((currentContext.getExecutionContext() == 'userinterface') || (currentContext.getExecutionContext() == 'scheduled')) 
		&& (recType=='creditmemo' || recType=='invoice' || recType=='cashrefund' || recType=='cashsale' ) && (isMEI261TranComplete=='T')){
				nlapiSetFieldValue('custbody_is_mei_261_tran_complete','F');
			}

	}
	catch(err)
	{
		nlapiLogExecution('DEBUG', 'error', err.message);
	}
}
