/**
 * Copyright appficiency inc. 2017 All rights reserved.
 * 
 * This script serves as the endpoint through which external systems gets its data.
 * It supports fetch and save requests.
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 May 2017     Ivan             Initial version.
 * 
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function endpointInvokePostRESTlet(dataIn) {
    var oResponse = {};
    var sOp = dataIn.op;
    
    nlapiLogExecution('AUDIT', 'POST', 'op='+sOp);
    
    switch (sOp) {
    case 'fetchlist':
        oResponse = doFetchList(dataIn);
        break;
    case 'fetchrec':
        oResponse = doFetchRec(dataIn);
        break;
    case 'updaterec':
        oResponse = doUpdateRec(dataIn);
        break;
    case 'createrec':
        oResponse = doCreateRec(dataIn);
        break;
    case 'gettotalrows':
        oResponse = doComputeTotal(dataIn);
        break;
    default:
        oResponse = generateReturnError('INVALID_OPERATION', 'Does not support requested operation.');
        break;
    }
    return oResponse;
}

/**
 * 
 * @param dataIn
 */
function doUpdateRec(oData) {
    nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'rectype='+oData.rectype);
    nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'internalid='+oData.internalid);
    
    var sRecType = oData.rectype;
    var idRec = oData.internalid;
    var aFields = oData.fields;
    
    var oResponse = {};
    if (sRecType && idRec) {
        try {
            var recObj = nlapiLoadRecord(sRecType, idRec);
            var oField, sValue, aFieldSplit;
            var sSublist, sCol, idLine;
            for (var sName in aFields) {
                sValue = aFields[sName];
                aFieldSplit = sName.split('.');
                if (aFieldSplit.length == 1) {
                    if (sValue.constructor === Array) {
                        recObj.setFieldValues(sName, sValue);
                    } else {
                        recObj.setFieldValue(sName, sValue);
                    }
                } else if (aFieldSplit.length == 3) {
                    sSublist = aFieldSplit[0];
                    sCol = aFieldSplit[1];
                    idLine = aFieldSplit[2];
                    nlapiLogExecution('AUDIT', 'Updating Line', 'sSublist='+sSublist+';sCol='+sCol+';idLine='+idLine);
                    if (sSublist && sCol && idLine) {
                        recObj.setLineItemValue(sSublist, sCol, idLine, sValue);
                    }
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
 * @param dataIn
 */
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
                if (sValue.constructor === Array) {
                    var oFirst = sValue[0];
                    if (typeof oFirst === 'string') {
                        nlapiLogExecution('AUDIT', 'ARRAY MULTISELECT', sName);
                        recObj.setFieldValues(sName, sValue);
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
 * @param dataIn
 */
function doFetchRec(oData) {
    nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'rectype='+oData.rectype);
    nlapiLogExecution('AUDIT', 'fn:doFetchRec', 'internalid='+oData.internalid);
    
    var sRecType = oData.rectype;
    var idRec = oData.internalid;
    var aFields = oData.fields;
    
    var oResponse = {}, oRecord = {};
    if (sRecType && idRec) {
        try {
            var recObj = nlapiLoadRecord(sRecType, idRec);
            var sField, sValue, aFieldInfo, aCols = [];
            for (var i = 0; i < aFields.length; i++) {
                sField = aFields[i];
                aFieldInfo = sField.split('.');
                if (aFieldInfo.length == 1) {
                    if (sField.charAt(0) == '_') {
                        sValue = recObj.getFieldText(sField.substring(1));    
                    } else {
                        sValue = recObj.getFieldValue(sField);
                    }
                    oRecord[sField] = sValue;
                } else {
                    var sSublist = aFieldInfo[0];
                    var sCol = aFieldInfo[1];
                    
                    if (!aCols[sSublist]) {
                        aCols[sSublist] = [];
                    }
                    aCols[sSublist].push(sCol);
                }
            }
            
            for (var sSublist in aCols) {
                var aColumns = aCols[sSublist];
                var nCount = recObj.getLineItemCount(sSublist);
                var aLines = [];
                for (var i=1; i<=nCount; i++) {
                    var oLine = {}, sValue;
                    for (var j=0; j < aColumns.length; j++) {
                        var sField = aColumns[j];
                        if (sField.charAt(0) == '_') {
                            sValue = recObj.getLineItemText(sSublist, sField.substring(1), i);
                        } else {
                            sValue = recObj.getLineItemValue(sSublist, sField, i);
                        }
                        oLine[sField] = sValue;
                    }
                    aLines.push(oLine);
                }
                oRecord[sSublist] = aLines;
            }
            
            oResponse.error = 0;
            oResponse.rectype = sRecType;
            oResponse.internalid = idRec;
            oResponse.data = oRecord;
        } catch (e) {
            oResponse = generateReturnError(e.name, e.message);
        }
    }
    return oResponse;
}

/**
 * 
 * @param oData
 * @returns {}
 */
function doFetchList(oData) {
    nlapiLogExecution('AUDIT', 'fn:doFetchList', 'rectype='+oData.rectype);
    
    var aResponse = [];
    var sRecType = oData.rectype;
    var aFilters = oData.filters;
    var aColumns = oData.columns;
    var idSearch = oData.searchid;
    var sStart = oData.start ? oData.start : 0;
    var sEnd = oData.end ? oData.end : 1000; 
    
    var aNsFilters, aNsColumns, aResults, aResultSet, aListGetText = [];
    if (sRecType) {
        try {
            if (aFilters) {
                aNsFilters = createSearchFilters(aFilters);
            }
            if (aColumns) {
                aNsColumns = createSearchColumns(aColumns);
                aListGetText = getColumnsForText(aColumns);
            }
            
            var oSearch;
            if (idSearch) {
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Loading Search='+idSearch);
                oSearch = nlapiLoadSearch(sRecType, idSearch);
				
				
				
				
                if (aNsFilters) {
                    oSearch.addFilters(aNsFilters);
                }
            } else {
                oSearch = nlapiCreateSearch(sRecType, aNsFilters, aNsColumns);
            }
            
            //var nTotalCount = getTotalRowCount(sRecType, idSearch, aNsFilters);
            
            nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Running Search');
            aResultSet = oSearch.runSearch();
			nlapiLogExecution('DEBUG', 'aResultSetLength', 'length='+aResultSet.length);
            if (aResultSet) {
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Getting Results');
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'sStart='+sStart);
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'sEnd='+sEnd);
                aResults = aResultSet.getResults(sStart, sEnd);
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Formatting Results');
				var resultIndex = 0;
				resultStep = 1000; // Number of records returned in one step (maximum is 1000)
				var resultSet; // temporary variable used to store the result set
				
				var i =0;
				do {
					
					
				// fetch one result set
					resultSet = aResultSet.getResults(resultIndex, resultIndex + resultStep);
				// increase pointer
					resultIndex = resultIndex + resultStep;
				// process or log the results
					nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length + ' records returned');
					//for (var i = 0; i < resultSet.length; i++) 
					//{
					//	var inid = resultSet[i].getValue('internalid');
					//	nlapiLogExecution('DEBUG', 'ID ', inid);
					//}
					
					if(resultSet.length > 0)
					{
						nlapiLogExecution('DEBUG', 'ResultSet', 'resultSetlength='+resultSet.length);
						//aResponse[i] =  formatSearchResults(resultSet, aListGetText);
						//aResponse = aResponse.concat(formatSearchResults(resultSet, aListGetText));
						aResponse[i] = resultSet;
						
						nlapiLogExecution('DEBUG', 'aListGetText', 'aListGetText='+aListGetText);
					}
					i++;
        // once no records are returned we already got all of them
				} while (resultSet.length > 0)
				nlapiLogExecution('DEBUG', 'Before for:Aresponselength', 'aResponse.length='+aResponse.length);
				var newlength = aResponse.length;
				for (var j = 0; j < newlength-1; j++) 
				{
				
				nlapiLogExecution('DEBUG', 'Inside for:', 'Inside for:');
					if(j == 0)
					{
						nlapiLogExecution('DEBUG', 'Inside if:', 'Inside if:');
						var responcenew = aResponse[j].concat(aResponse[j+1]);
					}
					else
					{
						var responcenew = responcenew.concat(aResponse[j+1]);
					}
					
				}
				//var responcenew = aResponse[0].concat(aResponse[1]);
				var aResponse2 =  formatSearchResults(responcenew, aListGetText);
				
				
                //aResponse = formatSearchResults(aResults, aListGetText);
                nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Formatted Results');
                //aResponse.rows = nTotalCount;
            }
        } catch (e) {
            aResponse2 = generateReturnError(e.name, e.message);
        }
    }
    nlapiLogExecution('AUDIT', 'fn:doFetchList', 'Returning Results');
    return aResponse2;
}
/**
 * 
 * @param sRecType
 * @param aNsFilters
 */
function getTotalRowCount(sRecType, idSearch, aNsFilters) {
    var aColumns = [];
    var nTotal = 0;
    aColumns[0] = new nlobjSearchColumn('internalid', null, 'count');
    idSearch = idSearch ? idSearch : null;
    var aResult = nlapiSearchRecord(sRecType, idSearch, aNsFilters, aColumns);
    if (aResult) {
        nTotal = aResult[0].getValue(aColumns[0]);
    }
    nlapiLogExecution('AUDIT', 'fn:getTotalRowCount', 'Total Rows='+nTotal);
    return parseInt(nTotal);
}

/**
 * 
 * @param dataIn
 */
function doComputeTotal(oData) {
nlapiLogExecution('AUDIT', 'fn:doComputeTotal', 'rectype='+oData.rectype);
    
    var aResponse = [];
    var sRecType = oData.rectype;
    var aFilters = oData.filters;
    
    var aNsFilters = null, aNsColumns = [], aResults, aResultSet, aListGetText;
    if (sRecType) {
        try {
            if (aFilters) {
                aNsFilters = createSearchFilters(aFilters);
            }
            
            aNsColumns[0] = new nlobjSearchColumn('internalid', null, 'count');
            var aResults = nlapiSearchRecord(sRecType, null, aNsFilters, aNsColumns);
            
            if (aResults) {
                var nTotal = aResults[0].getValue(aNsColumns[0]);
                nTotal = !isNaN(nTotal) ? parseInt(nTotal) : nTotal;
                aResponse = {
                    error : 0,
                    total : nTotal
                };
            }
        } catch (e) {
            aResponse = generateReturnError(e.name, e.message);
        }
    }
    return aResponse;
}

/**
 * 
 * @param {nlobjSearchFilter[]} aFilters
 * @returns {Array}
 */
function createSearchFilters(aFilters) {
    nlapiLogExecution('AUDIT', 'fn:createSearchFilters', 'aFilters='+JSON.stringify(aFilters));
    var aNsFilters = null, oFilter = {}, oNsFilter = {};
    if (aFilters) {
        aNsFilters = [];
        for (var i=0; i<aFilters.length; i++) {
            oFilter = aFilters[i];
            
            var sName = oFilter.name;
            var sJoin = oFilter.join ? oFilter.join : null;
            var sOperator = oFilter.operator;
            var sValue1 = oFilter.value1 ? oFilter.value1: null;
            var sValue2 = oFilter.value2 ? oFilter.value2 : null;
            
            nlapiLogExecution('AUDIT', 'fn:createSearchFilters', 'name='+sName+';join='+sJoin+';operator='+sOperator+';value1='+sValue1+';value2='+sValue2);
            
            if (sValue2) {
                oNsFilter = new nlobjSearchFilter(sName, sJoin, sOperator, sValue1, sValue2);
            } else {
                oNsFilter = new nlobjSearchFilter(sName, sJoin, sOperator, sValue1);
            }
            aNsFilters.push(oNsFilter);
        }
    }
    return aNsFilters;
}

/**
 * 
 * @param {nlobjSearchColumn[]} aColumns
 * @returns {Array}
 */
function createSearchColumns(aColumns) {
    var aNsColumns = null, oColumn = {}, oNsColumn = {};
    if (aColumns) {
        var aNsColumns = [], sName, sJoin, sSummary, bSort;
        for (var i=0; i<aColumns.length; i++) {
            oColumn = aColumns[i];
            
            sName = oColumn.name ? oColumn.name : null;
            sName = sName.charAt(0) == '_' ? sName.substring(1) : sName;
            sJoin = oColumn.join ? oColumn.join : null;
            sSummary = oColumn.summary ? oColumn.summary : null;
            
            oNsColumn = new nlobjSearchColumn(sName, sJoin, sSummary);
            if (oColumn.sort == true) {
                nlapiLogExecution('AUDIT', 'SETTING SORT', bSort);
                oNsColumn.setSort(true);
            } else if (oColumn.sort == false) {
                oNsColumn.setSort();
            }
            aNsColumns.push(oNsColumn);
        }
    }
    return aNsColumns;
}


/**
 * 
 * @param aColumns
 */
function getColumnsForText(aColumns) {
    var aListGetText = [];
    if (aColumns) {
        var oColumn, sName, sJoin, sKey;
        for (var i=0; i<aColumns.length; i++) {
            oColumn = aColumns[i];
            sName = oColumn.name;
            sJoin = oColumn.join ? oColumn.join : null;
            
            sKey = sJoin? sJoin + '.' + sName.substring(1) : sName.substring(1);
            if (sName.charAt(0) == '_') {
                nlapiLogExecution('AUDIT', 'fn:getColumnsForText', 'sKey='+sKey);
                aListGetText.push(sKey);
            }
        }
    }
    return aListGetText;
}

/**
 * 
 * @param {nlobjSearchResult[]} aResults
 * @returns {Array}
 */
function formatSearchResults(aResults, aListGetText) {
    var aCols = [], oData = {}, aData = [], oData = {}, oResponse = {};
    if (aResults) {
        for (var i = 0; i < aResults.length; i++) {
            var oResult = aResults[i];
            if (i==0) {
                aCols = oResult.getAllColumns();
            }
            
            var sName = '', sJoin = '', sKey = '', sLabel = '', oCol = {}, oData = {};
            for (var j = 0; j < aCols.length; j++) {
                oCol = aCols[j];
                sName = oCol.getName();
                sJoin = oCol.getJoin();
                sLabel = oCol.getLabel();
                sLabel = formatColumnLabel(sLabel);
                nlapiLogExecution('AUDIT', 'fn:formatSearchResults', 'sLabel='+sLabel);
                
                if (aListGetText.indexOf(sKey) < 0) {
                    sKey = sJoin ? sJoin + '.' + sName : sName;
                    sKey = sKey.substring(0,7) == 'formula' ? sLabel : sKey;
                    sKey = sLabel ? sLabel : sKey;
                    oData[sKey] = oResult.getValue(oCol);
                } else {
                    sKey = sJoin ? sJoin + '.' + '_' + sName : '_' + sName;
                    oData[sKey] = oResult.getText(oCol);
                }
            }
            aData.push(oData);
            
            
        }
        oResponse.error = 0;
        oResponse.rows = aResults.length;
        oResponse.data = aData;
    }
    return oResponse;
}

/**
 * 
 * @param sLabel
 */
function formatColumnLabel(sLabel) {
    if (sLabel) {
        return sLabel.toLowerCase().replace(/[^a-zA-Z ]/g, '').replace(/ /g,'');
    }
    return sLabel;
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