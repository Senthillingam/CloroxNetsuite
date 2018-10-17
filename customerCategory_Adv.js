function doCreateRec(oData) {
    nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'rectype='+oData.rectype);
    var sRecType = oData.rectype;
    var aFields = oData.fields;
    
    var oResponse = {};
    if (sRecType) {
        try {
            var recObj = nlapiCreateRecord(sRecType);
            var oField, sValue, aFieldSplit;
            var sSublist, sCol, idLine;
            for (var sName in aFields) {
                sValue = aFields[sName];
				nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'sValue='+sValue);
				nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'sName='+sName);
                if (sValue.constructor === Array) {
                    var oFirst = sValue[0];
                    if (typeof oFirst === 'string') {
                        nlapiLogExecution('AUDIT', 'ARRAY MULTISELECT', sName);
                        recObj.setFieldValue(sName, sValue);
                    } else if (typeof oFirst === 'object') {
                        nlapiLogExecution('AUDIT', 'ARRAY SUBLIST', sName);
                        for (var k=0; k<sValue.length; k++) {
                            var oLine = sValue[k];
                            recObj.selectNewLineItem(sName);
                            for (var sCol in oLine) {
                                recObj.setCurrentLineItemValue(sName, sCol, oLine[sCol]);
                            }
                            recObj.commitLineItem(sName);
                        }
                    }
                } else {
                    nlapiLogExecution('AUDIT', 'NOT ARRAY', sName);
                    recObj.setFieldValue(sName, sValue);
                }
            }
            var idRecUpd = nlapiSubmitRecord(recObj);
            oResponse.error = 0;
            oResponse.rectype = sRecType;
            oResponse.internalid = idRecUpd;
        } catch (e) {
            oResponse = generateReturnError(e.name, e.message);
        }
    }
    return oResponse;
}
/**
 * 
 * @param sErrorId
 * @param sErrorMsg
 * @returns {}
 */
function generateReturnError(sErrorId, sErrorMsg) {
    return {
        error : 1,
        code : sErrorId,
        message : sErrorMsg
    };
}