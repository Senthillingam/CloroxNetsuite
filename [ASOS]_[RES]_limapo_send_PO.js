var Token = null;
var headerCount = 0;
var prev_id = null;
var poIds = "";
var logRecordId = null;
var index;
var searchResults, xmlResponse = '',request, pageCount;
var startdate = new Date();
var isInitRequest = false;
var lastSentInternalId = null;

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param request
 *            parameters sent in URL
 * @returns XML response string
 */

function getRequest(requestIn) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering getRequest() method');

	var responseXML = '';

	try {

		writeStartTime(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO);

		logRecordId = writeExecutionStatus(
				ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
				ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.INPROCESS);

		try {

			if (validateRequest(requestIn)) {
				responseXML = processRequest(request);
			}

		} catch (e) {

			
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'exception 1 in getRequest() method ' + e.exceptionId.toString() );
			
			if (e.exceptionId.toString() == ASOS.constants.code.exception.rest.RESTLET_ALREADY_RUNNING) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.rest.RESTLET_ALREADY_RUNNING);

			} else if (e.exceptionId.toString() == ASOS.constants.code.exception.rest.INVALID_TOKEN) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(
						ASOS.constants.code.exception.rest.INVALID_TOKEN,
						request);

			} else if (e.exceptionId.toString() == ASOS.constants.code.exception.rest.NO_TOKEN_PASSED) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.rest.NO_TOKEN_PASSED);

			} else if (e.exceptionId.toString() == ASOS.constants.code.exception.js.JS_EXCEPTION) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.js.JS_EXCEPTION);

			} else if (e.exceptionId.toString() == ASOS.constants.code.exception.nlapi.CREATERECORD_API_EXCEPTION) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.nlapi.JS_EXCEPTION);
			
			}
			else if (e.exceptionId.toString() == ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.nlapi.JS_EXCEPTION);
			
			}
			else if (e.exceptionId.toString() == ASOS.constants.code.exception.nlapi.SUBMITRECORD_API_EXCEPTION) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.nlapi.JS_EXCEPTION);
			
			}
			else if (e.exceptionId.toString() == ASOS.constants.code.exception.nlapi.SUBMITFIELD_API_EXCEPTION) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.nlapi.JS_EXCEPTION);
			
			}
			else if (e.exceptionId.toString() == ASOS.constants.code.exception.rest.ALL_SYNC) {

				handleException(e,
						ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
						logRecordId, '');

				responseXML = createErrorResponse(ASOS.constants.code.exception.rest.ALL_SYNC,request);
			
			} else {
				
				responseXML = createErrorResponse(ASOS.constants.code.exception.js.JS_EXCEPTION);
			}

		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 2 in getRequest() method ' + e.toString());
		
		responseXML = createErrorResponse(ASOS.constants.code.exception.js.JS_EXCEPTION);
	}

	writeEndTime(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO);
	writeExecutionStatus(
			ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
			ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.COMPLETED,
			logRecordId);
	return responseXML;

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param request
 *            parameters sent in URL
 * @returns boolean value
 */

function validateRequest(requestIn) {


	
	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering validateRequest() method'+getRequest);
	

	try {

	
		var a = new Array();
		var b=requestIn.toString();
		a=b.split('=');
		var Token =a[0];
		request=a[1];
		
		nlapiLogExecution('DEBUG', '---->Testing Token<----','Execution Started' );
		nlapiLogExecution('DEBUG', '---->Testing Token<----','Token'+a[0]+'value'+a[1] );
		
		if (Token == 'Token') {

			if (request == "null") {

				nlapiLogExecution('DEBUG',
						ASOS.constants.code.scriptExecutionLog.TITLE,
						'entering validateRequest() method empty token');
				try {

					if (checkLog(ASOS.constants.code.exception.rest.INIT_REQUEST)) {
						isInitRequest = true;
						return true;

					}

				} catch (e) {

					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'exception 1 in validateRequest() method '
									+ e.toString());
					throw e;
					return false;
				}

			} else if (request != "") {
				
				nlapiLogExecution('DEBUG',
						ASOS.constants.code.scriptExecutionLog.TITLE,
						'entering validateRequest() method token passed');
				try {

					if (checkLog(ASOS.constants.code.exception.rest.PAGE_REQUEST)) {
						
						try {
						
							if (checkConfig(
									ASOS.constants.code.exception.rest.PAGE_REQUEST,
									request)) {
								
								isInitRequest = false;
								return true;
							}
							
						} catch (e) {
							throw e;
							return false;
						}

					}

				} catch (e) {

					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'exception 2 in validateRequest() method '
									+ e.toString());

					throw e;
					return false;
				}

			}
			
		} else {
			
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering validateRequest() method No token passed');

			throw new exception(
					ASOS.constants.code.exception.rest.NO_TOKEN_PASSED, null);
						return;
		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 2 in validateRequest() method ' + e.toString());

		//throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
		throw e;
	}

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param check
 *            code to decide what conditions to check
 * @returns Error Code
 */
