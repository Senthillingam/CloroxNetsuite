function helloWorld(datain)
{
    return 'Greetings DemoUser from NetSuite RESTlet Land!';
}

function getRecord(datain)
{
    

nlapiLogExecution('DEBUG','Before');
    //return nlapiLoadRecord("salesorder", "61635"); // e.g recordtype="customer", id="769"
	//return nlapiLoadSearch('item', 'customsearch393'); // e.g recordtype="customer", id="769"
	//var search = nlapiLoadRecord('promotioncode', '2');
	//var search = nlapiLoadRecord('customer', '15583');
	//var search = nlapiLoadRecord('customercategory', '49');
	var search = nlapiLoadRecord('customrecord_rnl_level3customerhierarchy','4083');
//var search = nlapiLoadSearch('item', 'customsearch394');
//var resultSet = search.runSearch();
nlapiLogExecution('DEBUG','resultSet='+search);
    
//var firstThreeResults = resultSet.getResults(0, 1000);
nlapiLogExecution('DEBUG','After');
//return firstThreeResults;
return search;

}

// Create a standard NetSuite record
function createRecord(datain)
{
    var err = new Object();
   
    // Validate if mandatory record type is set in the request
    if (!datain.recordtype)
    {
        err.status = "failed";
        err.message= "missing recordtype";
        return err;
    }
   
    var record = nlapiCreateRecord(datain.recordtype);
   
    for (var fieldname in datain)
    {
     if (datain.hasOwnProperty(fieldname))
     {
         if (fieldname != 'recordtype' && fieldname != 'id')
         {
             var value = datain[fieldname];
             if (value && typeof value != 'object') // ignore other type of parameters
             {
                 record.setFieldValue(fieldname, value);
             }
         }
     }
    }
    var recordId = nlapiSubmitRecord(record);
    nlapiLogExecution('DEBUG','id='+recordId);
   
    var nlobj = nlapiLoadRecord(datain.recordtype,recordId);
    return nlobj;
}