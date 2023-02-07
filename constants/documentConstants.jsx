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
            key: "signHereTabs",
            displayName: "Sign Here Tab",
            valueAccepted: false
        },
        {
            key: "initialHereTabs",
            displayName: "Initial Here Tab",
            valueAccepted: false
        },
        {
            key: "approveTabs",
            displayName: "Approve Tab",
            valueAccepted: false
        },
        {
            key: "dateSignedTabs",
            displayName: "Date Signed Tab",
            valueAccepted: false
        },
        {
            key: "titleTabs",
            displayName: "Title Tab",
            valueAccepted: false
        },
        {
            key: "textTabs",
            displayName: "Text Tab",
            valueAccepted: true
        },
        {
            key: "numberTabs",
            displayName: "Number Tab",
            valueAccepted: true
        },
        {
            key: "dateTabs",
            displayName: "Date Tab",
            valueAccepted: true
        },
        {
            key: "emailTabs",
            displayName: "Email Tab",
            valueAccepted: true
        },
        {
            key: "noteTabs",
            displayName: "Note Tab",
            valueAccepted: true
        },        
        {
            key: "firstNameTabs",
            displayName: "First Name Tab",
            valueAccepted: false
        },
        {
            key: "lastNameTabs",
            displayName: "Last Name Tab",
            valueAccepted: false
        },
        {
            key: "fullNameTabs",
            displayName: "Full Name Tab",
            valueAccepted: false
        },        
    ]

}