function checkLog(checkCode) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering checkLog() method');

	try {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"Entered check log");

		if (checkCode == ASOS.constants.code.exception.rest.INIT_REQUEST) {

			if (getLatestExecutionStatusfromLog(
					ASOS.constants.custom.id.recordtype.LIMAPO_LOG,
					ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO) != ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.INPROCESS) {

				return true;

			} 
			else {

				throw new exception(
						ASOS.constants.code.exception.rest.RESTLET_ALREADY_RUNNING,
						null);
				return;
				// return false;
			}

		}

		if (checkCode == ASOS.constants.code.exception.rest.PAGE_REQUEST) {

			if (getLatestExecutionStatusfromLog(
					ASOS.constants.custom.id.recordtype.LIMAPO_LOG,
					ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO) != ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.INPROCESS) {

				return true;

			} else {

				throw new exception(
						ASOS.constants.code.exception.rest.RESTLET_ALREADY_RUNNING,
						null);
				return;
				// return false;
			}

		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 1 in checkLog() method ' + e.toString());

	//	throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
  throw e;
	}
}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param check
 *            code to decide what conditions to check
 * @returns Error Code
 */
function checkConfig(checkCode, Token) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering checkConfig() method');

	try {

		if (checkCode == ASOS.constants.code.exception.rest.PAGE_REQUEST) {

			try {

				if (checkTokenStatus(Token)) {
					return true;
				}

			} catch (e) {

				throw e;
				//return;
			}

		} else {

			// TODO: handle INIT REQUEST not required for now
		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 1 in checkConfig() method ' + e.toString());

		//throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
throw e;
	}

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param check
 *            code to decide what conditions to check
 * @returns Error Code
 */
function checkTokenStatus(Token) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering checkTokenStatus() method');
	nlapiLogExecution('DEBUG', 'TEST', 'Token'+Token);

	try {

		var filters = new Array();

		filters
				.push(new nlobjSearchFilter(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_TOKEN,
						null, 'is', Token));

		var columns = new Array();

		columns
				.push(new nlobjSearchColumn(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_INTERNALID)
						.setSort(true));

		columns
				.push(new nlobjSearchColumn(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_REST_STATUS));

		try {

			
			var searchResults = nlapiSearchRecord(
					ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG, null,
					filters, columns);
		}
		catch(e)
		{
			
			throw new exception(ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION,e);
			return;
		}
			
			try{
			// nlapiLogExecution('DEBUG',ASOS.constants.code.scriptExecutionLog.TITLE,'checkTokenStatus  searchResults'+searchResults.length);
			if (searchResults && searchResults.length) {

				if (searchResults[0]
						.getValue(ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_REST_STATUS) == ASOS.constants.custom.custreccustomfield.value.LIMAPO_config_restStatus.NOTSTARTED) {

					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'entering checkTokenStatus() has seach result method');

					return true;

				} else {
					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'entering checkTokenStatus() no seach result method');

					throw new exception(
							ASOS.constants.code.exception.rest.INVALID_TOKEN,
							null);
					return;
				}

			} else {

				throw new exception(
						ASOS.constants.code.exception.rest.INVALID_TOKEN, null);
				return;

			}

		} catch (e) {

			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'exception 1 in checkTokenStatus() method ' + e.toString());

			throw e;
			//return;
		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 2 in checkTokenStatus() method ' + e.toString());

	//throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
		
throw e;
	}

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param request
 *            parameters sent in URL
 * @returns XML response string
 */

