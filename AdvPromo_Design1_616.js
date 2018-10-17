/**
 * Copyright Cognizant Technology Solutions 2017.
 * 
 * This script serves as the endpoint through which external systems post its data.
 * It supports create and update of Suite Promotions
 * Also supports get trasactional data and Suite Promotion data.
 * It accepts the array in a json format.
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 June 2017     Senthil             Initial version.
 * 
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */

function utilPromotion(snapjson){
		
try{

if(snapjson!=''){


nlapiLogExecution('DEBUG','snapjson String:: '+JSON.stringify(snapjson));
var returnArrJsonObj = [];
var meiSnapJson = snapjson;
  var tempArrmeiSnapJson= meiSnapJson.promoList;
nlapiLogExecution('DEBUG','meiPromoList Length:: '+tempArrmeiSnapJson.length);
for(var arrJson = 0;arrJson<tempArrmeiSnapJson.length;arrJson++){
	nlapiLogExecution('DEBUG','arrJson:: '+arrJson);
	var jsonobj =tempArrmeiSnapJson[arrJson];
	var internalId='';
	var tranType ='';
	if(jsonobj.eventType=='insert'){
		internalId = createPromotion(jsonobj);
		tranType = 'promotioncode';
	}else if(jsonobj.eventType=='update'){
		internalId = updatePromotion(jsonobj);
		tranType = 'promotioncode';
	}
	else if(jsonobj.eventType=='getTransaction'){
		nlapiLogExecution('DEBUG','eventType in getTransation:: '+jsonobj.eventType);
		nlapiLogExecution('DEBUG','Tran Type in getTransation:: '+jsonobj.tranType);
		nlapiLogExecution('DEBUG','Internal Id in getTransation:: '+jsonobj.tranId);
		tranType = jsonobj.tranType;
		internalId = jsonobj.tranId;
		
	}
	
	else if(jsonobj.eventType=='getPromotion'){
		nlapiLogExecution('DEBUG','eventType in getPromotion:: '+jsonobj.eventType);
		nlapiLogExecution('DEBUG','Tran Type in getPromotion:: '+jsonobj.tranType);
		nlapiLogExecution('DEBUG','Internal Id in getPromotion:: '+jsonobj.tranId);
		tranType = jsonobj.tranType;
		internalId = jsonobj.tranId;
	}
	nlapiLogExecution('DEBUG','id='+internalId);
	nlapiLogExecution('DEBUG','tranType='+tranType);
	var nlobj = nlapiLoadRecord(tranType,internalId);
    returnArrJsonObj.push(nlobj);
}	 
	
return returnArrJsonObj;	
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


/**
 * 
 * @param jsonobj
 * @return internalId
 */

function updatePromotion(jsonobj){

var fx='MEI-NS Integration';
try{
	nlapiLogExecution('DEBUG','eventType in updatePromotion:: '+jsonobj.eventType);
	
	var promoInternalId = jsonobj.id;
	if(promoInternalId!=''){
		nlapiLogExecution('DEBUG','In Update Promotion Internal Id  :: '+promoInternalId);
		nlapiLogExecution('DEBUG','In Update Promotion Internal Id  :: '+jsonobj.discount);
		nlapiLogExecution('DEBUG','In Update discounttype  :: '+jsonobj.discounttype);
		nlapiLogExecution('DEBUG','In Update rate  :: '+jsonobj.rate);
		nlapiLogExecution('DEBUG','In Update Start Date :: '+jsonobj.startdate);
		nlapiLogExecution('DEBUG','In Update End Date:: '+jsonobj.enddate);
		nlapiLogExecution('DEBUG','In Update isinactive:: '+jsonobj.isinactive);
		
		var promoRecord = nlapiLoadRecord('promotioncode',promoInternalId);
		var lineCount = promoRecord.getLineItemCount('items');
		
		nlapiLogExecution('DEBUG','lineCount  for Removing Length  :: '+lineCount);
		
			for (var i = lineCount;i>=1; i--) {
				var currentItem = promoRecord.getLineItemValue('items','item',i);
				nlapiLogExecution('DEBUG','currentItem  :: '+currentItem);
				promoRecord.removeLineItem('items',i);
				//nlapiLogExecution('DEBUG','Removing--  :: '+i);
			}
		var dlineCount = promoRecord.getLineItemCount('discounteditems');
		nlapiLogExecution('DEBUG','lineCount  for Removing Length  :: '+dlineCount);
		for (var i = dlineCount;i>=1; i--) {
				var currentdItem = promoRecord.getLineItemValue('discounteditems','discounteditem',i);
				//nlapiLogExecution('DEBUG','currentdItem  :: '+currentdItem);
				promoRecord.removeLineItem('discounteditems',i);
				//nlapiLogExecution('DEBUG','Removing--  :: '+i);
			}
	
		if(jsonobj.discount!=''){
			promoRecord.setFieldValue('discount', jsonobj.discount);
		}
		if(jsonobj.description!=''){
			promoRecord.setFieldValue('description',jsonobj.description);
		}
		if(jsonobj.isinactive!=''){
			promoRecord.setFieldValue('isinactive', jsonobj.isinactive=='true'?'T':'F');
		}
		if(jsonobj.discounttype!=''){
			promoRecord.setFieldValue('discounttype',jsonobj.discounttype);
			nlapiLogExecution('DEBUG','In discounttype  :: '+jsonobj.discounttype);
		}
		if(jsonobj.rate!=''){
			nlapiLogExecution('DEBUG','In if 1 ratte  :: '+jsonobj.rate);
			if(jsonobj.rate==0){
				
				promoRecord.setFieldValue('discounteveryxunitenabled','F');
				promoRecord.setFieldValue('rate', jsonobj.rate);
				nlapiLogExecution('DEBUG','In if ratte  :: '+jsonobj.rate);
			}else{
				promoRecord.setFieldValue('rate', jsonobj.rate);
				nlapiLogExecution('DEBUG','In else ratte  :: '+jsonobj.rate);
			}
		}
		if(jsonobj.startdate!=''){
			promoRecord.setFieldValue('startdate', jsonobj.startdate);
		}
		if(jsonobj.enddate!=''){
			promoRecord.setFieldValue('enddate', jsonobj.enddate);
		}
		

		
	
if(jsonobj.discounteditems!='' && jsonobj.discounteditems.length > 0) {
			nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

			for(var items = 0; items < jsonobj.discounteditems.length ; items ++){
				//nlapiLogExecution('DEBUG','Items in for  :: '+jsonobj.discounteditems[items]['internalid']);
				promoRecord.selectNewLineItem('items');
				promoRecord.setCurrentLineItemValue('items', 'item', jsonobj.discounteditems[items]['internalid']);
				promoRecord.commitLineItem('items');
			}

			for(var dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
				//nlapiLogExecution('DEBUG','discounteditems in for  :: '+jsonobj.discounteditems[dItems]['internalid']);
				promoRecord.selectNewLineItem('discounteditems');
				promoRecord.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
				promoRecord.commitLineItem('discounteditems');
			}
				
}

if(jsonobj.customercategory!='' && jsonobj.customercategory.length > 0) {
var customerCategoryValues = [];
nlapiLogExecution('DEBUG','customercategory.length  :: '+jsonobj.customercategory.length);
promoRecord.setFieldValue('audience','SPECIFICCUSTOMERS');
for(var cc = 0; cc < jsonobj.customercategory.length ; cc ++){
	nlapiLogExecution('DEBUG','cc in for  :: '+jsonobj.customercategory[cc]['internalid']);
	var custCategory = jsonobj.customercategory[cc]['internalid'];
	customerCategoryValues.push(custCategory);
}
promoRecord.setFieldValues('customercategory',customerCategoryValues);
}

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


/**
 * 
 * @param jsonobj
 * @return internalId
 */

 
function createPromotion(jsonobj){
	var fx='MEI-NS Integration';

try{
	
nlapiLogExecution('DEBUG','eventType in createPromotion:: '+jsonobj.eventType);
	
nlapiLogExecution('DEBUG','jsonobj  :: '+jsonobj);
nlapiLogExecution('DEBUG','customform  :: '+jsonobj.customform);
nlapiLogExecution('DEBUG','name  :: '+jsonobj.name);
nlapiLogExecution('DEBUG','description  :: '+jsonobj.description);
nlapiLogExecution('DEBUG','discount  :: '+jsonobj.discount);
nlapiLogExecution('DEBUG','code  :: '+jsonobj.code);
nlapiLogExecution('DEBUG','custrecord_advpromo_subsidiary  :: '+jsonobj.custrecord_advpromo_subsidiary);
nlapiLogExecution('DEBUG','discounttype  :: '+jsonobj.discounttype);
nlapiLogExecution('DEBUG','rate  :: '+jsonobj.rate);
nlapiLogExecution('DEBUG','Start Date :: '+jsonobj.startdate);
nlapiLogExecution('DEBUG','End Date:: '+jsonobj.enddate);
nlapiLogExecution('DEBUG','specificitemscheck:: '+jsonobj.specificitemscheck);
nlapiLogExecution('DEBUG','canbeautoapplied:: '+jsonobj.canbeautoapplied);


var promo = nlapiCreateRecord('promotioncode', { customform : jsonobj.customform});
promo.setFieldValue('name', jsonobj.name);
promo.setFieldValue('discount',jsonobj.discount);
promo.setFieldValue('code',jsonobj.code);
promo.setFieldValue('description',jsonobj.description);
promo.setFieldValue('custrecord_advpromo_subsidiary',jsonobj.custrecord_advpromo_subsidiary);
promo.setFieldValue('discounttype',jsonobj.discounttype);
promo.setFieldValue('rate',jsonobj.rate);
promo.setFieldValue('startdate',jsonobj.startdate);
promo.setFieldValue('enddate',jsonobj.enddate);
promo.setFieldValue('specificitemscheck',jsonobj.specificitemscheck=='true'?'T':'F');
promo.setFieldValue('canbeautoapplied',jsonobj.canbeautoapplied=='true'?'T':'F');
//promo.setFieldValue('discounteveryxunitenabled','T');
//promo.setFieldValue('discounteveryxunitxth','1');
promo.setFieldValue('discounteveryxunittype','1');
promo.setFieldValue('custrecord_is_mei_promotion','T');


nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

for(var items = 0; items < jsonobj.discounteditems.length ; items ++){
	//nlapiLogExecution('DEBUG','Items in for  :: '+jsonobj.discounteditems[items]['internalid']);
	promo.selectNewLineItem('items');
	promo.setCurrentLineItemValue('items', 'item', jsonobj.discounteditems[items]['internalid']);
	promo.commitLineItem('items');
}

for(var dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
	//nlapiLogExecution('DEBUG','discounteditems in for  :: '+jsonobj.discounteditems[dItems]['internalid']);
	promo.selectNewLineItem('discounteditems');
	promo.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
	promo.commitLineItem('discounteditems');
}

var customerCategoryValues = [];
if(jsonobj.customercategory!='' && jsonobj.customercategory.length>0){
	nlapiLogExecution('DEBUG','customercategory.length  :: '+jsonobj.customercategory.length);
	promo.setFieldValue('audience','SPECIFICCUSTOMERS');
	for(var cc = 0; cc < jsonobj.customercategory.length ; cc ++){
		nlapiLogExecution('DEBUG','cc in for  :: '+jsonobj.customercategory[cc]['internalid']);
		var custCategory = jsonobj.customercategory[cc]['internalid'];
		customerCategoryValues.push(custCategory);
	}
	promo.setFieldValues('customercategory',customerCategoryValues);
}

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


/**
 * 
 * Sample json structure
 */
/*

{"promoList":[

{
"eventType" :"insert",
"customform": "-10501",
"name": "06081701-SP",
"description":"06081701-SP",
"discount": "6807",
"code":"06081701-SP",
"custrecord_advpromo_subsidiary":"2",
"discounttype":"flat",
"rate":"10",
"startdate":"01/01/2016",
"enddate":"01/25/2016",
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
},

{
"eventType" :"update",
"id":"8668",
"discount":"6835",
"description":"est doe udpate",
"discounttype":"",
"rate":"53",
"startdate":"5/11/2016",
"enddate":"5/12/2016",
"isinactive":"false",
"customercategory": [
   
    {
      "internalid": "49",
      "name": "Associate"
    },
    {
      "internalid": "66",
      "name": "Bar Tender"
    }
    	
   
  ],
"discounteditems": [
    
	{
        "internalid": "5780",
        "name": "RL-65535"
    }
    
  ]
},
{
"eventType" :"getTransaction",
"tranType" :"invoice",
"tranId":"331545"
},

{
	"eventType" :"getPromotion",
"tranType" :"promotioncode",
"tranId":"2938"
}


]}

*/