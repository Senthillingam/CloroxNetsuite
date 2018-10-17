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
 * 1.1        16 June 2017     Senthil             Design change: Populating the Items and CHL3 in custom fields in Suite Promotion.
 * 1.2        21 June 2017     Senthil             Incorparated with the Interim Design: For GoLIbe on Aug 1st, CLX needs to have * 												Customer Catergory along with the CHL3
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
		nlapiLogExecution('DEBUG','Up:Promotion Internal Id  :: '+promoInternalId);
		nlapiLogExecution('DEBUG','Up:Discount Item Internal Id  :: '+jsonobj.discount);
		nlapiLogExecution('DEBUG','Up:discounttype  :: '+jsonobj.discounttype);
		nlapiLogExecution('DEBUG','Up:rate  :: '+jsonobj.rate);
		nlapiLogExecution('DEBUG','Up:Start Date :: '+jsonobj.startdate);
		nlapiLogExecution('DEBUG','Up:End Date:: '+jsonobj.enddate);
		nlapiLogExecution('DEBUG','Up:isinactive:: '+jsonobj.isinactive);
		
		var promoRecord = nlapiLoadRecord('promotioncode',promoInternalId);
	
		var dlineCount = promoRecord.getLineItemCount('discounteditems');
		nlapiLogExecution('DEBUG','Up:lineCount Length for Removing Items  :: '+dlineCount);
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
			nlapiLogExecution('DEBUG','Up:In discounttype  :: '+jsonobj.discounttype);
		}
		if(jsonobj.rate!=''){
			nlapiLogExecution('DEBUG','Up:Before If Rate:: '+jsonobj.rate);
			if(jsonobj.rate==0){
				
				promoRecord.setFieldValue('discounteveryxunitenabled','F');
				promoRecord.setFieldValue('rate', jsonobj.rate);
				nlapiLogExecution('DEBUG','Up:In if ratte  :: '+jsonobj.rate);
			}else{
				promoRecord.setFieldValue('rate', jsonobj.rate);
				nlapiLogExecution('DEBUG','Up:In else ratte  :: '+jsonobj.rate);
			}
		}
		if(jsonobj.startdate!=''){
			promoRecord.setFieldValue('custrecord_rpt_promo_start_date', jsonobj.startdate);
		}
		if(jsonobj.enddate!=''){
			promoRecord.setFieldValue('custrecord_rpt_promo_end_date', jsonobj.enddate);
		}
		
promoRecord.setFieldValue('custrecord_is_mei_promotion','T');
		

//For New Design
		
if(jsonobj.discounteditems!='' && jsonobj.discounteditems.length > 0) {
			nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

			for(var dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
				//nlapiLogExecution('DEBUG','discounteditems in for  :: '+jsonobj.discounteditems[dItems]['internalid']);
				promoRecord.selectNewLineItem('discounteditems');
				promoRecord.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
				promoRecord.commitLineItem('discounteditems');
			}
				
			var rptItems = [];
			
				nlapiLogExecution('DEBUG','Up:discounteditems length for rptItems:: '+jsonobj.discounteditems.length);
				for(var cc = 0; cc < jsonobj.discounteditems.length ; cc ++){
					nlapiLogExecution('DEBUG','Up:In rpt Items :: '+jsonobj.discounteditems[cc]['internalid']);
					var rptItem = jsonobj.discounteditems[cc]['internalid'];
					rptItems.push(rptItem);
				}
				promoRecord.setFieldValues('custrecord_rpt_promo_items',rptItems);
			
}

var rptCHL3 = [];
if(jsonobj.chl3!='' && jsonobj.chl3.length>0){
	nlapiLogExecution('DEBUG','Up:chl3 length:: '+jsonobj.chl3.length);
	for(var cc = 0; cc < jsonobj.chl3.length ; cc ++){
		nlapiLogExecution('DEBUG','Up:In CHL3 :: '+jsonobj.chl3[cc]['internalid']);
		var rptchl = jsonobj.chl3[cc]['internalid'];
		//nlapiLogExecution('DEBUG','cc in for  :: '+jsonobj.chl3[cc]['name']);
		//var rptchl = jsonobj.chl3[cc]['name'];
		rptCHL3.push(rptchl);
	}
	promoRecord.setFieldValues('custrecord_rpt_custhierarchy_lvl3',rptCHL3);
}