function processRequest(request) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering processRequest() method');

	try {
		
		if (request == "null") {
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering processRequest() method if condition no token');
			
			return createInitialResponse(request);
		
		} else {
		
			return createPageResponse(request);

		}

	} catch (e) {
		
		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'exception 1 in processRequest() method ' + e.exceptionId.toString() );
		throw e;

	}
}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * @param
 * @returns XML Response string
 */
function createInitialResponse(request) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering createInitialResponse() method');
	try {

		var random = (1000 + Math.random() * 8999).toString();

		var ind = random.indexOf('.');

		Token = random.substring(0, ind);

		createConfig(Token);

		index = null;

		return getXMLData(getAllUnMarkedPORecord(index, Token), Token);

	} catch (e) {

		throw e;

	}
}

function createPageResponse(request) {

	try {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE, 'Page Response');

//		logRecordId = writeExecutionStatus(
//				ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
//				ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.INPROCESS);
		index = searchInternalId(request, true);
		return getXMLData(getAllUnMarkedPORecord(index, request),
				request);
		//return forTestingwithTokenOnly();
	} catch (e) {
		writeExecutionLog(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
				e);
		return e;

	}

}
function searchInternalId(Token, lpFlag) {
	try {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"search internal Id Token-" + Token);
		var id = 0;
		var lpid = null;
		try
		{
		var results = nlapiSearchRecord(
				ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG,
				null,
				[ new nlobjSearchFilter('externalid', null, 'anyof', Token) ],
				[
						new nlobjSearchColumn('internalid'),
						new nlobjSearchColumn(
								ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_LAST_SENT_PO_INTERNALID) ]);
		}
		catch(e)
		{
			throw new exception(ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION,e);
			return;
		}
		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"search internal Id after searchrecord");
		//		nlapiLogExecution('DEBUG',ASOS.constants.code.scriptExecutionLog.TITLE,"search internal Id result length"+results.length);
		if (results && results.length > 0) {
			id = results[0].getValue('internalid');
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					"Config Internal id" + id);

			lpid = results[0]
					.getValue(ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_LAST_SENT_PO_INTERNALID);

		}

		if (lpFlag) {
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					"search internal Id lpid" + lpid);
			return lpid;

		} else {
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					"search internal eLSE CCASE" + id);
			return id;
		}
	} catch (e) {
		writeExecutionLog(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
				e);
		
		throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
	}

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * 
 * @param Token
 * @returns Void
 */

function createConfig(Token) {

	try {

		
		var configRecord; 
		
		try{
		
			configRecord = nlapiCreateRecord(ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG);
			
		}catch(e){
			
			throw new exception(ASOS.constants.code.exception.nlapi.CREATERECORD_API_EXCEPTION, e);
			return false;
		}
		

		configRecord.setFieldValue(
				ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_DATE,
				convertPSTtoChinaTime(new Date()));

		configRecord
				.setFieldValue(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_TOKEN,
						Token);

		configRecord
				.setFieldValue(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_LAST_SENT_PO_INTERNALID,
						'');

		configRecord
				.setFieldValue(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_EXTERNALID,
						Token);
		
		try{
			
			nlapiSubmitRecord(configRecord, true, true);
			
		}catch(e){
			
			throw new exception(ASOS.constants.code.exception.nlapi.SUBMITRECORD_API_EXCEPTION,e);
			return false;
		}
		

	} catch (e) {

		throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);

	}

}

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * 
 * Returns Purchase Order Record filtered out by UNMARKED SENT TO LIMA checkbox
 * and created date
 * 
 * @param id
 * @param Token
 * @returns {Object}
 *                   
 */

