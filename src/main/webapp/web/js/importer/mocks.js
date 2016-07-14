var formsMock = function() {
    return {
        "code": 100,
        "message": "29 forms found.",
        "resultSet": {
            "headers": [{
                "label": "FormName",
                "type": "TEXT",
                "referencedData": []
            }, {
                "label": "FormVersion",
                "type": "NUMBER",
                "referencedData": []
            }, {
                "label": "DataLabel",
                "type": "TEXT",
                "referencedData": []
            }, {
                "label": "DataType",
                "type": "TEXT",
                "referencedData": []
            }, {
                "label": "DataOrder",
                "type": "NUMBER",
                "referencedData": []
            }, {
                "label": "IsReference",
                "type": "BOOLEAN",
                "referencedData": []
            }, {
                "label": "FormReferenced",
                "type": "TEXT",
                "referencedData": []
            }, {
                "label": "DataReferenced",
                "type": "TEXT",
                "referencedData": []
            }, {
                "label": "Min",
                "type": "NUMBER",
                "referencedData": []
            }, {
                "label": "Max",
                "type": "NUMBER",
                "referencedData": []
            }],
            "rows": [
                ["FORM_WITH_IMG", "1", "NAME", "TEXT", "0", "false", null, null, null, null],
                ["FORM_WITH_IMG", "1", "IMG", "IMAGE", "1", "false", null, null, null, null],
                ["cuba_team", "1", "id", "NUMBER", "0", "false", null, null, null, null],
                ["cuba_team", "1", "name", "TEXT", "1", "false", null, null, null, null],
                ["cuba_team", "1", "fnac", "DATE", "2", "false", null, null, null, null],
                ["projects", "1", "id", "NUMBER", "0", "false", null, null, null, null],
                ["projects", "1", "name", "TEXT", "1", "false", null, null, null, null],
                ["projects", "1", "project_leader", "TEXT", "2", "true", "cuba_team", "name", "0", "1"],
                ["MYTEST", "1", "MYNUM", "NUMBER", "0", "false", null, null, null, null],
                ["MYTEST", "1", "MYTEXT", "TEXT", "1", "false", null, null, null, null],
                ["MYTEST", "1", "MYBOOL", "BOOLEAN", "2", "false", null, null, null, null],
                ["SEX", "1", "SEX", "TEXT", "0", "false", null, null, null, null],
                ["GENDER_VALUES", "1", "GENDER", "TEXT", "0", "false", null, null, null, null],
                ["tickets", "1", "id", "NUMBER", "0", "false", null, null, null, null],
                ["tickets", "1", "description", "TEXT", "1", "false", null, null, null, null],
                ["tickets", "1", "project", "NUMBER", "2", "true", "projects", "id", "0", "1"],
                ["tickets", "1", "project", "TEXT", "3", "true", "projects", "name", "0", "1"],
                ["tickets", "1", "project", "TEXT", "4", "true", "projects", "project_leader", "0", "1"],
                ["Ramon", "1", "c1", "NUMBER", "0", "false", null, null, null, null],
                ["Ramon", "1", "foto", "IMAGE", "1", "false", null, null, null, null],
                ["Visitor", "1", "id", "NUMBER", "0", "false", null, null, null, null],
                ["Visitor", "1", "name", "TEXT", "1", "false", null, null, null, null],
                ["Visitor", "1", "country", "TEXT", "2", "false", null, null, null, null],
                ["Visitor", "1", "language", "TEXT", "3", "false", null, null, null, null],
                ["PEOPLE", "1", "name", "TEXT", "0", "false", null, null, null, null],
                ["PEOPLE", "1", "lastName", "TEXT", "1", "false", null, null, null, null],
                ["PEOPLE", "1", "email", "TEXT", "2", "false", null, null, null, null],
                ["PEOPLE", "1", "title", "TEXT", "3", "false", null, null, null, null],
                ["PEOPLE", "1", "picture", "TEXT", "4", "false", null, null, null, null],
                ["SUBSCRIPTIONS", "1", "name", "TEXT", "0", "false", null, null, null, null],
                ["SUBSCRIPTIONS", "1", "email", "TEXT", "1", "false", null, null, null, null],
                ["BOOKS", "1", "title", "TEXT", "0", "false", null, null, null, null],
                ["BOOKS", "1", "author", "TEXT", "1", "false", null, null, null, null],
                ["BOOKS", "1", "authorLink", "TEXT", "2", "false", null, null, null, null],
                ["BOOKS", "1", "summary", "TEXT", "3", "false", null, null, null, null],
                ["BOOKS", "1", "comments", "TEXT", "4", "false", null, null, null, null],
                ["BOOKS", "1", "level", "TEXT", "5", "false", null, null, null, null],
                ["BOOKS", "1", "audience", "TEXT", "6", "false", null, null, null, null],
                ["BOOKS", "1", "learnTip", "TEXT", "7", "false", null, null, null, null],
                ["BOOKS", "1", "picture", "TEXT", "8", "false", null, null, null, null],
                ["PEOPLE2", "1", "ID", "NUMBER", "0", "false", null, null, null, null],
                ["PEOPLE2", "1", "NAME", "TEXT", "1", "false", null, null, null, null],
                ["PEOPLE2", "1", "SEX1", "TEXT", "2", "true", "GENDER_VALUES", "GENDER", "0", "1"],
                ["PEOPLE2", "1", "SEX2", "TEXT", "3", "true", "SEX", "SEX", "0", "1"],
                ["FER", "1", "C1", "TEXT", "0", "false", null, null, null, null],
                ["CURRENCIES", "1", "CURRENCY", "TEXT", "0", "false", null, null, null, null],
                ["COUNTRIES", "1", "COUNTRY", "TEXT", "0", "false", null, null, null, null],
                ["BANKS", "1", "NAME", "TEXT", "0", "false", null, null, null, null],
                ["BANKS", "1", "COUNTRY", "TEXT", "1", "true", "COUNTRIES", "COUNTRY", "0", "1"],
                ["BANKS", "1", "ADDRESS", "TEXT", "2", "false", null, null, null, null],
                ["BANKS", "1", "CONTACT_PERSON", "TEXT", "3", "false", null, null, null, null],
                ["BANKS", "1", "TEL", "TEXT", "4", "false", null, null, null, null],
                ["BIKES", "1", "MAKE", "TEXT", "0", "false", null, null, null, null],
                ["BIKES", "1", "YEAR", "NUMBER", "1", "false", null, null, null, null],
                ["BIKES", "1", "ID", "NUMBER", "2", "false", null, null, null, null],
                ["BIKES", "1", "NAME", "TEXT", "3", "false", null, null, null, null],
                ["ORGANIZATIONS", "1", "NAME", "TEXT", "0", "false", null, null, null, null],
                ["ORGANIZATIONS", "1", "ADDRESS", "TEXT", "1", "false", null, null, null, null],
                ["ORGANIZATIONS", "1", "COUNTRY", "TEXT", "2", "true", "COUNTRIES", "COUNTRY", "0", "1"],
                ["ASSOCIATED_CONSULTANTS", "1", "NAME", "TEXT", "0", "false", null, null, null, null],
                ["ASSOCIATED_CONSULTANTS", "1", "BIRTHDATE", "DATE", "1", "false", null, null, null, null],
                ["ASSOCIATED_CONSULTANTS", "1", "STARTDATE", "DATE", "2", "false", null, null, null, null],
                ["ASSOCIATED_CONSULTANTS", "1", "ENDDATE", "DATE", "3", "false", null, null, null, null],
                ["ACCOUNTS", "1", "BANK", "TEXT", "0", "true", "BANKS", "NAME", "0", "1"],
                ["ACCOUNTS", "1", "CURRENCY", "TEXT", "1", "true", "CURRENCIES", "CURRENCY", "0", "1"],
                ["ACCOUNTS", "1", "AMOUNT", "NUMBER", "2", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "DAY", "DATE", "0", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "ACCOUNT", "TEXT", "1", "true", "ACCOUNTS", "BANK", "0", "1"],
                ["TRANSACTIONS", "1", "ACCOUNT", "TEXT", "2", "true", "ACCOUNTS", "CURRENCY", "0", "1"],
                ["TRANSACTIONS", "1", "DESCRIPTION", "TEXT", "3", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "DEBIT", "NUMBER", "4", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "CREDIT", "NUMBER", "5", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "DEBIT_ESTIMATED", "NUMBER", "6", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "CREDIT_ESTIMATED", "NUMBER", "7", "false", null, null, null, null],
                ["TRANSACTIONS", "1", "ORG", "TEXT", "8", "true", "ORGANIZATIONS", "NAME", "0", "1"],
                ["TRANSACTIONS", "1", "CONSULTANT", "TEXT", "9", "true", "ASSOCIATED_CONSULTANTS", "NAME", "0", "1"],
                ["MIFORMCONDECIMALES", "1", "NUM1", "NUMBER", "0", "false", null, null, null, null],
                ["MIFORMCONDECIMALES2", "1", "NUM2", "NUMBER", "0", "true", "MIFORMCONDECIMALES", "NUM1", "0", "1"],
                ["MARCOS_FANS", "1", "ID", "NUMBER", "0", "false", null, null, null, null],
                ["MARCOS_FANS", "1", "NAME", "TEXT", "1", "false", null, null, null, null],
                ["SYNCHRONIT_TEAM", "1", "ID", "NUMBER", "0", "false", null, null, null, null],
                ["SYNCHRONIT_TEAM", "1", "NAME", "TEXT", "1", "false", null, null, null, null],
                ["SYNCHRONIT_TEAM", "1", "BIRTHDAY", "DATE", "2", "false", null, null, null, null],
                ["SYNCHRONIT_TEAM", "1", "CELLPHONE", "TEXT", "3", "false", null, null, null, null],
                ["SYNCHRONIT_TEAM", "1", "PICTURE", "TEXT", "4", "false", null, null, null, null],
                ["SYNCHRONIT_QUESTIONS", "1", "QUESTION", "TEXT", "0", "false", null, null, null, null],
                ["SYNCHRONIT_ANSWERS", "1", "PEOPLE", "NUMBER", "0", "true", "SYNCHRONIT_TEAM", "ID", "0", "1"],
                ["SYNCHRONIT_ANSWERS", "1", "PEOPLE", "TEXT", "1", "true", "SYNCHRONIT_TEAM", "NAME", "0", "1"],
                ["SYNCHRONIT_ANSWERS", "1", "QUESTION", "TEXT", "2", "true", "SYNCHRONIT_QUESTIONS", "QUESTION", "0", "1"],
                ["SYNCHRONIT_ANSWERS", "1", "RESPONSE", "TEXT", "3", "false", null, null, null, null],
                ["FORM_WITH_FILE", "1", "NAME", "TEXT", "0", "false", null, null, null, null],
                ["FORM_WITH_FILE", "1", "MYFILE", "FILE", "1", "false", null, null, null, null]
            ]
        },
        "debugInfo": []
    }
}