// For Interim Solutions
if(jsonobj.customercategory!='' && jsonobj.customercategory.length > 0) {
var customerCategoryValues = [];
nlapiLogExecution('DEBUG','customercategory.length  :: '+jsonobj.customercategory.length);
promoRecord.setFieldValue('audience','SPECIFICCUSTOMERS');
for(var cc = 0; cc < jsonobj.customercategory.length ; cc ++){
	nlapiLogExecution('DEBUG','Up:In Customer Category:: '+jsonobj.customercategory[cc]['internalid']);
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
	
nlapiLogExecution('DEBUG','Cr:jsonobj  :: '+jsonobj);
nlapiLogExecution('DEBUG','Cr:customform  :: '+jsonobj.customform);
nlapiLogExecution('DEBUG','Cr:name  :: '+jsonobj.name);
nlapiLogExecution('DEBUG','Cr:description  :: '+jsonobj.description);
nlapiLogExecution('DEBUG','Cr:discount  :: '+jsonobj.discount);
nlapiLogExecution('DEBUG','Cr:code  :: '+jsonobj.code);
nlapiLogExecution('DEBUG','Cr:custrecord_advpromo_subsidiary  :: '+jsonobj.custrecord_advpromo_subsidiary);
nlapiLogExecution('DEBUG','Cr:discounttype  :: '+jsonobj.discounttype);
nlapiLogExecution('DEBUG','Cr:rate  :: '+jsonobj.rate);
nlapiLogExecution('DEBUG','Cr:Start Date :: '+jsonobj.startdate);
nlapiLogExecution('DEBUG','Cr:End Date:: '+jsonobj.enddate);
nlapiLogExecution('DEBUG','Cr:specificitemscheck:: '+jsonobj.specificitemscheck);

var promo = nlapiCreateRecord('promotioncode', { customform : jsonobj.customform});
promo.setFieldValue('name', jsonobj.name);
promo.setFieldValue('discount',jsonobj.discount);
promo.setFieldValue('code',jsonobj.code);
promo.setFieldValue('description',jsonobj.description);
promo.setFieldValue('custrecord_advpromo_subsidiary',jsonobj.custrecord_advpromo_subsidiary);
promo.setFieldValue('discounttype',jsonobj.discounttype);
promo.setFieldValue('rate',jsonobj.rate);
promo.setFieldValue('custrecord_rpt_promo_start_date',jsonobj.startdate);
promo.setFieldValue('custrecord_rpt_promo_end_date',jsonobj.enddate);
promo.setFieldValue('specificitemscheck',jsonobj.specificitemscheck=='true'?'T':'F');
promo.setFieldValue('discounteveryxunittype','1');
promo.setFieldValue('custrecord_is_mei_promotion','T');


nlapiLogExecution('DEBUG','discounteditems Length  :: '+jsonobj.discounteditems.length);

for(var dItems = 0; dItems < jsonobj.discounteditems.length ; dItems ++){
	promo.selectNewLineItem('discounteditems');
	promo.setCurrentLineItemValue('discounteditems', 'discounteditem', jsonobj.discounteditems[dItems]['internalid']);
	promo.commitLineItem('discounteditems');
}

//For New Design

var rptCHL3 = [];
if(jsonobj.chl3!='' && jsonobj.chl3.length>0){
	nlapiLogExecution('DEBUG','Cr: chl3 length:: '+jsonobj.chl3.length);
	for(var cc = 0; cc < jsonobj.chl3.length ; cc ++){
		nlapiLogExecution('DEBUG','Cr:for CHL3 :: '+jsonobj.chl3[cc]['internalid']);
		var rptchl = jsonobj.chl3[cc]['internalid'];
		//nlapiLogExecution('DEBUG','cc in for  :: '+jsonobj.chl3[cc]['name']);
		//var rptchl = jsonobj.chl3[cc]['name'];
		rptCHL3.push(rptchl);
	}
	promo.setFieldValues('custrecord_rpt_custhierarchy_lvl3',rptCHL3);
}

var rptItems = [];
if(jsonobj.discounteditems!='' && jsonobj.discounteditems.length>0){
	nlapiLogExecution('DEBUG','Cr:discounteditems length for rptItems   :: '+jsonobj.discounteditems.length);
	for(var cc = 0; cc < jsonobj.discounteditems.length ; cc ++){
		nlapiLogExecution('DEBUG','Cr:In Discounted Items :: '+jsonobj.discounteditems[cc]['internalid']);
		var rptItem = jsonobj.discounteditems[cc]['internalid'];
		rptItems.push(rptItem);
	}
	promo.setFieldValues('custrecord_rpt_promo_items',rptItems);
}

//For interim Solution

if(jsonobj.customercategory!='' && jsonobj.customercategory.length>0){
	var customerCategoryValues = [];
	nlapiLogExecution('DEBUG','customercategory.length  :: '+jsonobj.customercategory.length);
	promo.setFieldValue('audience','SPECIFICCUSTOMERS');
	for(var cc = 0; cc < jsonobj.customercategory.length ; cc ++){
		nlapiLogExecution('DEBUG','Cr:In customer Category  :: '+jsonobj.customercategory[cc]['internalid']);
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
"name": "06211743-SP",
"description":"06211743-SP",
"discount": "6807",
"code":"06211743-SP",
"custrecord_advpromo_subsidiary":"2",
"discounttype":"flat",
"rate":"10",
"startdate":"06/21/2017",
"enddate":"06/22/2017",
"specificitemscheck":"true",
"chl3": [
    {
      "internalid": "101",
      "name": "Reserva Organica SA de CV"
    },
    {
      "internalid": "102",
      "name": "Crimsonplace Ltd."
    },
    {
      "internalid": "103",
      "name": "Dedicated EHF"
    }
  ],
  
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
"id":"10620",
"discount":"6835",
"description":"est doe udpate",
"discounttype":"",
"rate":"53",
"startdate":"5/11/2016",
"enddate":"5/12/2016",
"isinactive":"false",
"chl3": [
    {
      "internalid": "101",
      "name": "Reserva Organica SA de CV"
    }
  ],
  
  "customercategory": [
    {
      "internalid": "63",
      "name": "Business"
    }
    
  ],
"discounteditems": [
    
	{
        "internalid": "5780",
        "name": "RL-65535"
    }
    
  ]
}

]
}
*/