function getAllUnMarkedPORecord(id, Token) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering getAllUnMarkedPORecord() method');
	try {

		var dateformat = new Date(searchDateFilter());

		var date = getFormatedDate(dateformat);

		var filters = new Array();

		//              filters
		//              .push(new nlobjSearchFilter(
		//                           ASOS.constants.custom.id.standardfield.PURCHASE_ORDER_DATE_CREATED,
		//                           null, 'onorbefore', date));
		//              filters
		//              .push(new nlobjSearchFilter(
		//                           ASOS.constants.custom.id.standardfield.PURCHASE_ORDER_LAST_MODIFIED_DATE,
		//                           null, 'onorbefore', date));
		//              
		              filters.push(new nlobjSearchFilter('custbodysend_to_lima', null,
		              'is', 'F'));

		if (id) {
			
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering getAllUnMarkedPORecord() method formula field'
							+ id);

			filters.push(new nlobjSearchFilter('formulanumeric', null,
					'greaterthan', parseInt(id)).setFormula('{internalid}'));

		}

		var columns = new Array();
		columns
				.push(new nlobjSearchColumn(
						ASOS.constants.custom.id.standardfield.PURCHASE_ORDER_INTERNAL_ID,
						null).setSort());
		
		columns.push(new nlobjSearchColumn('tranid'));
		//columns.push(new nlobjSearchColumn('tranid'));
		/*                   columns.push( new
		 nlobjSearchColumn('custitemoriginal_supplier'));
		 columns.push(new nlobjSearchColumn('custitem_brand'));
		 columns.push( new nlobjSearchColumn('class'));
		 columns.push(new nlobjSearchColumn('trandate'));
		 columns.push( new nlobjSearchColumn('custbodydelivery_method'));
		 columns.push(new nlobjSearchColumn('custbodyshipping_terms'));
		 columns.push( new nlobjSearchColumn('custbodyshipping_point'));
		 columns.push(new nlobjSearchColumn('custbodyfreight_forwarder'));
		 columns.push( new nlobjSearchColumn('custbodyex_factory_date'));
		 columns.push( new nlobjSearchColumn('status'));
		 columns.push(new nlobjSearchColumn('currency'));
		 //child fields
		 columns.push(new
		 nlobjSearchColumn('custitem_item_category','item'));
		 columns.push(new nlobjSearchColumn('custitem_style','item'));
		 columns.push(new nlobjSearchColumn('itemid','item'));
		 columns.push(new nlobjSearchColumn('displayname','item'));
		 columns.push(new nlobjSearchColumn('custitem_brand','item'));
		 columns.push(new
		 nlobjSearchColumn('custitem_refinement_size','item'));
		 columns.push(new
		 nlobjSearchColumn('custitemrefinement_colour','item'));
		 columns.push(new
		 nlobjSearchColumn('custitem_merchandising_season','item'));
		 columns.push(new
		 nlobjSearchColumn('custitem_commodity_code','item'));
		 columns.push(new
		 nlobjSearchColumn('custitem_supplier_colour','item'));
		 columns.push(new
		 nlobjSearchColumn('custitemcustitem_uk_size','item'));
		 columns.push(new
		 nlobjSearchColumn('custitemcny_now_price','item'));
		 columns.push(new nlobjSearchColumn('cost','item'));
		 columns.push(new nlobjSearchColumn('ChinaFreightCost','item'));
		 columns.push(new
		 nlobjSearchColumn('custbodyex_factory_date','item'));
		 columns.push(new
		 nlobjSearchColumn('custbodydelivery_date','item'));
		 columns.push(new
		 nlobjSearchColumn('custbodydelivery_date','item'));
		 columns.push(new
		 nlobjSearchColumn('custbodydelivery_date','item'));
		 columns.push(new
		 nlobjSearchColumn('custbody_customrfieldpodownloadtowms','item'));
		
		 */
try
{
		searchResults = nlapiSearchRecord('purchaseorder', null, filters,
				columns);
}
catch(e)
{

	throw new exception(ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION,e);
	return;
}

		if (searchResults.length == 0) {

			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering getAllUnMarkedPORecord() method no of POs'
							+ searchResults.length);
			return null;
			//  throw new exception(ASOS.constants.code.exception.rest.NO_PO_FOUND, '');

		} else {

			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering getAllUnMarkedPORecord() method no of POs'
							+ searchResults.length);
			return searchResults;

		}

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE, e);
		//  throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
	}
}

function searchDateFilter() {
	try{
		var configSearchResults;
	
	var idate = null;

	var columns = new Array();
	columns.push(new nlobjSearchColumn(
			ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_DATE,
			null).setSort(true));
	columns.push(new nlobjSearchColumn(
			ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_TOKEN,
			null));
try
{
	 configSearchResults = nlapiSearchRecord(
			ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG, null, null,
			columns);
}catch(e)
{

	throw new exception(ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION,e);
	return;
}
	if (configSearchResults != null && configSearchResults != '') {
		idate = configSearchResults[0].getValue(
				ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_DATE,
				null);
	}

	return idate;
	}
	catch(e)
	{
		throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
return;
	}

}

