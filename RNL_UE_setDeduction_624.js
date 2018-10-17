/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Jun 2017     452020
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function afterSubmitRecord (type){
	
		try 
		{
			var subs = nlapiGetContext().getSetting('SCRIPT','custscript_rnl_ue_set_deduction');
	        
			var subflag = 0;
			var subsidiary =new Array();
			if (subs.indexOf(',') > -1)
			{
				subsidiary = subs.split(',');
			}
	          
			else
			{
				subsidiary = subs.split("|");	
			}
			
			for(var m=0; m<subsidiary.length;m++)
			{
				if(nlapiGetSubsidiary()==subsidiary[m])
				{
					subflag = 1;
					break;
				}
			}
	         
			if(subflag==0)
			{
	          return
	        } 
			
				/*var deduction_value = nlapiGetFieldValue('custbody_rnl_deductionrecord');
				nlapiLogExecution('DEBUG','afterSubmit','Deduction Value fetched == '+deduction_value);*/
			
				var count= nlapiGetLineItemCount('apply');
				nlapiLogExecution('DEBUG','afterSubmit','count == '+count);
			
				for(var i=1;i<=count;i++)
				{
					var refnum= nlapiGetLineItemValue('apply', 'refnum', i);
					nlapiLogExecution('DEBUG','afterSubmit','refnum == '+refnum);
					
					var payingamount= nlapiGetLineItemValue('apply', 'amount', i);
					nlapiLogExecution('DEBUG','afterSubmit','payingamount == '+payingamount);
					
					if(payingamount!=null)
					{
						var amountdue= nlapiGetLineItemValue('apply', 'due', i);
						nlapiLogExecution('DEBUG','afterSubmit','amountdue == '+amountdue);
						
						var internalid = nlapiGetLineItemValue('apply', 'internalid', i);
						nlapiLogExecution('DEBUG','afterSubmit','internalid == '+internalid);
						
						
						var balance = amountdue - payingamount;
						nlapiLogExecution('DEBUG','afterSubmit','balance == '+balance);
						
						if(balance==0)
							{
								nlapiLogExecution('DEBUG','afterSubmit','balance == 0');	
								nlapiSubmitField('customtransaction_rnl_deduction',internalid, 'transtatus', 'B');
								
							}
						else
							{
								nlapiLogExecution('DEBUG','afterSubmit','balance == !0');	
								nlapiSubmitField('customtransaction_rnl_deduction',internalid, 'transtatus', 'A');
							
							}
					}
					
				}
			
		}
		catch(err)
		{
			nlapiLogExecution('DEBUG','afterSubmit','Error Catched == '+err);
		}
	
}
