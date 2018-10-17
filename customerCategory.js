
function createCHL3withCustomerCategory(jsonobj){
	var fx='MEI-NS Integration';
	var idCCandCHL3Array = [];

try{
	

nlapiLogExecution('DEBUG','count of CHL3  :: '+jsonobj.CHL3.length);


for(chl3=0; chl3<jsonobj.CHL3.length ; chl3++){
	nlapiLogExecution('DEBUG','count:: '+chl3);
var chLevel3 = nlapiCreateRecord('customrecord_rnl_level3customerhierarchy');
nlapiLogExecution('DEBUG','CHL3 Name from json:: '+jsonobj.CHL3[chl3]['name']);
var ccAndchl3Name = jsonobj.CHL3[chl3]['name'];
chLevel3.setFieldValue('name', ccAndchl3Name);


try{
	var idCHL3 = nlapiSubmitRecord(chLevel3); 
	var idCC ='';
	nlapiLogExecution('DEBUG','internalId of CHL3 :: '+idCHL3);
	if(idCHL3){
		var loadCHL3 = nlapiLoadRecord('customrecord_rnl_level3customerhierarchy', idCHL3);
	nlapiLogExecution('DEBUG','CHL3 Name:: '+ccAndchl3Name);
		//var nameCHL3 = loadCHL3.name;
		var custCategory = nlapiCreateRecord('customercategory');
		custCategory.setFieldValue('name', ccAndchl3Name);
		idCC = nlapiSubmitRecord(custCategory); 
		nlapiLogExecution('DEBUG','internal id of CC:: '+idCC);
	}
	nlapiLogExecution('DEBUG','internal id of CHL3 and CC:: '+idCHL3+"-"+idCC);
	var idCCandCHL3=idCHL3+"-"+idCC;
	idCCandCHL3Array.push(idCCandCHL3);
	
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
	
	
}//for

return idCCandCHL3Array ;
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

{"CHL3":[

]}
*/