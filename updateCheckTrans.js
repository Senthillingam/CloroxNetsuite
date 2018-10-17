function updateCheckTransaction(){

try{
	
var fx='MEI-NS Integration';
	
nlapiLogExecution('DEBUG','Before');

var jsonCheck = {
"tranid": "235434",
"custbody_rnl_customerinvoiceno":"INV 002",
"custbody_rnl_meipaymentno": "PAY 002",
"item": [
    {
		"internalid": "6588",
		"name": "Deduction",
		"custcol_rnl_meipromotionid": "PROMO003",
		"custcol_rnl_paymentdetailid": "00007C9",
		"custcol_rnl_promotionrebateid": "044"
    },
    {
		"internalid": "6563",
		"name": "109 Post Audit Non-Promo",
		"custcol_rnl_meipromotionid": "PROMO004",
		"custcol_rnl_paymentdetailid": "XX4578",
		"custcol_rnl_promotionrebateid": "0333"
    
    }
  ]
 };

 nlapiLogExecution('DEBUG','Tran Id  :: '+jsonCheck.tranid);
var checkRecord = nlapiLoadRecord('check',jsonCheck.tranid);
nlapiLogExecution('DEBUG','Tran Id  :: '+jsonCheck.custbody_rnl_customerinvoiceno);
nlapiLogExecution('DEBUG','Tran Id  :: '+jsonCheck.custbody_rnl_meipaymentno);
checkRecord.setFieldValue('custbody_rnl_customerinvoiceno', jsonCheck.custbody_rnl_customerinvoiceno);
checkRecord.setFieldValue('custbody_rnl_meipaymentno', jsonCheck.custbody_rnl_meipaymentno);



nlapiLogExecution('DEBUG','items Length  :: '+jsonCheck.item.length);

var count = checkRecord.getLineItemCount('item');
nlapiLogExecution('DEBUG','count from NS record  :: '+count);

for(iNS=1;iNS<=count;iNS++)
{
	 var nsItemId = checkRecord.getLineItemValue('item', 'item', iNS);
	 nlapiLogExecution('DEBUG','nsItemId  :: '+nsItemId);

	for(ctr = 0; ctr < jsonCheck.item.length ; ctr ++){
		var snapItemId = jsonCheck.item[ctr]['internalid'];
		nlapiLogExecution('DEBUG','snapItemId  :: '+snapItemId);
		if(snapItemId == nsItemId){
			nlapiLogExecution('DEBUG','custcol_rnl_meipromotionid  :: '+jsonCheck.item[ctr]['custcol_rnl_meipromotionid']);
			nlapiLogExecution('DEBUG','custcol_rnl_paymentdetailid  :: '+jsonCheck.item[ctr]['custcol_rnl_paymentdetailid']);
			nlapiLogExecution('DEBUG','custcol_rnl_promotionrebateid  :: '+jsonCheck.item[ctr]['custcol_rnl_promotionrebateid']);
			checkRecord.setCurrentLineItemValue('item', 'custcol_rnl_meipromotionid', jsonCheck.item[ctr]['custcol_rnl_meipromotionid']);
			checkRecord.setCurrentLineItemValue('item', 'custcol_rnl_paymentdetailid', jsonCheck.item[ctr]['custcol_rnl_paymentdetailid']);
			checkRecord.setCurrentLineItemValue('item', 'custcol_rnl_promotionrebateid', jsonCheck.item[ctr]['custcol_rnl_promotionrebateid']);
			
			//checkRecord.setFieldValue('custcol_rnl_meipromotionid', jsonCheck.item[ctr]['custcol_rnl_meipromotionid']);
			//checkRecord.setFieldValue('custcol_rnl_paymentdetailid', jsonCheck.item[ctr]['custcol_rnl_paymentdetailid']);
			//checkRecord.setFieldValue('custcol_rnl_promotionrebateid', jsonCheck.item[ctr]['custcol_rnl_promotionrebateid']);
			
			checkRecord.commitLineItem('item');
			nlapiLogExecution('DEBUG','After commit  :: ');
		}
	}
}

try{
	
	var internalId = nlapiSubmitRecord(checkRecord);
	nlapiLogExecution('DEBUG','id='+internalId);
	var nlobj = nlapiLoadRecord('check',internalId);
    return nlobj;
}
catch(e)
       {
             var err = '';
             if(e instanceof nlobjError){
                    err = 'System Error: '+ e.getCode()+','+e.getDetails();
             }
             else{
                    err = 'Unexpected error: '+e.toString();
             }
             nlapiLogExecution('ERROR', fx +' 999 Error', err);
			 return err;
       }
	

}
catch(e)
       {
             var err = '';
             if(e instanceof nlobjError){
                    err = 'System Error: '+ e.getCode()+','+e.getDetails();
             }
             else{
                    err = 'Unexpected error: '+e.toString();
             }
             nlapiLogExecution('ERROR', fx +' 999 Error', err);
       }
	
}