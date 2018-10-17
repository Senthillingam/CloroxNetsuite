function upsertPromotion(snapjson){
try{
	
	var jsonobj =snapjson;
	var internalId='';
	nlapiLogExecution('DEBUG','eventType :: '+jsonobj.eventType);
	if(jsonobj.eventType=='insert'){
		internalId = createPromotion(jsonobj);
	}else if(jsonobj.eventType=='update'){
		internalId = updatePromotion(jsonobj);
	}
	nlapiLogExecution('DEBUG','id='+internalId);
	var nlobj = nlapiLoadRecord('promotioncode',internalId);
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
function updatePromotion(jsonobj){

var fx='MEI-NS Integration';
try{
	nlapiLogExecution('DEBUG','eventType in updatePromotion:: '+jsonobj.eventType);
	
	var promoInternalId = jsonobj.id;
	if(promoInternalId!=''){
		nlapiLogExecution('DEBUG','Promotion Internal Id  :: '+promoInternalId);
		var promoRecord = nlapiLoadRecord('promotioncode',promoInternalId);
	//nlapiLogExecution('DEBUG','rate  :: '+jsonobj.rate);
	//nlapiLogExecution('DEBUG','Start Date :: '+jsonobj.startdate);
	//nlapiLogExecution('DEBUG','End Date:: '+jsonobj.enddate);
	//nlapiLogExecution('DEBUG','isinactive:: '+jsonobj.isinactive);
		//promoRecord.setFieldValue('rate', jsonobj.rate);
		//promoRecord.setFieldValue('startdate', jsonobj.startdate);
		//promoRecord.setFieldValue('enddate', jsonobj.enddate);
		promoRecord.setFieldValue('isinactive', jsonobj.isinactive=='true'?'T':'F');
	/*	
		nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

for(items = 0; items < jsonobj.discounteditems.length ; items ++){
	nlapiLogExecution('DEBUG','Items in for  :: '+jsonobj.discounteditems[items]['internalid']);
	promoRecord.selectNewLineItem('items');
	promoRecord.setCurrentLineItemValue('items', 'item', jsonobj.discounteditems[items]['internalid']);
	promoRecord.commitLineItem('items');
}

for(dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
	nlapiLogExecution('DEBUG','discounteditems in for  :: '+jsonobj.discounteditems[dItems]['internalid']);
	promoRecord.selectNewLineItem('discounteditems');
	promoRecord.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
	promoRecord.commitLineItem('discounteditems');
}
*/
try{
	var internalId = nlapiSubmitRecord(promoRecord); 
	return internalId;
}catch(e)
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

	}else{
		var err = '';
		err = 'Promotion Internal Id not available: '+promoInternalId;
		return err;
	}
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
function createPromotion(jsonobj){
	var fx='MEI-NS Integration';

try{
	
nlapiLogExecution('DEBUG','eventType in createPromotion:: '+jsonobj.eventType);
	
nlapiLogExecution('DEBUG','jsonobj  :: '+jsonobj);
nlapiLogExecution('DEBUG','customform  :: '+jsonobj.customform);
nlapiLogExecution('DEBUG','name  :: '+jsonobj.name);
nlapiLogExecution('DEBUG','discount  :: '+jsonobj.discount);
nlapiLogExecution('DEBUG','code  :: '+jsonobj.code);
nlapiLogExecution('DEBUG','custrecord_advpromo_subsidiary  :: '+jsonobj.custrecord_advpromo_subsidiary);
nlapiLogExecution('DEBUG','rate  :: '+jsonobj.rate);
nlapiLogExecution('DEBUG','Start Date :: '+jsonobj.startdate);
nlapiLogExecution('DEBUG','End Date:: '+jsonobj.enddate);
nlapiLogExecution('DEBUG','specificitemscheck:: '+jsonobj.specificitemscheck);
nlapiLogExecution('DEBUG','canbeautoapplied:: '+jsonobj.canbeautoapplied);


var promo = nlapiCreateRecord('promotioncode', { customform : jsonobj.customform});
promo.setFieldValue('name', jsonobj.name);
promo.setFieldValue('discount',jsonobj.discount);
promo.setFieldValue('code',jsonobj.code);
promo.setFieldValue('custrecord_advpromo_subsidiary',jsonobj.custrecord_advpromo_subsidiary);
promo.setFieldValue('rate',jsonobj.rate);
promo.setFieldValue('startdate',jsonobj.startdate);
promo.setFieldValue('enddate',jsonobj.enddate);
promo.setFieldValue('specificitemscheck',jsonobj.specificitemscheck=='true'?'T':'F');
promo.setFieldValue('canbeautoapplied',jsonobj.canbeautoapplied=='true'?'T':'F');
promo.setFieldValue('discounteveryxunitenabled','T');
promo.setFieldValue('discounteveryxunitxth','2');
promo.setFieldValue('discounteveryxunittype','1');

nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

for(items = 0; items < jsonobj.discounteditems.length ; items ++){
	nlapiLogExecution('DEBUG','Items in for  :: '+jsonobj.discounteditems[items]['internalid']);
	promo.selectNewLineItem('items');
	promo.setCurrentLineItemValue('items', 'item', jsonobj.discounteditems[items]['internalid']);
	promo.commitLineItem('items');
}

for(dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
	nlapiLogExecution('DEBUG','discounteditems in for  :: '+jsonobj.discounteditems[dItems]['internalid']);
	promo.selectNewLineItem('discounteditems');
	promo.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
	promo.commitLineItem('discounteditems');
}

var customerCategoryValues = [];
nlapiLogExecution('DEBUG','customercategory.length  :: '+jsonobj.customercategory.length);
promo.setFieldValue('audience','SPECIFICCUSTOMERS');
for(cc = 0; cc < jsonobj.customercategory.length ; cc ++){
	nlapiLogExecution('DEBUG','cc in for  :: '+jsonobj.customercategory[cc]['internalid']);
	customerCategoryValues.push(jsonobj.customercategory[cc]['internalid']);
}
promo.setFieldValues('customercategory',customerCategoryValues);

try{
	var internalId = nlapiSubmitRecord(promo); 
	return internalId;
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


/*
{
"eventType" :"insert",
"customform": "-10501",
"name": "06011718-SP",
"discount": "6807",
"code":"06011718-SP",
"custrecord_advpromo_subsidiary":"2",
"rate":"7",
"startdate":"5/22/2018",
"enddate":"6/24/2018",
"specificitemscheck":"true",
"canbeautoapplied":"true",
"customercategory": [
    {
      "internalid": "63",
      "name": "Business"
    },
    {
      "internalid": "62",
      "name": "Chiropractor"
    },
    {
      "internalid": "293",
      "name": "MCKESSON"
    }
  ],
"discounteditems": [
     {
        "internalid": "6074",
        "name": "RL-15364"
    },
	{
        "internalid": "4662",
        "name": "RL-15364S"
    }
    
  ]
}
{
"eventType" :"update",
"id":"6015",
"rate":"5",
"startdate":"5/11/2018",
"enddate":"5/12/2018",
"isinactive":"true",
"discounteditems": [
    {
        "internalid": "3970",
        "name": "15394S"
    },
	{
        "internalid": "3974",
        "name": "15395S"
    }
  ]
}


*/