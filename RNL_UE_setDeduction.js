/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Jun 2017     452020
 * 1.2		  24 Jun 2017     Senthil 			1) Added the logic to work only for Custom- Deduction Transactions,
 *												2) To update the Deduction status back to Open if it is un applied
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
			 nlapiLogExecution('DEBUG','in-------->','subsidiary::'+subsidiary);
			 nlapiLogExecution('DEBUG','in-------->','nlapiGetSubsidiary()::'+nlapiGetSubsidiary());
			for(var m=0; m<subsidiary.length;m++)
			{
				if(nlapiGetSubsidiary()==subsidiary[m])
				{
					subflag = 1;
					break;
				}
			}
	        nlapiLogExecution('DEBUG','in-------->','SubFlag::'+subflag);
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
				
				//Added by Senthil tranType- To have the below logic only to work only for Custom- Deduction Transactions,
				//applied - to update the status back to Open if it is un applied
				//Start
				var tranType = nlapiGetLineItemValue('apply', 'trantype', i);
				var applied = nlapiGetLineItemValue('apply', 'apply', i);
				nlapiLogExecution('DEBUG','afterSubmit','tranType == '+tranType);
				nlapiLogExecution('DEBUG','afterSubmit','applied == '+applied);
					
				if(tranType!=null && tranType=='Custom'){
				//End
				
					var refnum= nlapiGetLineItemValue('apply', 'refnum', i);
					nlapiLogExecution('DEBUG','afterSubmit','refnum == '+refnum);
					
					var payingamount= nlapiGetLineItemValue('apply', 'amount', i);
					nlapiLogExecution('DEBUG','afterSubmit','payingamount == '+payingamount);
					
					var amountdue= nlapiGetLineItemValue('apply', 'due', i);
						nlapiLogExecution('DEBUG','afterSubmit','amountdue == '+amountdue);
						
						var internalid = nlapiGetLineItemValue('apply', 'internalid', i);
						nlapiLogExecution('DEBUG','afterSubmit','internalid == '+internalid);
					
					
					// Added by Senthil - To set the Deduction Status 'Open' if the amount due is not equal to 0
					//Start
					if(amountdue!=0 && applied=='F' && payingamount==null){
					nlapiLogExecution('DEBUG','afterSubmit','Set the Deduction Status Open');	
					nlapiLogExecution('DEBUG','afterSubmit','refnum for Unapplied== '+refnum);
					nlapiSubmitField('customtransaction_rnl_deduction',internalid, 'transtatus', 'A');
					}
					//End
					
					if(payingamount!=null)
					{
						
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
			
		}
		catch(err)
		{
			nlapiLogExecution('DEBUG','afterSubmit','Error Catched == '+err);
		}
	
}