var formDataMock = function(formName) {
    switch (formName) {
        case 'T_TEST':
            return {
                "code": 100,
                "message": "3 rows found.",
                "resultSet": {
                    "headers": [{
                        "label": "field1",
                        "type": "TEXT",
                        "referencedData": []
                    }, {
                        "label": "field2",
                        "type": "NUMBER",
                        "referencedData": []
                    }, {
                        "label": "field3",
                        "type": "BOOLEAN",
                        "referencedData": []
                    }],

                    "rows": [
                        ["credit-suize", "0", "false"],
                        ["credit-suize1", "0", "false"],
                        ["credit-suize2", "0", "false"],
                    ]
                },
                "debugInfo": []
            }
        case 'MAPPING':
            return {
                "code": 100,
                "message": "3 rows found.",
                "resultSet": {
                    "headers": [{
                        "label": "SOURCE_NAME",
                        "type": "TEXT",
                        "referencedData": []
                    }, {
                        "label": "FILE_TYPE",
                        "type": "TEXT",
                        "referencedData": []
                    }, {
                        "label": "FORM_NAME",
                        "type": "TEXT",
                        "referencedData": []
                    }, {
                        "label": "IS_FIRST_COL_HEAD",
                        "type": "BOOLEAN",
                        "referencedData": []
                    }],

                    "rows": [
                        ["credit-suize", "csv", "MAPPING", false],
                        ["credit-suize2", "csv", "MAPPING", false]
                    ]
                },
                "debugInfo": []
            }

        default:
            {
                return '';
            }
    }
};