function getFormatedDate(dateToFormat) {
	
	try
	{
	var dd = dateToFormat.getDate();
	var mm = dateToFormat.getMonth() + 1;
	var yyyy = dateToFormat.getFullYear();
	var hh = dateToFormat.getHours();
	var min = dateToFormat.getMinutes();
	min = min < 10 ? '0' + min : min;
	//var sec = dateToFormat.getSeconds();
	var ampm = (hh >= 12) ? "PM" : "AM";
	hh = hh % 12;
	hh = hh ? hh : 12; // the hour '0' should be '12'

	var currentdateret = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + min
			+ ' ' + ampm;
	return currentdateret;
	}
	catch(e)
	{	throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
	return;
}
}//End of function  getFormatedDate()

/**
 * Method Description
 * 
 * Version Date Author Remarks 1.00 12 August 2014 Gowthaman(CTS) Initial
 * Version
 * 
 */

/**
 * 
 * Returns Purchase Order Record filtered out by UNMARKED SENT TO LIMA checkbox
 * and created date
 * 
 * @param {Object}
 * @param {String}
 * @returns {String}
 *                   
 */
function getXMLData(searchResults, Token) {

	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			'entering getXMLData() method');
	
	try {

		if (searchResults) {

			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering getXMLData()  entering if method');
		    var j=1;
			var lastRecord = searchResults.length - 1;
			
			var lastFlag = false;

			for ( var i = 0; i < searchResults.length; i++) {
				// first value
				j=i-1;
				if (prev_id == null) {
                   
					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'searchResults::'
									+ searchResults[i].getValue('internalid'));
//					nlapiLogExecution('DEBUG',
//							ASOS.constants.code.scriptExecutionLog.TITLE,
//							'searchResults::'
//									+ searchResults[i]
//											.getValue('custbodysend_to_lima'));
					poIds += searchResults[i].getValue('tranid') + ",";
					prev_id = searchResults[i].getValue('internalid');
					xmlResponse = '<PurchaseOrder><PurchaseOrder_ID>'
							+ searchResults[i].getValue('internalid')
							+ '</PurchaseOrder_ID>';
					xmlResponse += '<SupplierName>Kyland Company Limited</SupplierName>';
					xmlResponse += '<PurchaseOrderLineCollection>';
					//continue;
				}
				// checking previous internal id for populating New value
				else if (prev_id != searchResults[i].getValue('internalid')) {

					xmlResponse += '</PurchaseOrderLineCollection>';
					xmlResponse += '</PurchaseOrder>';
					poIds += searchResults[i].getValue('tranid') + ",";

					//	var rescheduletime = new Date().getTime();

					//searchLog
					headerCount++;
					if (isRescheduleRequired(
							
							startdate,
							ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
							headerCount)) {
						nlapiLogExecution('DEBUG', 'time out', 'time out');
						createPageConfig(Token, poIds);					
					   // lastSentInternalId = searchResults[j].getValue('internalid');
						nlapiLogExecution('DEBUG', 'lastSentInternalId', lastSentInternalId);
         				updateConfig(Token, lastSentInternalId, null);
						//updateConfig(Token, lastSentInternalId, null);
						writeCheckpointLog(
								ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
								headerCount);
						nlapiLogExecution('DEBUG', 'time out', 'time out');
						lastFlag = false;
						break;

					}

					xmlResponse += '<PurchaseOrder><PurchaseOrder_ID>'
							+ searchResults[i].getValue('internalid')
							+ '</PurchaseOrder_ID>';
					//lastSentInternalId = searchResults[i]
					//.getValue('internalid');
					xmlResponse += '<SupplierName>Kyland Company Limited</SupplierName>';
					xmlResponse += '<PurchaseOrderLineCollection>';

					prev_id = searchResults[i].getValue('internalid');

				}
				// checking previous internal id for populating child value
				else if (prev_id == searchResults[i].getValue('internalid')) {
					xmlResponse += '<PurchaseOrderLine>';
					xmlResponse += '<Brand>ASOS</Brand>';
					xmlResponse += '</PurchaseOrderLine>';

				}
				lastSentInternalId = searchResults[i]
				.getValue('internalid');

				if (lastRecord == i) {

					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'last record::' + i);

					lastSentInternalId = searchResults[i]
							.getValue('internalid');
					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'last Record lastSentInternalId::'
									+ lastSentInternalId);
					nlapiLogExecution('DEBUG',
							ASOS.constants.code.scriptExecutionLog.TITLE,
							'last record poIds::' + poIds);

					if (getAllUnMarkedPORecord(lastSentInternalId, Token)) {

						nlapiLogExecution('DEBUG',
								ASOS.constants.code.scriptExecutionLog.TITLE,
								'last record if condition ');
						isInitRequest= false;
						return getXMLData(getAllUnMarkedPORecord(
								lastSentInternalId, Token), Token);
					} else {
						nlapiLogExecution('DEBUG',
								ASOS.constants.code.scriptExecutionLog.TITLE,
								'last record else condition ');
						lastFlag = true;
						createPageConfig(Token, poIds);
						updateConfig(
								Token,
								lastSentInternalId,
								ASOS.constants.custom.custreccustomfield.value.LIMAPO_config_restStatus.COMPLETED);
					}

				}
			
				
			}

			if (lastFlag) {
				xmlResponse += '</PurchaseOrderLineCollection>';
				xmlResponse += '</PurchaseOrder>';
				xmlResponse += '</xml>';
				//   				writeExecutionStatus(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.COMPLETED);
				//   				writeEndTime(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO);	

				return '<?xml version="1.0" encoding="UTF-8"?>'
						+ '<xml><Header><Token>'
						+ Token
						+ '</Token><NextPageExists>No</NextPageExists><Message>success</Message></Header>'
						+ xmlResponse;
			} else {

				xmlResponse += '</xml>';
				//   				writeExecutionStatus(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.COMPLETED);
				//   				writeEndTime(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO);	

//				lastSentInternalId = searchResults[j].getValue('internalid');
//				updateConfig(Token, lastSentInternalId, null);
				
				return '<?xml version="1.0" encoding="UTF-8"?>'
				        + '<xml><Header><Token>'
						+ Token
						+ '</Token><NextPageExists>Yes</NextPageExists><Message>success</Message></Header>'
						+ xmlResponse;
				

			}

		} else {
			
			nlapiLogExecution('DEBUG',
					ASOS.constants.code.scriptExecutionLog.TITLE,
					'entering getXMLData()  entering else method');
			if(isInitRequest)
			{
				throw new exception(ASOS.constants.code.exception.rest.ALL_SYNC,'');
				return;
				
			}else{
				// TO DO
			}
				
		}
		//return test;

	} catch (e) {

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				'entering getXMLData() method' + e);
		throw  e;
	}

}

