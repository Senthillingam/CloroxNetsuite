/**
 * Copyright Cognizant Technology Solutions 2017.
 * 
 * This script serves as the endpoint through which external systems post its data.
 * It supports get trasactional data with  the Suite Promotion data.
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 June 2017     Senthil             Initial version.
 * 
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */


function transactionWithPromotion(snapjson){
try{
	
	var jsonobj =snapjson;
	var internalId='';
	var tranType ='';
	nlapiLogExecution('DEBUG','eventType :: '+jsonobj.eventType);
	
	//if(jsonobj.eventType=='getTransaction'){
		nlapiLogExecution('DEBUG','eventType in getTransation:: '+jsonobj.eventType);
		nlapiLogExecution('DEBUG','Tran Type in getTransation:: '+jsonobj.tranType);
		nlapiLogExecution('DEBUG','Internal Id in getTransation:: '+jsonobj.tranId);
		tranType = jsonobj.tranType;
		internalId = jsonobj.tranId;
		
	//}
	
	nlapiLogExecution('DEBUG','id='+internalId);
	nlapiLogExecution('DEBUG','tranType='+tranType);
	var nlobj = nlapiLoadRecord(tranType,internalId);
    return nlobj;
	 
	 
}catch(e)
       {
             var err = '';
             if(e instanceof nlobjError){
                    err = 'System Error: '+ e.getCode()+','+e.getDetails();
             }
             else{
                    err = 'Unexpected error: '+e.toString();
             }
             nlapiLogExecution('ERROR', 'Error', err);
			 return err;
       }
		
	
}
