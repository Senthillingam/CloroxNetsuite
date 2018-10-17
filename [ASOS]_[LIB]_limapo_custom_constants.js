/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Aug 2014     Janakan(CTS)     Initial Version
 *
 */

/**
 ****************************************************************************
 ** ID Constants
 ****************************************************************************
 **/



if(!ASOS) { var ASOS = { }; }

if (!ASOS.constants) { ASOS.constants = { }; }

if (!ASOS.constants.custom) { ASOS.constants.custom = { }; }

if (!ASOS.constants.custom.id) { ASOS.constants.custom.id = { }; }

if (!ASOS.constants.custom.name) { ASOS.constants.custom.name = { }; }

if (!ASOS.constants.custom.transactionBodyfield) { ASOS.constants.custom.transactionBodyfield = { }; }

if (!ASOS.constants.custom.transactionBodyfield.value) { ASOS.constants.custom.transactionBodyfield.value = { }; }

if (!ASOS.constants.custom.custreccustomfield) { ASOS.constants.custom.custreccustomfield = { }; }

if (!ASOS.constants.custom.custreccustomfield.value) { ASOS.constants.custom.custreccustomfield.value = { }; }

ASOS.constants.custom.id.entityfield = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.itemfield = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.CRMfield = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.transactionBodyfield = {
	LIMAPO_SENT_TO_LIMA : 'custbodysend_to_lima'
};

ASOS.constants.custom.id.transactionColumnfield = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.otherfield = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.custrecCustomfield = {
	LIMAPO_LOG_DATE : 'custrecord_limapo_log_date',
	LIMAPO_LOG_SCRIPT_NAME : 'custrecord_limapo_log_scriptname',
	LIMAPO_LOG_KEY : 'custrecord_limapo_log_key',
	LIMAPO_LOG_VALUE : 'custrecord_limapo_log_value',
//	
	LIMAPO_CONFIG_DATE : 'custrecord_limapo_cfg_date',
	LIMAPO_CONFIG_TOKEN : 'custrecord_limapo_cfg_token',
	LIMAPO_CONFIG_REST_STATUS : 'custrecord_limapo_cfg_rest_status',
	LIMAPO_CONFIG_ALL_PORT_STATUS : 'custrecord_limapo_cfg_allport_status',
	LIMAPO_CONFIG_PO_UNMARK_STATUS : 'custrecord_limapo_cfg_unmrk_status',
	LIMAPO_CONFIG_LAST_SENT_PO_INTERNALID : 'custrecord_limapo_cfg_lastsent_id',
	LIMAPO_CONFIG_EXTERNALID : 'externalid',
	LIMAPO_CONFIG_INTERNALID : 'internalid',
//	
	LIMAPO_PAGE_PARENT_CONFIG_INTERNALID : 'custrecord_limapo_page_cfgid',
	LIMAPO_PAGE_ID : 'custrecord_limapo_page_id',
	LIMAPO_PAGE_POIDS : 'custrecord_limapo_page_poids',
};

ASOS.constants.custom.id.standardfield = {
		PURCHASE_ORDER_INTERNAL_ID : 'internalid',
		PURCHASE_ORDER_DATE_CREATED : 'datecreated',
		PURCHASE_ORDER_LAST_MODIFIED_DATE : 'lastmodifieddate'
};

ASOS.constants.custom.id.list = {
	test1 : 'test1',
	test2 : 'test2'
};

ASOS.constants.custom.id.recordtype = {
	LIMAPO_LOG: 'customrecord_limapo_log',
	LIMAPO_CONFIG : 'customrecord_limapo_cfg',
	LIMAPO_CONFIG_PAGE : 'customrecord_limapo_page'
};

ASOS.constants.custom.id.script = {
	LIMAPO_RES_SENDPO : 'customscript_limapo_res_sendpo',
	LIMAPO_SCH_MARKPO : 'customscript_limapo_sch_markpo',
	LIMAPO_SCH_EXIT : 'customscript_limapo_sch_exit',
	LIMAPO_UES_STOP_EDITED_PO_SAVE : 'customscript_ues_stop_edited_po_save',
	LIMAPO_UES_MAKRPO : 'customscript_limapo_ues_markpo',
};

ASOS.constants.custom.id.deploy = {
		LIMAPO_SCH_MARKPO : 'customdeploy_limapo_sch_markpo',
	};

ASOS.constants.custom.id.sublistkey = {
		PAGE_CONFIG_KEY : 'recmachcustrecord_limapo_page_cfgid'
};

ASOS.constants.custom.id.param = {
		PARAM_IS_RESCHEDULED : 'custscript_param_isrescheduled',
		PARAM_TOKEN_ID : 'custscript_param_tokenid',
		PARAM_LAST_READ_PO_INTERNAL_ID : 'custscript_param_lastreadpointernalid',
		PARAM_LOG_EXECUTION_STATUS_INTERNAL_ID : 'custscript_param_logexestatus_intid',
		PARAM_TOKEN_DATE :'custscript_param_configdate'
};

/**
 ****************************************************************************
 ** Name Constants
 ****************************************************************************
 **/
ASOS.constants.custom.name.script = {
		LIMAPO_RES_SENDPO : '[ASOS]_[RES]_limapo_send_PO',
		LIMAPO_SCH_MARKPO : '[ASOS]_[SCH]_limapo_mark_PO',
		LIMAPO_SCH_EXIT : '[ASOS]_[SCH]_limapo_exit',
		LIMAPO_UES_STOP_EDITED_PO_SAVE : 'customscript_ues_stop_edited_po_save',
		LIMAPO_UES_MAKRPO : '[ASOS]_[UES]_limapo_mark_PO',
};

/**
 ****************************************************************************
 ** Value Constants
 ****************************************************************************
 **/

ASOS.constants.custom.transactionBodyfield.value.LIMAPO_sent_to_lima = {
	YES : 'T',
	NO : 'F'
};

ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_key = {
	EXECUTION_LOG : 'Execution Log',
	CHECKPOINT_LOG : 'Checkpoint Log',
	START_TIME : 'Start Time',
	END_TIME : 'End Time',
	LAST_PROCESSED_INTERNALID : 'Last Processed Internal ID',
	NOTIFIED_USERS : 'Notified Users',
	EXECUTION_STATUS : 'Execution Status'

};

ASOS.constants.custom.custreccustomfield.value.LIMAPO_log_value_executionStatus = {
	INPROCESS : 'InProcess',
	NOTSTARTED : 'NotStarted',
	COMPLETED : 'Completed',
	ABORTED : 'Aborted',
	EXCEPTION : 'Exception'
};

ASOS.constants.custom.custreccustomfield.value.LIMAPO_config_restStatus = {
		INPROCESS : 'InProcess',
		NOTSTARTED : 'NotStarted',
		COMPLETED : 'Completed',
		ABORTED : 'Aborted',
		EXCEPTION : 'Exception'
};

ASOS.constants.custom.custreccustomfield.value.LIMAPO_config_allportStatus = {
		INPROCESS : 'InProcess',
		NOTSTARTED : 'NotStarted',
		COMPLETED : 'Completed',
		ABORTED : 'Aborted',
		EXCEPTION : 'Exception'
};

ASOS.constants.custom.custreccustomfield.value.LIMAPO_config_POUnmarkStatus = {
		INPROCESS : 'InProcess',
		NOTSTARTED : 'NotStarted',
		COMPLETED : 'Completed',
		ABORTED : 'Aborted',
		EXCEPTION : 'Exception'
};

ASOS.constants.custom.editmode = {
	CREATE : 'create',
	EDIT : 'edit'
};