function createPageConfig(Token, poids) {
	try {
		
		var PageRecord;
		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"createPageConfig");
		var id = searchInternalId(Token, null);

		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"search internal Id after pagecount after searchInternalId"
						+ id);
		pageCount = (searchPageCount(id) + 1);

		//		var ind=pc.indexOf('.');
		//		pageCount= pc.substring(0,ind);
		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE,
				"search internal Id after pagecount" + pageCount);
		try{
			
			 PageRecord = nlapiCreateRecord(ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG_PAGE);
			
		}catch(e){
			
			throw new exception(ASOS.constants.code.exception.nlapi.CREATERECORD_API_EXCEPTION, e);
			return false;
		}
	
		PageRecord
				.setFieldValue(
						ASOS.constants.custom.id.custrecCustomfield.LIMAPO_PAGE_PARENT_CONFIG_INTERNALID,
						id);

		PageRecord.setFieldValue(
				ASOS.constants.custom.id.custrecCustomfield.LIMAPO_PAGE_ID,
				pageCount);

		PageRecord.setFieldValue(
				ASOS.constants.custom.id.custrecCustomfield.LIMAPO_PAGE_POIDS,
				poids);

		
		try{
			
			nlapiSubmitRecord(PageRecord, true, true);
			
			
		}catch(e){
			
			throw new exception(ASOS.constants.code.exception.nlapi.SUBMITRECORD_API_EXCEPTION, e);
			return false;
		}
	} catch (e) {
		writeExecutionLog(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
				e);
		throw  e;
	


	}
}
function searchPageCount(id) {
	try {
		var results ;
		nlapiLogExecution('DEBUG',
				ASOS.constants.code.scriptExecutionLog.TITLE, "searchPageCount");
		if (id) {

			
			try{
			 results = nlapiSearchRecord(
					ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG_PAGE,
					null,
					[ new nlobjSearchFilter(
							ASOS.constants.custom.id.custrecCustomfield.LIMAPO_PAGE_PARENT_CONFIG_INTERNALID,
							null, 'is', id) ], [ new nlobjSearchColumn(
							'internalid') ]);
			}
			catch(e)
			{
				throw new exception(ASOS.constants.code.exception.nlapi.SEARCH_API_EXECEPTION,e);
				return;
			}

			if (results && results.length > 0) {
				return results.length;
			} else {
				return 0;
			}

		} else {

			return 0;
		}
	} catch (e) {
		writeExecutionLog(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
				e);
		throw e;


	}
}
/**
 * Method Description
 * 
 * Version    Date                 Author                    Remarks
 * 1.00       12 August 2014     Gowthaman(CTS)        Initial Version
 *
 */

