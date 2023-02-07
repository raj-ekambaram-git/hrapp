export const ESIGN_TABS_KEYS= {
    signHereTabs: "signHereTabs",
    initialHereTabs: "initialHereTabs",
    approveTabs: "approveTabs",
    dateSignedTabs: "dateSignedTabs",
    titleTabs: "titleTabs",
    textTabs: "textTabs",
    numberTabs: "numberTabs",
    dateTabs: "dateTabs",
    emailTabs: "emailTabs",
    noteTabs: "noteTabs",
    firstNameTabs: "firstNameTabs",
    lastNameTabs: "lastNameTabs",
    fullNameTabs: "fullNameTabs",
}

export const DocumentConstants = {
    DOCUMENMT_TYPE: {
        "Timesheet": 'Timesheet',
        'Account': 'Account',
        'Vendor': 'Vendor',
        'Invoice': 'Invoice',
        'Project': 'Project',
        'User': 'User',
        "TimesheetEntry": "TimesheetEntry",
        "TimesheetApproval": "TimesheetApproval",
        "Template": "Template",
    },
    DOCUMENT_STATUS: {
        "Active": "Active",
        "Inactive": "Inactive",
        "Delete": "Delete",

    },
    ESIGN_AVAILABLE_TABS: [
        {
            key: ESIGN_TABS_KEYS.signHereTabs,
            displayName: "Sign Here Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.initialHereTabs,
            displayName: "Initial Here Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.approveTabs,
            displayName: "Approve Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.dateSignedTabs,
            displayName: "Date Signed Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.titleTabs,
            displayName: "Title Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.textTabs,
            displayName: "Text Tab",
            valueAccepted: true
        },
        // {
        //     key: ESIGN_TABS_KEYS.numberTabs,
        //     displayName: "Number Tab",
        //     valueAccepted: true
        // },
        // {
        //     key: ESIGN_TABS_KEYS.dateTabs,
        //     displayName: "Date Tab",
        //     valueAccepted: true
        // },
        {
            key: ESIGN_TABS_KEYS.emailTabs,
            displayName: "Email Tab",
            valueAccepted: true
        },
        {
            key: ESIGN_TABS_KEYS.noteTabs,
            displayName: "Note Tab",
            valueAccepted: true
        },        
        {
            key: ESIGN_TABS_KEYS.firstNameTabs,
            displayName: "First Name Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.lastNameTabs,
            displayName: "Last Name Tab",
            valueAccepted: false
        },
        {
            key: ESIGN_TABS_KEYS.fullNameTabs,
            displayName: "Full Name Tab",
            valueAccepted: false
        },        
    ],

}