/**
 * @param   constant for the error code
 * @returns XML response string
 */
function createErrorResponse(errCode, Token) {
try
{	var responseXML = '<?xml version="1.0" encoding="UTF-8"?>';
	nlapiLogExecution('DEBUG', ASOS.constants.code.scriptExecutionLog.TITLE,
			"error code" + errCode);
	if (errCode == ASOS.constants.code.exception.rest.NO_TOKEN_PASSED) {
		responseXML += '<xml><Header><Token></Token><NextPageExists>no</NextPageExists><Message>Invalid request parameters,No Token Passed</Message></Header>';
		responseXML += '</xml>';

	} else if (errCode == ASOS.constants.code.exception.rest.RESTLET_ALREADY_RUNNING) {
		responseXML += '<xml><Header><Token></Token><NextPageExists>no</NextPageExists><Message>Only one requested processed at any point in time</Message></Header>';
		responseXML += '</xml>';

	} else if (errCode == ASOS.constants.code.exception.rest.UNHANDLED_EXCEPTION) {
		responseXML += '<xml><Header><Token></Token><NextPageExists>no</NextPageExists><Message>Exception occurred in RESTLET code</Message></Header>';
		responseXML += '</xml>';

	} else if (errCode == ASOS.constants.code.exception.rest.INVALID_TOKEN) {
		responseXML += '<xml><Header><Token>'
				+ Token
				+ '</Token><NextPageExists>no</NextPageExists><Message>InValid Token</Message></Header>';
		responseXML += '</xml>';

	}
	else if (errCode == ASOS.constants.code.exception.rest.ALL_SYNC) {
		responseXML += '<xml><Header><Token>'
				+ Token
				+ '</Token><NextPageExists>no</NextPageExists><Message>All PO Sent to LIMA fot this token</Message></Header>';
		responseXML += '</xml>';

	}

//	writeExecutionStatus(
//			ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
//			ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus.COMPLETED,
//			logRecordId);
//	writeEndTime(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO);
	return responseXML;
}
catch(e)
{
	throw new exception(ASOS.constants.code.exception.js.JS_EXCEPTION, e);
	}
}

/**
 * Method Description
 * 
 * Version    Date                 Author                    Remarks
 * 1.00       12 August 2014     Gowthaman(CTS)        Initial Version
 *
 */

/**
 * Updates Custum configuration record,with status and last sent PO InternalId 
 * @param Token
 * @param lastSentInternalId
 * @param status
 */

function updateConfig(Token, lastSentInternalId, status) {
try
{
	var id = searchInternalId(Token, null);

	if (status && Token && lastSentInternalId) {
		
		try
		{
		nlapiSubmitField(
				ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG,
				id,
				ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_REST_STATUS,
				status);
		}
		catch(e)
		{
			throw new exception(ASOS.constants.code.exception.nlapi.SUBMITFIELD_API_EXCEPTION,e);
			return;
		}
	}
	
	try
	{

	nlapiSubmitField(
			ASOS.constants.custom.id.recordtype.LIMAPO_CONFIG,
			id,
			ASOS.constants.custom.id.custrecCustomfield.LIMAPO_CONFIG_LAST_SENT_PO_INTERNALID,
			lastSentInternalId);

}
catch(e)
{  throw new exception(ASOS.constants.code.exception.nlapi.SUBMITFIELD_API_EXCEPTION,e);
return; }
}
catch(e)
{
	writeExecutionLog(ASOS.constants.custom.name.script.LIMAPO_RES_SENDPO,
			e);
	throw e;
	}
}
