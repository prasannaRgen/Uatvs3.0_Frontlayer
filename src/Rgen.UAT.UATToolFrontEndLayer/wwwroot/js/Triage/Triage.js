/* Copyright © 2012 RGen Solutions . All Rights Reserved.
   Contact : support@rgensolutions.com 
*/

var TestCasecount = 0;
function CreateExcelSheet() {
    if (Triage.validation()) {
        if ($('#projSelect').val() == "select") {
            $('#dialog').text('Please select ' + Triage.gConfigProject);
            $('#dialog').dialog({ height: 125, modal: true, title: "Triage", buttons: { "Ok": function () { $(this).dialog("close"); } } });
            Main.hideLoading();

        }
        else {
            Main.showLoading();

            if (Triage.isPortfolioOn) {
                var proj = $('#versionSelect option:selected').val();
            }
            else {
                var proj = $('#projSelect option:selected').val();
            }

            Triage.getExportTable(proj);
            window.setTimeout("Main.hideLoading()", 400);
        }
    }
    else
        Main.hideLoading();
}

var Triage = {
    SiteURL: $().SPServices.SPGetCurrentSite(),
    ScenarioInfo: "",
    gTestPassID: "",
    col: 4,
    Page: new Array(),
    //RoleNameForRoleID:new Array(),
    sBulleteChar: 'Ø,v,ü',   //Added by Nikhil
    prjctDescForPID: new Array(),
    noTCAvailable: 0,
    allTestPass: [],
    TPIDForTSID: new Array(),
    testStepDate: new Array(), // Added by shilpa

    //Portfolio Variable
    getVerByProjName: new Array(),
    isPortfolioOn: false,
    getProjectNameByPid: new Array(),

    imageURL: "",
    ForPIDGetDetails: new Array(),//:SD
    RolesForSPUserID: new Array(),//:SD
    RoleNameForRoleID: new Array(),//:SD
    ForTPIDGetDetails: new Array(),//:SD

    gTesterRoleList: new Array(),// added by Rasika
    gTestPassList: new Array(),// added by Rasika
    testStepList: new Array(), // added by Rasika
    testStepListMapping: new Array(), // added by Rasika
    testStepListIndex: 0,// added by Rasika


    //Variable defined for Auto SUggestion 
    hdn_SpuserId: '',
    owner: '',
    hdn_EmailId: '',
    hdn_alias: '',
    setOwnerValue: function () {
        var ele = $('#Auto_Hdn').val();
        if (ele.trim() != '') {
            hdn_SpuserId = ele.split('|')[1]
            ownerName = ele.split('|')[0]
            hdn_EmailId = ele.split('|')[2]
            hdn_alias = "i:0#.f|membership|" + ele.split('|')[2]
            gPrincipalType = 'User'
        }
    },


    /******Variable defined for resource file by Mohini*******/
    gConfigProject: 'Project',
    gConfigTestPass: 'Test Pass',
    gConfigTestStep: 'Test Step',
    gConfigTestCase: 'Test Case',
    gConfigTester: 'Tester',
    gConfigAction: 'Action',
    gConfigTemplate: 'Template',
    gConfigStartDate: 'Start Date',
    gConfigEndDate: 'End Date',
    gConfigStatus: 'Status',
    gConfigLead: 'Lead',
    gConfigManager: 'Manager',
    gConfigRole: 'Role',
    gConfigSequence: 'Sequence',
    gConfigExpectedResult: 'Expected Result',
    gConfigActualresult: 'Actual Result',
    gConfigTriage: 'Triage',
    gConfigVersion: 'Version',
    gConfigTestManager: 'Test Manager',
    glblBug: '',
    glblvstfb: '',
    onLoadgss: new Array(),
    gPageIndex: 0,
    init: function () {

        /*******Added by Mohini For resource file*********/
        if (resource.isConfig.toLowerCase() == 'true') {
            Triage.gConfigProject = resource.gPageSpecialTerms['Project'] == undefined ? 'Project' : resource.gPageSpecialTerms['Project'];
            Triage.gConfigTestPass = resource.gPageSpecialTerms['Test Pass'] == undefined ? 'Test Pass' : resource.gPageSpecialTerms['Test Pass'];
            Triage.gConfigTestCase = resource.gPageSpecialTerms['Test Case'] == undefined ? 'Test Case' : resource.gPageSpecialTerms['Test Case'];
            Triage.gConfigTestStep = resource.gPageSpecialTerms['Test Step'] == undefined ? 'Test Step' : resource.gPageSpecialTerms['Test Step'];
            Triage.gConfigTester = resource.gPageSpecialTerms['Tester'] == undefined ? 'Tester' : resource.gPageSpecialTerms['Tester'];
            Triage.gConfigAction = resource.gPageSpecialTerms['Action'] == undefined ? 'Action' : resource.gPageSpecialTerms['Action'];
            Triage.gConfigTemplate = resource.gPageSpecialTerms['Template'] == undefined ? 'Template' : resource.gPageSpecialTerms['Template'];
            Triage.gConfigStartDate = resource.gPageSpecialTerms['Start Date'] == undefined ? 'Start Date' : resource.gPageSpecialTerms['Start Date'];
            Triage.gConfigEndDate = resource.gPageSpecialTerms['End Date'] == undefined ? 'End Date' : resource.gPageSpecialTerms['End Date'];
            Triage.gConfigStatus = resource.gPageSpecialTerms['Status'] == undefined ? 'Status' : resource.gPageSpecialTerms['Status'];
            Triage.gConfigLead = resource.gPageSpecialTerms['Lead'] == undefined ? 'Lead' : resource.gPageSpecialTerms['Lead'];
            Triage.gConfigManager = resource.gPageSpecialTerms['Test Manager'] == undefined ? 'Test Manager' : resource.gPageSpecialTerms['Test Manager'];
            Triage.gConfigRole = resource.gPageSpecialTerms['Role'] == undefined ? 'Role' : resource.gPageSpecialTerms['Role'];
            Triage.gConfigSequence = resource.gPageSpecialTerms['Sequence'] == undefined ? 'Sequence' : resource.gPageSpecialTerms['Sequence'];
            Triage.gConfigExpectedResult = resource.gPageSpecialTerms['Expected Result'] == undefined ? 'Expected Result' : resource.gPageSpecialTerms['Expected Result'];
            Triage.gConfigActualresult = resource.gPageSpecialTerms['Actual Result'] == undefined ? 'Actual Result' : resource.gPageSpecialTerms['Actual Result'];
            Triage.gConfigTriage = resource.gPageSpecialTerms['Triage'] == undefined ? 'Triage' : resource.gPageSpecialTerms['Triage'];
            Triage.gConfigVersion = resource.gPageSpecialTerms['Version'] == undefined ? 'Version' : resource.gPageSpecialTerms['Version'];
            Triage.gConfigTestManager = resource.gPageSpecialTerms['Test Manager'] == undefined ? 'Test Manager' : resource.gPageSpecialTerms['Test Manager'];
        }

        //For bug id 11779 Mohini Dt:14-05-2014
        Triage.glblBug = $('#bug').text().substr(0, $('#bug').text().length - 2);
        Triage.glblvstfb = $('#vstfb').text().substr(0, $('#vstfb').text().length - 2);
        $('#FailTPmg').html("<b>Note:</b> This page shows only all &#39;Fail&#39; results for all " + Triage.gConfigTestPass + "es.");
        /*************************************/
        $('#versionSelect').html('<option>Select ' + Triage.gConfigVersion + '</option>');
        /****************************************/

        try {

            $("ul li a:eq(7)").attr('class', 'selHeading');

            $("a [title='Check Names']").hide();
            if (isRootWeb)
                $("#closedDate").datepicker({
                    minDate: 0,
                    showOn: "button",
                    buttonImage: "/css/theme/" + themeColor + "/images/Calendar-Logo.gif",
                    buttonImageOnly: true,
                    dateFormat: "mm/dd/yy", changeMonth: true, changeYear: true
                });
            else
                $("#closedDate").datepicker({
                    minDate: 0,
                    showOn: "button",
                    buttonImage: "/css/theme/" + themeColor + "/images/Calendar-Logo.gif",
                    buttonImageOnly: true,
                    dateFormat: "mm/dd/yy", changeMonth: true, changeYear: true
                });

            $(".ui-datepicker-trigger").css('margin-left', '10px');
            $(".ui-datepicker-trigger").attr('title', 'Select Date'); //added by shilpa
            $(".ms-inputuserfield").css("border", "1px #ccc solid"); // for bug 6199

            /****Added by Mohini for resource flie******/
            $('#hTestCase').html(Triage.gConfigTestStep + '(s)');
            $('#hTestPass').html(Triage.gConfigTestPass + ' Details');
            /*******************/

            //Fill Project DropDown
            Triage.fillProjectDDPortfolio();

            var splitUrl = window.location.href.split("?");
            var pid = "";
            var tpid = "";
            var ver = "";

            if (splitUrl[1] != null || splitUrl[1] != undefined) {
                if (splitUrl[1].indexOf('&') != -1) {
                    var splitUrlAmp = splitUrl[1].split("&");

                    pid = $.trim(splitUrlAmp[0].split("=")[1]);
                    tpid = $.trim(splitUrlAmp[1].split("=")[1]);
                }
            }
            if (pid != "") {

                $('#projectName').text(Triage.gConfigProject + ' -');//Added by Mohini for Resource flie
                $('#projectName').append('<span>(#ID: )</span)');
                $('#projDesc').empty();
                $('#scenSelect').empty();

                $('#thisScenario').empty();
                $('#tester').empty();
                //$('#scenario').empty();
                $("#Pagination").hide();
                $("#testStepDetails").empty();

                $('#hTestCase').hide();
                $('#dvProjectDetails').hide();

                $('#projectName').text(Triage.gConfigProject + ' -' + $("#projSelect option:selected").attr("title"));//Added by Mohini for Resource flie
                $('#projectName').attr('title', $("#projSelect option:selected").attr("title"));
                $('#projectName').append('<span>(#ID: ' + pid + ')</span)');

            }

            if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
            {
                //Code for Portfolio changes :Ejaz Waquif DT:1/23/2014
                var NoOfVer = 0;
                var data = Triage.getVerByProjName[$('#projSelect option:selected').attr("title")];
                if (data != undefined)
                    NoOfVer = data.length;

                var verOptions = '';

                for (var i = 0; i < NoOfVer; i++) {
                    verOptions += '<option value="' + data[i]["ProjectID"] + '">' + data[i]["Version"] + '</option>'
                }
                if (verOptions == "" && $("#projSelect option:selected").text() != "Select " + Triage.gConfigProject && $("#projSelect option:selected").text() != "No " + Triage.gConfigProject + " 					Available")//modify by Mohini DT:`4-05-2014
                    verOptions = '<option>Default ' + Triage.gConfigVersion + '</option>';
                else {
                    if ($("#projSelect option:selected").text() != "No " + Triage.gConfigProject + " Available")
                        verOptions = '<option>Select ' + Triage.gConfigVersion + '</option>';
                    else
                        verOptions = '<option>No ' + Triage.gConfigVersion + ' Available</option>';
                }

                $("#versionSelect").html(verOptions);
                //End of Code for Portfolio changes :Ejaz Waquif DT:1/23/2014

                //code added by Ejaz Waquif for Portfolio DT2/12/2014
                if (ver != "")
                    $("#versionSelect option[value='" + ver + "']").attr("selected", "selected");
            }

            if ($('#projSelect').val() == "select") {
                $('#scenSelect').append('<option value="0">Select ' + Triage.gConfigTestPass + '</option>');//Added by Mohini for Resource flie
                $('#tester').append('<option value="0">Select ' + Triage.gConfigTester + '</option>');//Added by Mohini for Resource flie	
                $('#roleList').html('<option value="0" selected="selected">Select ' + Triage.gConfigRole + '</option>');//:SD     
            }

            //On Change Project Area Fill 
            $('#projSelect').change(function (e) {

                Triage.allTestPass = new Array();
                var selected = this.value;
                if (selected == 'select') {
                    //$('#projectName').text('Project -');
                    $('#projectName').text(Triage.gConfigProject + ' -');//Added by Mohini for Resource flie
                    $('#projectName').append('<span>(#ID: )</span)');
                    $('#projDesc').empty();
                    $('#scenSelect').val(0);
                    $('#thisScenario').empty();
                    $('#tester').val(0);
                    //$('#scenario').empty();
                    $("#Pagination").hide();
                    $("#testStepDetails").empty();

                    //For Role dropdown:SD
                    $('#roleList').empty();
                    $('#roleList').html('<option value="0" selected="selected">Select ' + Triage.gConfigRole + '</option>');
                    //Added by HRW
                    //$('#scenSelect').html('<option value="0" selected="selected">Select Test Pass</option>');
                    $('#scenSelect').html('<option value="0" selected="selected">Select ' + Triage.gConfigTestPass + '</option>');//Added by Mohini for Resource flie

                    //$('#tester').html('<option value="0" selected="selected">Select Tester</option>');
                    $('#tester').html('<option value="0" selected="selected">Select ' + Triage.gConfigTester + '</option>');//Added by Mohini for Resource flie
                    $('#versionSelect').html('<option value="0" selected="selected">Select ' + Triage.gConfigVersion + '</option>');

                    $('#hTestCase').hide();
                    $('#dvProjectDetails').hide();
                }
                else {
                    if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
                    {
                        //Code for Portfolio changes :Ejaz Waquif DT:1/23/2014
                        var NoOfVer = 0;
                        var data = Triage.getVerByProjName[$('#projSelect option:selected').attr("title")];
                        if (data != undefined)
                            NoOfVer = data.length;

                        var verOptions = '';

                        for (var i = 0; i < NoOfVer; i++) {
                            verOptions += '<option value="' + data[i]["ProjectID"] + '">' + data[i]["Version"] + '</option>'
                        }

                        if (verOptions == "")
                            verOptions = '<option>Default ' + Triage.gConfigVersion + '</option>';

                        $("#versionSelect").html(verOptions);
                        //End of Code for Portfolio changes :Ejaz Waquif DT:1/23/2014
                    }


                    //Code Modified By swapnil kamle on 2/8/2012
                    //$('#projectName').text('Project -');
                    $('#projectName').text(Triage.gConfigProject + ' -');//Added by Mohini for Resource flie
                    $('#projectName').append('<span>(#ID: )</span)');
                    $('#projDesc').empty();
                    $('#scenSelect').empty();

                    $('#thisScenario').empty();
                    $('#tester').empty();
                    //$('#scenario').empty();
                    $("#Pagination").hide();
                    $("#testStepDetails").empty();

                    $('#hTestCase').hide();
                    $('#dvProjectDetails').hide();

                    $('#projectName').text(Triage.gConfigProject + ' -' + this.options[this.selectedIndex].title);//Added by Mohini for Resource flie
                    $('#projectName').attr('title', this.options[this.selectedIndex].title);
                    $('#projectName').append('<span>(#ID: ' + this.value + ')</span)');

                    if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
                        Triage.getScenarios($("#versionSelect option:selected").val());
                    else
                        Triage.getScenarios($("#projSelect option:selected").val());

                    /* Added for prj desc */
                    var projectDesc = Triage.prjctDescForPID[selected];
                    if (projectDesc == '-' || projectDesc == undefined || projectDesc == "")
                        projectDesc = 'No Description Available';
                    $('#projDesc').text(projectDesc);
                    /* */

                    Triage.getTester($('#scenSelect option:selected').val());
                }
            });
            //End On Change Project Area Fill

            //On Change project version Area Fill
            $("#versionSelect").change(function () {

                Triage.getScenarios($("#versionSelect option:selected").val());

                Triage.getTester($('#scenSelect option:selected').val());

                $('#projectName').text('Project -');
                $('#projectName').append('<span>(#ID: )</span)');
                $('#projDesc').empty();
                //$('#scenSelect').empty();

                $('#thisScenario').empty();
                //$('#tester').empty();
                //$('#scenario').empty();
                $("#Pagination").hide();
                $("#testStepDetails").empty();

                $('#hTestCase').hide();
                $('#dvProjectDetails').hide();
            });


            //On Change Scenario Area Fill
            $('#scenSelect').change(function (e) {
                var selectedScenario = this.value;
                if (selectedScenario == 'select') {
                    // alert('select scenario');
                }
                else {
                    Triage.getTester($('#scenSelect option:selected').val());

                }
            });
            //End On Change Scenario Area Fill

            //On Tester change fill roles:SD
            $('#tester').change(function (e) {
                try {
                    $("#roleList").empty();
                    var temp = '<option value="' + 0 + '">All ' + Triage.gConfigRole + '</option>';
                    $('#roleList').append(temp);

                    if ($("#tester").val() == 0) {
                        var roleIDs = new Array();
                        for (var ii = 1; ii < $('#tester option').length; ii++) {
                            var roles = Triage.RolesForSPUserID[$('#tester option').eq(ii).val()].toString().split(",");
                            for (var i = 0; i < roles.length; i++) {
                                if ($.inArray(roles[i], roleIDs) == -1) {
                                    var temp = '<option title="' + Triage.RoleNameForRoleID[roles[i]] + '" 								                                 value="' + roles[i] + '">' + trimText(Triage.RoleNameForRoleID[roles[i]].toString(), 16) + '</option>';
                                    $("#roleList").append(temp);
                                    roleIDs.push(roles[i]);
                                }
                            }
                        }
                    }
                    else if ($("#tester").val() != 0) {
                        var roleIDs = new Array();
                        var roles = Triage.RolesForSPUserID[$("#tester").val()].toString().split(",");
                        for (var i = 0; i < roles.length; i++) {
                            if ($.inArray(roles[i], roleIDs) == -1) {
                                var temp = '<option title="' + Triage.RoleNameForRoleID[roles[i]] + '" value="' + roles[i] + '">' + trimText(Triage.RoleNameForRoleID[roles[i]].toString(), 16) + '</option>';
                                $("#roleList").append(temp);
                                roleIDs.push(roles[i]);
                            }
                        }
                    }
                }
                catch (e) {

                }
            });


        } catch (e) { }
        if (pid != "") {
            $("#projSelect [title='" + Triage.getProjectNameByPid[pid][0] + "']").attr("selected", "selected");
            $("#projSelect").change();
            if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
            {
                $("#versionSelect [value='" + pid + "']").attr("selected", "selected");
                $("#versionSelect").change();
            }
            $("#scenSelect [value='" + tpid + "']").attr("selected", "selected");
            $("#scenSelect").change();
            Triage.showTesterData();

        }

    },

    fillProjectDDPortfolio: function () {
        try {
            var temp = '';
            var projectName = '';
            var projectDD = new Array();
            var ProjectNames = new Array();

            //To clear global variable:SD
            if (Triage.ForPIDGetDetails != undefined)
                Triage.ForPIDGetDetails.splice(0, Triage.ForPIDGetDetails.length);

            $('#projSelect').empty();
            temp = '<option value="select">Select ' + Triage.gConfigProject + '</option>';//Added by Mohini for resource File
            $('#projSelect').append(temp);

            var result = ServiceLayer.GetData("GetTestPassTriagePage", null, "Triage");

            if (result != undefined)
                $.merge(ProjectNames, result);

            //if((ProjectNames != undefined) && (ProjectNames!= null))
            if (ProjectNames.length != 0) {
                var PIDS = new Array();
                var tempProjName = new Array();
                var projectID = '';

                for (var i = 0; i < ProjectNames.length ; i++) {
                    projectID = ProjectNames[i]['projectId'];
                    Triage.prjctDescForPID[projectID] = ProjectNames[i]['projectDescription'];

                    if ($.inArray(projectID, PIDS) == -1) {
                        PIDS.push(projectID);
                        projectName = ProjectNames[i]['projectName'].toString();

                        sProNameTrimed = trimText(projectName, 32);
                        temp = '<option title="' + projectName + '" value="' + projectID + '">' + sProNameTrimed + '</option>';

                        Triage.getProjectNameByPid[projectID] = new Array();
                        Triage.getProjectNameByPid[projectID].push(projectName);


                        //Code for portfolio changes :Ejaz Waquif DT:1/23/2014
                        if ($.inArray(projectName, tempProjName) == -1) {
                            tempProjName.push(projectName);
                            if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
                            {
                                //To set project version list by project name 		                            
                                var version = ProjectNames[i]['projectVersion'] == null || ProjectNames[i]['projectVersion'] == undefined ? "Default " + Triage.gConfigVersion : ProjectNames[i]['projectVersion'];//Added by Mohini for Resource file
                                Triage.getVerByProjName[ProjectNames[i]['projectName']] = new Array();
                                Triage.getVerByProjName[ProjectNames[i]['projectName']].push({
                                    "Version": version,
                                    "ProjectID": ProjectNames[i]['projectId']

                                });

                                //To set testpass list by project id	
                                var testPassList = ProjectNames[i]['testPassList'] == null || ProjectNames[i]['testPassList'] == undefined ? "Default " + Triage.gConfigTestPass : ProjectNames[i]['testPassList'];

                                Triage.gTestPassList[ProjectNames[i]['projectId']] = new Array();
                                Triage.gTestPassList[ProjectNames[i]['projectId']].push({

                                    "ProjectName": ProjectNames[i]['projectName'],
                                    "TestPassList": testPassList

                                });
                            }
                            $('#projSelect').append(temp);

                        }
                        else {
                            if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
                            {
                                //To set project version list by project name
                                var version = ProjectNames[i]['projectVersion'] == null || ProjectNames[i]['projectVersion'] == undefined ? "Default " + Triage.gConfigVersion : ProjectNames[i]['projectVersion'];//Added by Mohini for Resource file

                                Triage.getVerByProjName[ProjectNames[i]['projectName']].push({
                                    "Version": version,
                                    "ProjectID": ProjectNames[i]['projectId']

                                });

                                //To set testpass list by project id
                                var testPassList = ProjectNames[i]['testPassList'] == null || ProjectNames[i]['testPassList'] == undefined ? "Default " + Triage.gConfigTestPass : ProjectNames[i]['testPassList'];
                                Triage.gTestPassList[ProjectNames[i]['projectId']] = new Array();
                                Triage.gTestPassList[ProjectNames[i]['projectId']].push({

                                    "ProjectName": ProjectNames[i]['projectName'],
                                    "TestPassList": testPassList

                                });
                            }

                        }
                        //End of Code for portfolio changes :Ejaz Waquif DT:1/23/2014
                    }

                    //To keep project details in global variable as per projectId :SD
                    Triage.ForPIDGetDetails[ProjectNames[i]['projectId']] = ProjectNames[i];
                }
            }
            if (ProjectNames.length == 0) // shilpa 30 apr bug 7843
            {
                $('#projSelect').html('<option>No ' + Triage.gConfigProject + ' Available</option>');
                $('#scenSelect').html('<option>No ' + Triage.gConfigTestPass + ' Available</option>');
                $('#tester').html('<option>No ' + Triage.gConfigTester + ' Alloted</option>');
                $('#roleList').html('<option value="0" selected="selected">No ' + Triage.gConfigRole + '</option>'); //added by Rasika

            }
        }
        catch (e) { }
    },

    // get All Test Passes for drop down
    getScenarios: function (selected) {
        try {
            var temp = '';
            var TPName = '';
            var TPID = new Array();

            var securityIdsForProject = new Array();
            $('#scenSelect').empty();
            Triage.allTestPass = new Array();

            var ScenarioItems = Triage.gTestPassList[selected];
            if ((ScenarioItems != undefined) && (ScenarioItems != null)) {
                if (ScenarioItems[0]['TestPassList'].length != 0) {
                    $('#scenSelect').append('<option value="0">All ' + Triage.gConfigTestPass + '</option>');//Added by Mohini for Resource flie

                    //Triage.allTestPass = new Array();
                    for (var ii = 0; ii < ScenarioItems[0]['TestPassList'].length; ii++) {
                        TPID = ScenarioItems[0]['TestPassList'][ii].testpassId;
                        TPName = ScenarioItems[0]['TestPassList'][ii].testpassName;
                        tpNameTrimed = trimText(TPName, 32);
                        temp = '<option title="' + TPName + '" value="' + TPID + '">' + tpNameTrimed + '</option>';

                        $('#scenSelect').append(temp);

                        //code added by Ejaz Waquif to fill all TP in one array DT:1/2/2014
                        //Triage.allTestPass.push(TPID+","+TPName);

                        Triage.ForTPIDGetDetails[ScenarioItems[0]['TestPassList'][ii].testpassId] = ScenarioItems[0]['TestPassList'][ii];//:SD

                        //To collect tester with their role by testPassId
                        Triage.gTesterRoleList[TPID] = new Array();
                        Triage.gTesterRoleList[TPID].push({
                            "testpassId": ScenarioItems[0]['TestPassList'][ii].testpassId,
                            "testpassName": ScenarioItems[0]['TestPassList'][ii].testpassName,
                            "tester": ScenarioItems[0]['TestPassList'][ii].tester
                        });
                    }

                    //$('#tester').append('<option value="0">Select Tester</option>');
                    $('#tester').append('<option value="0">Select ' + Triage.gConfigTester + '</option>');//Added by Mohini for Resource flie
                }
                else {
                    $('#scenSelect').append('<option value="0">No ' + Triage.gConfigTestPass + ' Available</option>');//Added by Mohini for Resource flie
                    $('#tester').append('<option value="0">No ' + Triage.gConfigTester + ' Alloted</option>');//Added by Mohini for Resource flie	
                }

            }
            else {
                $('#scenSelect').append('<option value="0">No ' + Triage.gConfigTestPass + ' Available</option>');//Added by Mohini for Resource flie
                $('#tester').append('<option value="0">No ' + Triage.gConfigTester + ' Alloted</option>');//Added by Mohini for Resource flie	         
            }

        } catch (e) { }
    },
    // get tester for selected testpass
    getTester: function (selected) {
        try {
            $('#tester').empty();
            var temp = '';
            var TesterID = '';
            var TesterName = '';
            var TesterList = '';
            var TesterQuery = '';
            var TesterItems = new Array();
            var RoleList = '';//:SD
            var testerIDArr = new Array();//:SD
            var roleIDArr = new Array();//:SD

            var gTesterList = new Array();//Added by rasika

            /* if(selected!='0' && selected!=0)
             {
                 //Collect tester and their roles of the selected test passes 
                 if(Triage.gTesterRoleList[selected]!=undefined)
                 {
                     gTesterList.push(Triage.gTesterRoleList[selected]);
                 }
 
             }
             else
             {
                 //Collect tester and their roles of all the test passes present in drop-down
                 $('#scenSelect option').each(function (ind, itm)
                 {
                        var value = itm.value;
                        if(Triage.gTesterRoleList[value]!=undefined)
                        {
                             gTesterList.push(Triage.gTesterRoleList[value]);
                        }
                
                 });
 
             }
             
            if(gTesterList.length!=0)
            {
                 //To collect tester list of selected test pass
                 if(selected!='0' && selected!=0)
                 {
                         var count=0;     	
                         if(gTesterList[0][0]['testpassId']==selected)
                         {
                             for(var j=0;j<gTesterList[0][0]['tester'].length;j++)
                             {
                                 TesterItems[count]=gTesterList[0][0]['tester'][j];
                                 count++;
 
                             }
                         }
                 }
                 else
                 {
                     var count=0;
                     for(var i=0;i<gTesterList.length;i++)
                     {	
                             for(var j=0;j<gTesterList[i][0]['tester'].length;j++)
                             {
                                 TesterItems[count]=gTesterList[i][0]['tester'][j];
                                 count++;
                             }
                     }
                 }
             }*/

            if (selected != '0' && selected != 0) {
                //Collect tester and their roles of the selected test passes 
                if (Triage.gTesterRoleList[selected] != undefined) {
                    var count = 0;
                    for (var j = 0; j < Triage.gTesterRoleList[selected][0]['tester'].length; j++) {
                        TesterItems[count] = Triage.gTesterRoleList[selected][0]['tester'][j];
                        count++;
                    }
                }

            }
            else {
                var count = 0;
                //Collect tester and their roles of all the test passes present in drop-down
                $('#scenSelect option').each(function (ind, itm) {
                    var value = itm.value;
                    if (Triage.gTesterRoleList[value] != undefined) {
                        for (var j = 0; j < Triage.gTesterRoleList[value][0]['tester'].length; j++) {
                            TesterItems[count] = Triage.gTesterRoleList[value][0]['tester'][j];
                            count++;
                        }
                    }

                });
            }


            //if((TesterItems != undefined) && (TesterItems != null))
            if (TesterItems.length != 0) {
                var flag = 0;
                var count = 0;
                //temp = '<option value="'+0+'">All Tester</option>';
                temp = '<option value="' + 0 + '">All ' + Triage.gConfigTester + '</option>';//Added By Mohini for Resource File
                $('#tester').append(temp);

                $("#roleList").empty();//:SD
                $("#roleList").append('<option value="0">All ' + Triage.gConfigRole + '</option>');//:SD

                Triage.RolesForSPUserID.length = 0;

                for (var ii = 0; ii < TesterItems.length; ii++) {
                    TesterID = TesterItems[ii]['spUserId'];
                    TesterName = TesterItems[ii]['testerName'];

                    //To get unique testers:SD
                    if ($.inArray(TesterID, testerIDArr) == -1) {
                        testerIDArr.push(TesterID);
                        temp = '<option value="' + TesterID + '">' + TesterName + '</option>';
                        $('#tester').append(temp);
                    }

                    //To collect RoleIDs of testers:SD	                    
                    for (var i = 0; i < TesterItems[ii]['roleList'].length; i++) {
                        if ($.inArray(TesterItems[ii]['roleList'][i]['roleId'], roleIDArr) == -1) {
                            roleIDArr.push(TesterItems[ii]['roleList'][i]['roleId']);
                            if (parseInt(TesterItems[ii]['roleList'][i]['roleId']) == 1) {
                                var roleTemp = '<option title="Standard" value="1">Standard</option>';
                                $("#roleList").append(roleTemp);
                                Triage.RoleNameForRoleID[parseInt(TesterItems[ii]['roleList'][i]['roleId'])] = "Standard";
                            }
                            else {
                                temp = '<option title="' + TesterItems[ii]['roleList'][i]['roleName'] + '" value="' + TesterItems[ii]['roleList'][i]['roleId'] + '">' + trimText(TesterItems[ii]['roleList'][i]['roleName'], 16) + '</option>';
                                $("#roleList").append(temp);

                                Triage.RoleNameForRoleID[parseInt(TesterItems[ii]['roleList'][i]['roleId'])] = TesterItems[ii]['roleList'][i]['roleName'];

                            }
                        }

                        if (Triage.RolesForSPUserID[TesterID] == undefined)
                            Triage.RolesForSPUserID[TesterID] = parseInt(TesterItems[ii]['roleList'][i]['roleId']);
                        else
                            Triage.RolesForSPUserID[TesterID] += "," + parseInt(TesterItems[ii]['roleList'][i]['roleId']);
                    }

                }//End of For loop
            }
            else {
                //temp = '<option value="'+0+'">No Tester Alloted</option>';
                temp = '<option value="' + 0 + '">No ' + Triage.gConfigTester + ' Alloted</option>';//Added by Mohini for Resource flie
                $('#tester').append(temp);

                //For Role dropdown:SD
                $('#roleList').empty();
                $('#roleList').html('<option value="0" selected="selected">No ' + Triage.gConfigRole + '</option>');
            }
        } catch (e) { }
    },

    // get Content of Scenario Test Cases and Action   
    forPIDGetResult: new Array(),
    OpenDialogByTestStepPlanID: new Array(),
    testPassShow: 0,
    getScenariosDetails: function (getTestPass) {
        try {
            Triage.testPassShow = 0;
            var temp = '';
            var testinfo = new Array();
            Triage.OpenDialogByTestStepPlanID = new Array();

            //var param = $('#versionSelect option:selected').val() + "/" + _spUserId;
            var param = $('#versionSelect option:selected').val();
            var result = ServiceLayer.GetData("GetTriageDetails", param, "Triage");
            Triage.forPIDGetResult[$('#versionSelect option:selected').val()] = result;

            ///////////////////////  Added by Harshal  /////////////////////////////
            temp += '<table class="gridDetails" cellspacing="0" style="word-wrap:break-word;"><thead>'
                        + '<tr>'
                            + '<td class="tblhd center" style="width:5%">#</td>'
                            + '<td class="tblhd" style="width:17%">Test Pass Name</td>'
                            + '<td class="tblhd" style="width:24%">Description</td>'
                            + '<td class="tblhd" style="width:15%">Test Manager</td>'
                            + '<td class="tblhd" style="width:7%">End Date</td>'
                            + '<td class="tblhd center" style="width:9%">Failed Test Steps</td>'
                        + '</tr>'
                 + '</thead><tbody>';

            var forTPIdgetStatus = new Array();
            var tpids = new Array();
            var tpStatusFail = new Array();
            var testPassDetails = [];
            var resultTP = [];
            if (result != undefined && result != '') {
                var flag = 0;
                var testinfo2 = '';
                resultTP = result;
                ///////////////
                if (getTestPass == 0 && $('#tester').val() == 0 && $('#roleList').val() == 0) {
                    for (var i = 0; i < result.length; i++) {
                        var arr = result[i]['listTriageTestSteps'];

                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j]['roleId'] != '') {

                                //Triage.OpenDialogByTestStepPlanID[arr[j]['teststepPlanId']]=result[i]['listTriageTestSteps'];
                                Triage.OpenDialogByTestStepPlanID[arr[j]['teststepPlanId']] = arr[j];

                                testinfo2 = '';
                                var ExpectedResult = '';
                                if (arr[j]['expectedResult'] != undefined && arr[j]['expectedResult'] != "")
                                    ExpectedResult = Triage.GetFormatedText(arr[j]['expectedResult'], 'false');
                                else
                                    ExpectedResult = '-';

                                if (arr[j]['actualResult'] != undefined && arr[j]['actualResult'] != "")
                                    var ActualResult = Triage.GetFormatedText(arr[j]['actualResult'], 'false');
                                else
                                    var ActualResult = '-';

                                if (arr[j]['testStepName'] != undefined && arr[j]['testStepName'] != "")
                                    var ActionName = Triage.GetFormatedText(arr[j]['testStepName'], 'false');
                                else
                                    var ActionName = '-';

                                /** Added by shilpa **/
                                //var completeActionName = UATReport.filterData(ActionName);
                                var completeActionName = ActionName.replace(/(\r\n)+/g, '');
                                if (ActionName.indexOf("<") != -1 && ActionName.indexOf(">") != -1)
                                    ActionName = completeActionName;

                                //var completeExpectedResult = UATReport.filterData(ExpectedResult);
                                var completeExpectedResult = ExpectedResult.replace(/(\r\n)+/g, '');
                                if (ExpectedResult.indexOf("<") != -1 && ExpectedResult.indexOf(">") != -1)
                                    ExpectedResult = completeExpectedResult;

                                //var completeActualResult = UATReport.filterData(ActualResult);
                                var completeActualResult = ActualResult.replace(/(\r\n)+/g, '');
                                if (ActualResult.indexOf("<") != -1 && ActualResult.indexOf(">") != -1)
                                    ActualResult = completeActualResult;
                                /** ***/
                                var ActionName1 = Triage.filterData(ActionName);
                                ActionName1 = ActionName1.replace(/"/g, "&quot;");
                                var ExpectedResult1 = Triage.filterData(ExpectedResult);
                                ExpectedResult1 = ExpectedResult1.replace(/"/g, "&quot;");
                                var ActualResult1 = Triage.filterData(ActualResult);
                                ActualResult1 = ActualResult1.replace(/"/g, "&quot;");

                                testinfo2 = testinfo2 + '<tr><td class="center">' + result[i]['testPassId'] + '</td>';
                                testinfo2 = testinfo2 + '<td class="center">' + arr[j]['teststepPlanId'] + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ActionName1 + '" style="overflow:hidden">' + ActionName + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + arr[j]['roleName'] + '">' + arr[j]['roleName'] + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ExpectedResult1 + '" style="overflow:hidden">' + ExpectedResult + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ActualResult1 + '" style="overflow:hidden">' + ActualResult + '</td>';

                                //For bug 
                                var bug = arr[j]['bug'];
                                if (bug != "") {
                                    var title = arr[j]['vstfBugTitle'];
                                    if (bug == "Y")
                                        bug = "Yes";
                                    else
                                        bug = "No";
                                }
                                else {
                                    bug = '-';
                                    var title = '-';
                                }

                                //For attachment
                                if (arr[j]['lstAttachment'].length != 0) {
                                    testinfo2 = testinfo2 + '<td>';
                                    var attachment = arr[j]['lstAttachment'];
                                    for (var vv = 0; vv < attachment.length - 1; vv++) {
                                        testinfo2 = testinfo2 + '<a href="' + attachment[vv]['filePath'] + '" target="_blank"><b><font color="#ff6500">' + attachment[vv]['fileName'] + '</font></b></a>,<br/>';
                                    }
                                    testinfo2 = testinfo2 + '<a href="' + attachment[vv]['filePath'] + '" target="_blank"><b><font color="#ff6500">' + attachment[vv]['fileName'] + '</font></b></a><br/></td>';
                                    //testinfo2 = testinfo2+'</td>';	

                                }
                                else {
                                    testinfo2 = testinfo2 + '<td>-</td>';
                                }

                                testinfo2 = testinfo2 + '<td>' + result[i]['testerName'] + '</td>';
                                testinfo2 = testinfo2 + '<td id="bug' + arr[j]['teststepPlanId'] + '">' + bug + '</td>';

                                if (arr[j]['vstfBugTitle'] != undefined && arr[j]['vstfBugTitle'] != "")
                                    testinfo2 = testinfo2 + '<td title="' + Triage.replaceSplCharacters2(arr[j]['vstfBugTitle']) + '" id="title' + arr[j]['teststepPlanId'] + '">' + arr[j]['vstfBugTitle'] + '</td>';
                                else
                                    //testinfo2 = testinfo2+'<td>-</td>';
                                    testinfo2 = testinfo2 + '<td title="' + Triage.replaceSplCharacters2(arr[j]['vstfBugTitle']) + '" id="title' + arr[j]['teststepPlanId'] + '">-</td>';

                                if (arr[j]['bug'] != "")
                                    testinfo2 = testinfo2 + '<td class="myActLinkOrng"><div style="float:left;padding:0px"><img src="/images/right.png" 														style="width:20px;padding-top:2px" /></div><a style="color: #0033CC;cursor: pointer;text-decoration: underline;" 															onclick="Triage.OpenTriageDialog(' + arr[j]['teststepPlanId'] + ');" class="myActLinkOrng" id="Triage' + arr[j]['teststepPlanId'] + '">Triaged</a></td></tr>';
                                else
                                    testinfo2 = testinfo2 + '<td class="myActLinkOrng center"><a style="color: #0033CC;cursor: pointer;text-decoration: underline;" 														onclick="Triage.OpenTriageDialog(' + arr[j]['teststepPlanId'] + ');" class="myActLinkOrng" id="Triage' + arr[j]['teststepPlanId'] + '">Triage</a></td></tr>';
                                ////////////
                                if (forTPIdgetStatus[result[i]['testPassId']] == undefined)
                                    forTPIdgetStatus[result[i]['testPassId']] = 0;
                                else {
                                    var status = forTPIdgetStatus[result[i]['testPassId']];
                                    forTPIdgetStatus[result[i]['testPassId']] = parseInt(status) + 1;
                                }
                                testinfo.push(testinfo2);

                            }
                        }
                    }
                }
                else if (getTestPass != 0 && $('#tester').val() != 0) {
                    var s = JSLINQ(result).Where(function (item) { return item.testPassId == getTestPass && item.testerSpuserId == $('#tester').val() });
                    result = s.items;
                    flag = 1;
                }
                else if (getTestPass != 0) {
                    var s = JSLINQ(result).Where(function (item) { return item.testPassId == getTestPass });
                    result = s.items;
                    flag = 1;
                }
                else if ($('#tester').val() != 0) {
                    var s = JSLINQ(result).Where(function (item) { return item.testerSpuserId == $('#tester').val() });
                    result = s.items;

                    //if(result.length==0)
                    //result = resultTP ;				

                    flag = 1;
                }
                else if (getTestPass == 0 && $('#tester').val() == 0 && $('#roleList').val() != 0) {
                    result = resultTP;
                    flag = 1;
                }

                /////////////
                //var status = '';
                totalNC = 0;
                var testPassIds = [];
                if (flag == 1 && result != undefined) {
                    for (var i = 0; i < result.length; i++) {

                        var arr = new Array();
                        arr = result[i]['listTriageTestSteps'];
                        if ($('#roleList').val() != 0) {
                            var s = JSLINQ(arr).Where(function (item) { return item.roleId == $('#roleList').val() });
                            arr = s.items;
                        }

                        for (var j = 0; j < arr.length; j++) {
                            if (arr[j]['roleId'] != '') {
                                testPassIds.push(result[i]['testPassId']);
                                //Triage.OpenDialogByTestStepPlanID[arr[j]['teststepPlanId']]=result[i]['listTriageTestSteps'];
                                Triage.OpenDialogByTestStepPlanID[arr[j]['teststepPlanId']] = arr[j];

                                testinfo2 = '';
                                var ExpectedResult = '';
                                if (arr[j]['expectedResult'] != undefined && arr[j]['expectedResult'] != "")
                                    ExpectedResult = Triage.GetFormatedText(arr[j]['expectedResult'], 'false');
                                else
                                    ExpectedResult = '-';

                                if (arr[j]['actualResult'] != undefined && arr[j]['actualResult'] != "")
                                    var ActualResult = Triage.GetFormatedText(arr[j]['actualResult'], 'false');
                                else
                                    var ActualResult = '-';

                                if (arr[j]['testStepName'] != undefined && arr[j]['testStepName'] != "")
                                    var ActionName = Triage.GetFormatedText(arr[j]['testStepName'], 'false');
                                else
                                    var ActionName = '-';

                                //var completeActionName = UATReport.filterData(ActionName);
                                var completeActionName = ActionName.replace(/(\r\n)+/g, '');
                                if (ActionName.indexOf("<") != -1 && ActionName.indexOf(">") != -1)
                                    ActionName = completeActionName;

                                var completeExpectedResult = ExpectedResult.replace(/(\r\n)+/g, '');
                                if (ExpectedResult.indexOf("<") != -1 && ExpectedResult.indexOf(">") != -1)
                                    ExpectedResult = completeExpectedResult;

                                var completeActualResult = ActualResult.replace(/(\r\n)+/g, '');
                                if (ActualResult.indexOf("<") != -1 && ActualResult.indexOf(">") != -1)
                                    ActualResult = completeActualResult;

                                var ActionName1 = Triage.filterData(ActionName);
                                ActionName1 = ActionName1.replace(/"/g, "&quot;");
                                var ExpectedResult1 = Triage.filterData(ExpectedResult);
                                ExpectedResult1 = ExpectedResult1.replace(/"/g, "&quot;");
                                var ActualResult1 = Triage.filterData(ActualResult);
                                ActualResult1 = ActualResult1.replace(/"/g, "&quot;");

                                testinfo2 = testinfo2 + '<tr><td class="center">' + result[i]['testPassId'] + '</td>';
                                testinfo2 = testinfo2 + '<td class="center">' + arr[j]['teststepPlanId'] + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ActionName1 + '" style="overflow:hidden">' + ActionName + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + arr[j]['roleName'] + '">' + arr[j]['roleName'] + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ExpectedResult1 + '" style="overflow:hidden">' + ExpectedResult + '</td>';
                                testinfo2 = testinfo2 + '<td title="' + ActualResult1 + '" style="overflow:hidden">' + ActualResult + '</td>';

                                //For bug 
                                var bug = arr[j]['bug'];
                                if (bug != "") {
                                    var title = arr[j]['vstfBugTitle'];
                                    if (bug == "Y")
                                        bug = "Yes";
                                    else
                                        bug = "No";
                                }
                                else {
                                    bug = '-';
                                    var title = '-';

                                }

                                //For attachment
                                if (arr[j]['lstAttachment'].length != 0) {
                                    testinfo2 = testinfo2 + '<td>';
                                    var attachment = arr[j]['lstAttachment'];
                                    for (var vv = 0; vv < attachment.length - 1; vv++) {
                                        testinfo2 = testinfo2 + '<a href="' + attachment[vv]['filePath'] + '" target="_blank"><b><font color="#ff6500">' + attachment[vv]['fileName'] + '</font></b></a>,<br/>';
                                    }
                                    testinfo2 = testinfo2 + '<a href="' + attachment[vv]['filePath'] + '" target="_blank"><b><font color="#ff6500">' + attachment[vv]['fileName'] + '</font></b></a><br/></td>';
                                    //testinfo2 = testinfo2+'</td>';	
                                }
                                else {
                                    testinfo2 = testinfo2 + '<td>-</td>';
                                }

                                testinfo2 = testinfo2 + '<td>' + result[i]['testerName'] + '</td>';
                                testinfo2 = testinfo2 + '<td id="bug' + arr[j]['teststepPlanId'] + '">' + bug + '</td>';

                                if (arr[j]['vstfBugTitle'] != undefined && arr[j]['vstfBugTitle'] != "")
                                    testinfo2 = testinfo2 + '<td title="' + Triage.replaceSplCharacters2(arr[j]['vstfBugTitle']) + '" id="title' + arr[j]['teststepPlanId'] + '">' + arr[j]['vstfBugTitle'] + '</td>';
                                else
                                    //testinfo2 = testinfo2+'<td>-</td>';
                                    testinfo2 = testinfo2 + '<td title="' + Triage.replaceSplCharacters2(arr[j]['vstfBugTitle']) + '" id="title' + arr[j]['teststepPlanId'] + '">-</td>';

                                if (arr[j]['bug'] != "")
                                    testinfo2 = testinfo2 + '<td class="myActLinkOrng"><div style="float:left;padding:0px"><img src="/images/right.png" 													style="width:20px;padding-top:2px" /></div><a style="color: #0033CC;cursor: pointer;text-decoration: underline;" 															onclick="Triage.OpenTriageDialog(' + arr[j]['teststepPlanId'] + ');" class="myActLinkOrng" id="Triage' + arr[j]['teststepPlanId'] + '">Triaged</a></td></tr>';
                                else
                                    testinfo2 = testinfo2 + '<td class="myActLinkOrng center"><a style="color: #0033CC;cursor: pointer;text-decoration: underline;" 														onclick="Triage.OpenTriageDialog(' + arr[j]['teststepPlanId'] + ');" class="myActLinkOrng" id="Triage' + arr[j]['teststepPlanId'] + '">Triage</a></td></tr>';
                                if (forTPIdgetStatus[result[i]['testPassId']] == undefined)
                                    forTPIdgetStatus[result[i]['testPassId']] = 0;
                                else {
                                    var status = forTPIdgetStatus[result[i]['testPassId']];
                                    forTPIdgetStatus[result[i]['testPassId']] = parseInt(status) + 1;
                                }
                                testinfo.push(testinfo2);

                            }

                        }
                    }
                }
            }

            var tpIds = [];
            $("#scenSelect option").each(function () {
                if (getTestPass != 0) {
                    tpIds.push(getTestPass);
                    return false;
                }
                else if (($.inArray($(this).val(), testPassIds) != -1 && flag == 1) || flag == 0)
                    tpIds.push($(this).val());

            });

            for (var m = 0; m < tpIds.length; m++) {
                var s = JSLINQ(resultTP).Where(function (item) { return item.testPassId == tpIds[m] });
                result = s.items;
                if (result.length != 0) {
                    Triage.testPassShow = 1;
                    if (result[0]['description'] != null && result[0]['description'] != undefined && result[0]['description'] != '')
                        var description = result[0]['description'];
                    else
                        var description = '-';
                    temp += '<tr style="width:1220px"><td class="center" style="width:5%">' + result[0]['testPassId'] + '</td>';
                    temp += '<td  style="width:17%">' + result[0]['testPassName'] + '</td>';
                    temp += '<td style="width:24%">' + Triage.replaceSplCharacters2(description) + '</td>';
                    temp += '<td style="width:15%">' + result[0]['testMgrName'] + '</td>';
                    due = result[0]['endDate'];
                    var crd = due.slice(0, 10);
                    var dd = crd.split('-');
                    due = dd[0] + '-' + dd[1] + '-' + dd[2];

                    temp += '<td style="width:7%">' + due + '</td>';

                    if (forTPIdgetStatus[result[0].testPassId] != undefined) {
                        var status = forTPIdgetStatus[result[0].testPassId];
                        temp += '<td style="width:9%" class="center">' + (parseInt(status) + 1) + '</td>';
                    }
                    else {
                        temp += '<td style="width:9%" class="center">0</td>';
                    }


                    this.ScenarioInfo = temp + "</tbody></table>";

                }

            }

            ////
            /*	if(tpids.length>0)
                {
                    for(var i=0;i<testPassDetails.length;i++)
                    {
                        if(testPassDetails[i]['description']!=null&&testPassDetails[i]['description']!=undefined&&testPassDetails[i]['description']!='')
                            var description=testPassDetails[i]['description'];
                        else
                            var description='-';	
                        temp+='<tr style="width:1220px"><td class="center" style="width:5%">'+testPassDetails[i]['testPassId']+'</td>';
                        temp+='<td  style="width:17%">'+testPassDetails[i]['testPassName']+'</td>';  
                        temp+='<td style="width:24%">'+Triage.replaceSplCharacters2(description)+'</td>';
                        temp+='<td style="width:15%">'+testPassDetails[i]['testMgrName']+'</td>';
                        due = testPassDetails[i]['endDate'];
                        var crd =  due.slice(0,10);
                        var dd = crd.split('-');
                        due = dd[0]+'-'+dd[1]+'-'+dd[2];
                      
                        temp+='<td style="width:7%">'+due+'</td>';
                        
                        if(forTPIdgetStatus[tpids[i]] != undefined)
                        {
                            var status = forTPIdgetStatus[tpids[i]];
                            temp+='<td style="width:9%" class="center">'+(parseInt(status)+1)+'</td>';
                        }
                        else
                        {
                            temp+='<td style="width:9%" class="center">0</td>';
                        }    
                                         
                    }    
                }
                else if(testPassDetails.length > 0)
                {
                    temp+='<td style="width:14%" class="center">0</td></tr>';
                }
                if(testPassDetails.length > 0 && tpids.length>0)
                    this.ScenarioInfo = temp+"</tbody></table>";
                else if(getTestPass != 0)
                {
                    var s = JSLINQ(resultTP).Where(function(item){return item.testPassId == getTestPass});
                    result = s.items;
                    if(result != undefined)
                    {
                        if(result.length != 0)
                        {
                            if(result[0]['description']!=null&&result[0]['description']!=undefined&&result[0]['description']!='')
                                var description=result[0]['description'];
                            else
                                var description='-';	
                            temp+='<tr style="width:1220px"><td class="center" style="width:5%">'+result[0]['testPassId']+'</td>';
                            temp+='<td  style="width:17%">'+result[0]['testPassName']+'</td>';  
                            temp+='<td style="width:24%">'+Triage.replaceSplCharacters2(description)+'</td>';
                            temp+='<td style="width:15%">'+result[0]['testMgrName']+'</td>';
                            due = result[0]['dueDate']
                            var crd =  due.slice(0,10);
                            var dd = crd.split('-');
                            due = dd[0]+'-'+dd[1]+'-'+dd[2];
                          
                            temp+='<td style="width:7%">'+due+'</td>';
                            
                            if(forTPIdgetStatus[tpids[i]] != undefined)
                            {
                                var status = forTPIdgetStatus[tpids[i]];
                                temp+='<td style="width:9%" class="center">'+(parseInt(status)+1)+'</td>';
                            }
                            else
                            {
                                temp+='<td style="width:9%" class="center">0</td>';
                            }  									    
                            this.ScenarioInfo = temp+"</tbody></table>";
                        }
                        else
                            this.ScenarioInfo = '';
                    }
                    else
                        this.ScenarioInfo = '';
                }
                else
                 this.ScenarioInfo = '';*/

            return testinfo;
        }
        catch (ex) {
        }

    },

    OpenTriageDialog: function (teststepPlanId) {
        try {
            var TriageResult = Triage.OpenDialogByTestStepPlanID[teststepPlanId];



            //if(TriageResult != null && TriageResult != undefined)
            if ((TriageResult.bug == "Y") || (TriageResult.bug == "N")) {
                if (TriageResult.bug == "Y") {
                    $('input:radio[name=Bug]:eq(0)').attr("checked", "checked");
                    //for bug id 11987 DT:17-06-2014
                    $("#ownertr").css('display', '');
                    $("#priottr").css('display', '');
                    $("#severttr").css('display', '');
                    $("#vstbugtr").css('display', '');
                    $("#vstfbuglinktr").css('display', '');
                }
                else {
                    $('input:radio[name=Bug]:eq(1)').attr("checked", "checked");
                    //for bug id 11987 DT:17-06-2014
                    $("#ownertr").css('display', 'none');
                    $("#priottr").css('display', 'none');
                    $("#severttr").css('display', 'none');
                    $("#vstbugtr").css('display', 'none');
                    $("#vstfbuglinktr").css('display', 'none');

                }

                if (TriageResult.triageDetails != "" && TriageResult.triageDetails != undefined)
                    $("#details").val(TriageResult.triageDetails);
                else
                    $("#details").val('');

                if (TriageResult.owner != "" && TriageResult.owner != undefined)
                    $("#Owner").val(TriageResult.owner);
                else
                    $("#Owner").text('');

                if (TriageResult.testingDate != "" && TriageResult.testingDate != undefined) {
                    $('#testingDate').val(TriageResult.testingDate);
                    /*var oldDate=TriageResult.testingDate.toString();
                    var sliceDate = oldDate.slice(0,10);
                    sliceDate =sliceDate.split("-");		
                    document.getElementById('testingDate').value = sliceDate [1]+'/'+sliceDate [0]+'/'+sliceDate [2];*/

                }
                else
                    $('#testingDate').val('');

                if (TriageResult.triagestatus != "" && TriageResult.triagestatus != undefined) {

                    switch (TriageResult.triagestatus) {
                        case 'T': TriageResult.triagestatus = "Triaged";
                            break;
                        case 'R': TriageResult.triagestatus = "Resolved";
                            break;
                        case 'C': TriageResult.triagestatus = "Closed";
                            break;

                    }

                    $("#status option").each(function () {
                        if (trim($(this).text()) == trim(TriageResult.triagestatus))
                            $(this).attr("selected", "selected");
                    });
                }
                else {
                    $("#status option").each(function () {
                        if (trim($(this).text()) == "Select Status")
                            $(this).attr("selected", "selected");
                    });

                }

                if (TriageResult.priority != "" && TriageResult.priority != undefined) {
                    $("#priority option").each(function () {
                        if (trim($(this).text()) == trim(TriageResult.priority))
                            $(this).attr("selected", "selected");
                    });
                }
                else {
                    $("#priority option").each(function () {
                        if (trim($(this).text()) == "Select Priority")
                            $(this).attr("selected", "selected");
                    });

                }

                if (TriageResult.severity != "") {
                    switch (TriageResult.severity) {
                        case 'C': TriageResult.severity = "Critical";
                            break;
                        case 'H': TriageResult.severity = "High";
                            break;
                        case 'M': TriageResult.severity = "Medium";
                            break;
                        case 'L': TriageResult.severity = "Low";
                            break;

                    }

                    $("#severity option").each(function () {
                        if (trim($(this).text()) == trim(TriageResult.severity))
                            $(this).attr("selected", "selected");
                    });
                }
                else {
                    $("#severity option").each(function () {
                        if (trim($(this).text()) == "Select Severity")
                            $(this).attr("selected", "selected");
                    });

                }

                if (TriageResult.dateClosed != "" && TriageResult.dateClosed != undefined) {
                    /*var oldDate=TriageResult.dateClosed.toString();
                    var sliceDate = oldDate.slice(0,10);
                    sliceDate =sliceDate.split("-");		
                    document.getElementById('closedDate').value = sliceDate [1]+'/'+sliceDate [0]+'/'+sliceDate [2];*/
                    document.getElementById('closedDate').value = TriageResult.dateClosed;

                }
                else
                    document.getElementById('closedDate').value = '';


                if (TriageResult.vstfBugTitle != "" && TriageResult.vstfBugTitle != undefined)
                    $("#title").val(TriageResult.vstfBugTitle);
                else
                    $("#title").val('');

                if (TriageResult.vstfBugLink != "" && TriageResult.vstfBugLink != undefined)
                    $("#url").val(TriageResult.vstfBugLink);
                else
                    $("#url").val('');


            }
            else {
                //$('#testingDate').val(Triage.testStepDate[childID]); // Added by shilpa
                $('#testingDate').val('');
                $('input:radio[name=Bug]:eq(0)').attr('checked', true); // modified by shilpa
                $('input:radio[name=Bug]:eq(1)').attr('checked', false)
                $("#details").val('');
                $("#Owner").val('');

                /*
                $("#status option").each(function(){
                  if (trim($(this).text()) == "Select Status")
                    $(this).attr("selected","selected");
                });
                */
                $("#status").val($("#status option:first").val());

                /*
                $("#priority option").each(function(){
                  if (trim($(this).text()) == "Select Priority")
                    $(this).attr("selected","selected");
                });
                */
                $("#priority").val($("#priority option:first").val());

                /*
                $("#severity option").each(function(){
                  if (trim($(this).text()) == "Select Severity")
                    $(this).attr("selected","selected");
                });
                */
                $("#severity").val($("#severity option:first").val());

                document.getElementById('closedDate').value = '';
                $("#title").val('');
                $("#url").val('');
                //for bug id 11987 DT:17-06-2014
                $("#ownertr").css('display', '');
                $("#priottr").css('display', '');
                $("#severttr").css('display', '');
                $("#vstbugtr").css('display', '');
                $("#vstfbuglinktr").css('display', '');
            }


            $('#dvTriage').dialog({
                resizable: false,
                modal: true,
                height: 370,
                width: 500,
                buttons: {
                    "Save": function () {
                        Triage.setOwnerValue();
                        var flag = 0;
                        //if($("#title").val().replace(/^\s+|\s+$/g, "") == '' || $('input:radio[name=Bug]:eq(0)').attr('checked') == false && 																		$('input:radio[name=Bug]:eq(1)').attr('checked') == false)
                        if ($("#title").val().replace(/^\s+|\s+$/g, "") == '' && $('input:radio[name=Bug]:eq(0)').attr('checked') == true) {
                            Triage.alertBox("Fields marked with asterisk(*) are mandatory!");
                            flag = 1;
                        }
                        else if ($('input:radio[name=Bug]:eq(1)').attr('checked') == false && $('input:radio[name=Bug]:eq(0)').attr('checked') == false)
                            flag = 1;

                        if (flag == 0) {
                            Main.showLoading();
                            var bug = ($('input:radio[name=Bug]:checked').val()).slice(0, 1);
                            var details = $("#details").val();
                            var owner = $("#Owner").val();

                            var status = '';
                            if (($("#status option:selected").val().trim()) != "Select Status") {
                                status = ($("#status option:selected").text().trim()).slice(0, 1);
                            }

                            var priority = '';
                            if ($("#priority option:selected").val().trim() != "Select Priority") {
                                priority = $("#priority option:selected").text();
                            }

                            var severity = '';
                            if ($("#severity option:selected").val().trim() != "Select Severity") {
                                severity = ($("#severity option:selected").text()).slice(0, 1);
                            }

                            var dateStr = '';
                            if ($("#closedDate").val() != '') {
                                var oldDate = $("#closedDate").val();
                                var sliceDate = oldDate.slice(0, 10);
                                sliceDate = sliceDate.split("/");
                                dateStr = sliceDate[2] + '-' + sliceDate[0] + '-' + sliceDate[1];
                            }
                            var title = $("#title").val().replace(/^\s+|\s+$/g, "");
                            title = title == undefined || title == "" || title == null ? "-" : title;
                            var url = $("#url").val();
                            if (title.length > 255)
                                Triage.alertBox('Title should contain only 255 characters.');
                            else if (url.length > 255)
                                Triage.alertBox('URL should contain only 255 characters.');
                            else {
                                var obj = new Array();
                                //var list = jP.Lists.setSPObject(Triage.SiteURL,'Triage');
                                $("#bug" + teststepPlanId).text($('input:radio[name=Bug]:checked').val());
                                $("#title" + teststepPlanId).text(title);
                                $("#title" + teststepPlanId).attr('title', title);
                                if ($("#Triage" + teststepPlanId).text() != "Triaged")
                                    $("#Triage" + teststepPlanId).before('<div style="float:left;padding:0px"><img src="/images/right.png" 																				style="width:20px;padding-top:2px" /></div>');
                                $("#Triage" + teststepPlanId).text("Triaged");
                                var btnResult = $("span.ui-button-text:eq(0)").text();
                                //if(TriageResult == undefined)
                                var TriageData = '';
                                if (btnResult == "Save") {
                                    var ownerName = ownerName == undefined || ownerName == "" || ownerName == null ? "-" : ownerName;
                                    //var ownerNew = ownerName;

                                    TriageData = {
                                        'bug': bug,
                                        'triageDetails': details,
                                        'owner': owner,
                                        'Triagestatus': status,
                                        'dateClosed': dateStr,
                                        'vstfBugTitle': title,
                                        'vstfBugLink': url,
                                        'teststepPlanId': teststepPlanId,
                                        'priority': priority,
                                        'severity': severity
                                    };

                                    var result = ServiceLayer.InsertUpdateData("InsertUpdateTriage", TriageData, "Triage");
                                    if (result != null && result != undefined)
                                        Main.AutoHideAlertBox(Triage.gConfigTriage + " saved successfully!");//Added by Mohini for Resource flie
                                    //Triage.alertBox(Triage.gConfigTriage + " saved successfully!");
                                    Triage.getScenariosDetails(0);
                                }
                                else {
                                    //var ownerNew = ownerName;

                                    TriageData = {
                                        "triageId": TriageResult.triageId,
                                        'bug': bug,
                                        'triageDetails': details,
                                        'owner': owner,
                                        'Triagestatus': status,
                                        'dateClosed': dateStr,
                                        'vstfBugTitle': title,
                                        'vstfBugLink': url,
                                        'teststepPlanId': teststepPlanId,
                                        'priority': priority,
                                        'severity': severity
                                    };

                                    var result = ServiceLayer.InsertUpdateData("InsertUpdateTriage", TriageData, "Triage");
                                    if (result != null && result != undefined)
                                        Main.AutoHideAlertBox(Triage.gConfigTriage + " updated successfully!");//Added by Mohini for Resource flie
                                    //Triage.alertBox(Triage.gConfigTriage + " updated successfully!");
                                    Triage.getScenariosDetails(0);

                                }

                                Main.hideLoading();
                                $(this).dialog("close");
                            }
                            Main.hideLoading();
                        }

                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                }

            });
            //if(TriageResult != undefined)
            if (TriageResult.bug != "")
                $("span.ui-button-text:eq(0)").text("Update");
            else
                $("span.ui-button-text:eq(0)").text("Save");

        }
        catch (e) { }
    },
    alertBox: function (msg) {
        $("#divAlert").text(msg);
        $('#divAlert').dialog({ height: 130, modal: true, buttons: { "Ok": function () { $(this).dialog("close"); } } });
    },

    //show all the text related to selected tester
    validation: function () {
        if ($('#projSelect option:selected').val() == 'select') {
            //Triage.alertBox("Please select project");
            Triage.alertBox("Please select " + Triage.gConfigProject);//Added by Mohini for Resource flie
            return false;
        }
            //else if($('#scenSelect option:selected').text() == "No Test Pass Available") //$('#scenSelect option:selected').val() == "0"
        else if ($('#scenSelect option:selected').text() == "No " + Triage.gConfigTestPass + " Available")//Added by Mohini for Resource flie
        {
            //Triage.alertBox("No Test Pass available");
            Triage.alertBox("No " + Triage.gConfigTestPass + " available");//Added by Mohini for Resource flie
            return false;
        }
        else if ($('#tester option:selected').val() == "0") {
            // if($('#tester option:selected').text() == "No Tester Alloted")
            if ($('#tester option:selected').text() == "No " + Triage.gConfigTester + " Alloted")//Added by Mohini for Resource flie
                //Triage.alertBox("No Tester available");
                Triage.alertBox("No " + Triage.gConfigTester + " available");
            else
                return true;
        }
        else
            return true;
        Main.hideLoading();
    },

    showTesterData: function () {
        if (Triage.validation()) {
            Main.showLoading();
            var projectID = '';

            if (Triage.isPortfolioOn)//When Portfolio is ON :-Mohini DT:09-05-2014 
                projectID = $('#versionSelect option:selected').val();
            else
                projectID = $('#projSelect option:selected').val();

            $('#hTestCase').show();
            $('#dvProjectDetails').show();

            $(".proj-desc").show();
            $('#tesctCaseDiv').show();
            $('#thisScenario').empty();//Clean Discription area
            //$('#scenario').empty();//Clean Test Cases Grid
            $("#Pagination").hide();
            $("#testStepDetails").empty();

            var tpID = $('#scenSelect option:selected').val();
            var statusTS = $("#status option:selected").text();
            Triage.noTCAvailable = 0;
            Triage.onLoadgss = Triage.getScenariosDetails(tpID);
            //Ankita 19/7/2012 : to solve Bug ID 983
            if (Triage.testPassShow == 0) {
                if ($("#scenSelect").text() == "No Test Pass Available")
                    $('#thisScenario').html('<span style="color:red;font-weight:bold">There are no ' + UATReport.gConfigTestPass + 'es!</span>');//Added By Mohini for Resource File
                else
                    $('#thisScenario').html('<span style="color:red;font-weight:bold">There is no data available with the above criteria!</span>');
                $("#hTestCase").hide();
                $("#testStepDetails").hide();
            }
            else {
                $('#thisScenario').html(Triage.ScenarioInfo);
                $("#hTestCase").show();
                $("#testStepDetails").show();
            }
            if (Triage.onLoadgss == "" || Triage.onLoadgss == undefined) {
                if (Triage.noTCAvailable == 1)
                    $('#testStepDetails').html('<span style="color:red;font-weight:bold">No ' + Triage.gConfigTestCase + ' Available !</span>');//Added by Mohini for Resource flie
                else
                    $('#testStepDetails').html('<span style="color:red;font-weight:bold">There are no failed ' + Triage.gConfigTestStep + ' !</span>');//Added by Mohini for Resource flie	
            }
            else {
                Triage.pagination();
            }
            window.setTimeout("Main.hideLoading()", 100);
        }
        if ($("#scenario").find("a").length != 0) /* shilpa 25 apr */
            $("#scenario").find("a").attr('target', '_blank');


        Main.hideLoading();
    },
    pagination: function () {
        var len = Triage.onLoadgss.length;

        $("#Pagination").pagination(len, {
            callback: Triage.initpage,
            items_per_page: 10,
            num_display_entries: 10,
            num: 2,
            current_page: Triage.gPageIndex
        });
    },
    initpage: function (page_index, jq) {
        var items_per_page = 10;
        var max_elem = Math.min((page_index + 1) * items_per_page, Triage.onLoadgss.length);
        var testinfo = '';
        testinfo = testinfo + '<table style="table-layout:fixed;word-wrap:break-word;" class="gridDetails" cellspacing="0"><thead><tr>';
        testinfo = testinfo + '<td class="tblhd-b center" style="width:4%">' + Triage.gConfigTestPass + ' ID</td>';//added by Ejaz Waquif
        testinfo = testinfo + '<td class="tblhd-b center" style="width:4%">Test ID</td>';
        testinfo = testinfo + '<td class="tblhd-b" style="width:13%">Test ' + Triage.gConfigAction + ' / Steps</td>';//15%
        testinfo = testinfo + '<td class="tblhd-b" style="width:5%">' + Triage.gConfigRole + '</td>';
        testinfo = testinfo + '<td class="tblhd-b" style="width:17%">' + Triage.gConfigExpectedResult + '</td>';
        testinfo = testinfo + '<td class="tblhd-b" style="width:17%">' + Triage.gConfigActualresult + '</td>';
        testinfo = testinfo + ' <td class="tblhd-b" style="width:9%">Actual Attachment</td>';
        testinfo = testinfo + ' <td class="tblhd-b" style="width:12%">' + Triage.gConfigTester + '</td>';
        testinfo = testinfo + ' <td class="tblhd-b" style="width:3%">' + Triage.glblBug + '</td>';
        testinfo = testinfo + ' <td class="tblhd-b" style="width:10%">' + Triage.glblvstfb + '</td>';
        testinfo = testinfo + ' <td class="tblhd-b" style="width:6%">' + Triage.gConfigTriage + '</td>';
        testinfo = testinfo + '</tr></thead><tbody >';
        for (var i = page_index * items_per_page; i < max_elem; i++) {
            testinfo = testinfo + Triage.onLoadgss[i];
        }
        testinfo = testinfo + '</tbody></table>';
        $('#testStepDetails').empty().html(testinfo);
        $("#Pagination").show();
        $('.gridDetails').find('tr').each(function (i, v) {
            $(v).find('td:eq(4)').find('img').attr('height', '200');
            $(v).find('td:eq(4)').find('img').attr('width', '200');
            $(v).find('td:eq(4)').find('img').css('height', '200px').css('width', '200px');
            $(v).find('td:eq(5)').find('img').attr('height', '200');
            $(v).find('td:eq(5)').find('img').attr('width', '200');
            $(v).find('td:eq(5)').find('img').css('height', '200px').css('width', '200px');

            $(v).find('td:eq(2)').find('table').css('width', '155px');
            $(v).find('td:eq(4)').find('table').css('width', '195px');
            $(v).find('td:eq(5)').find('table').css('width', '195px');

        });
        return false;
    },
    dmlOperation: function (search, list) {
        var listname = jP.Lists.setSPObject(Triage.SiteURL, list);
        var query = search;
        var result = listname.getSPItemsWithQuery(query).Items;
        return (result);
    },
    //for bug id 11987 DT:17-06-2014
    noBugClick: function () {
        if ($("input:radio[name='Bug'][value='No']").is(":checked")) {
            $("#ownertr").css('display', 'none');
            $("#priottr").css('display', 'none');
            $("#severttr").css('display', 'none');
            $("#vstbugtr").css('display', 'none');
            $("#vstfbuglinktr").css('display', 'none');
        }
    },
    BugClick: function () {
        if ($("input:radio[name='Bug'][value='Yes']").is(":checked")) {
            $("#ownertr").css('display', '');
            $("#priottr").css('display', '');
            $("#severttr").css('display', '');
            $("#vstbugtr").css('display', '');
            $("#vstfbuglinktr").css('display', '');
        }
    },
    /*********************************************/
    getExportTable: function (selected) {
        Main.showLoading();
        try {
            var exportData = '';
            var loginSpUserId = _spUserId;
            if ((selected != '' || selected != undefined) && (loginSpUserId != '' || loginSpUserId != undefined)) {
                exportData = "Parameters?projectId=" + selected + "&loginSpUserId=" + loginSpUserId;
                if ($('#scenSelect option:selected').val() != 0)
                    exportData += "&testPassId=" + $('#scenSelect option:selected').val();

                if ($('#tester option:selected').val() != 0)
                    exportData += "&testerSpUserId=" + $('#tester option:selected').val();

                if ($('#roleList option:selected').val() != 0)
                    exportData += "&roleId=" + $('#roleList option:selected').val();
            }
            var result = ServiceLayer.GenerateReport("ExportTriage", exportData);

        }
        catch (e) {
            Main.hideLoading();
        }
    },
    AddAttachment: function (baseStr) {
        var obj = new Array();
        obj.push({
            "Title": "New1",
            "Qry": "Test"
        });
        var SPlistName = "testlist";
        var listname = jP.Lists.setSPObject(Triage.SiteURL, SPlistName);
        var result = listname.updateItem(obj);
        $().SPServices(
                    {
                        operation: "AddAttachment",
                        webURL: Triage.SiteURL,
                        listName: SPlistName,
                        listItemID: result.ID,
                        fileName: "Att.png",
                        attachment: baseStr,
                        async: false,
                        completefunc: Triage.AttResult
                    });
    },
    AttResult: function (xmlHttpRequest, status) {
        Triage.imageURL = "";
        if (status == "success")
            Triage.imageURL = $(xmlHttpRequest.responseText).find('AddAttachmentResult').text();

    },
    replaceSplCharacters: function (str) {
        str = str.replace(/&nbsp;/gi, ' ').replace(/&quot;/gi, "\"").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        return str;
    },
    replaceSplCharacters2: function (str) {
        str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, '&#39;');
        return str;
    },

    //Nikhil - 2/03/2012 - Returns Formated Text for Actual and Expected Results.
    GetFormatedText: function (sText, FromExport) {

        if (FromExport == 'true') {

            var sNewLine = '\n';

            if (FromExport == 'true') {
                sNewLine = '\n';

            }
            else {
                sNewLine = '<br/>';

            }

            var sResult = '';

            var FlagBullete = 'false';

            $('#dvTemp').html('');
            $('#dvTemp').html(sText);

            var length = $('#dvTemp').find('p').length - 1;

            if (length > 0) {

                for (i = 0; i <= length; i++) {
                    FlagBullete = 'false';
                    var txtText;

                    var pElement = $('#dvTemp').find('p')[i];

                    // case for Special bullete 
                    if (pElement.childNodes.length == 1) {
                        //if(pElement.childNodes[0].nodeName=='A')
                        if (pElement.childNodes[0].childNodes.length >= 2) {
                            pElement = pElement.childNodes[0];
                        }
                    }

                    // Handle Three Span to determine bullete.
                    if (pElement.childNodes.length >= 2) {
                        FlagBullete = 'true';
                    }


                    if (pElement.childNodes.length >= 2) {

                        txtText = pElement.childNodes[pElement.childNodes.length - 1].innerText;

                        if (txtText != undefined && txtText != null && txtText != '') {
                            if (FlagBullete == 'true') {
                                sResult = sResult + '*  ' + txtText + sNewLine;	//'\n';
                            }
                            else {
                                sResult = sResult + txtText + sNewLine;	//'\n';
                            }
                        }

                    }
                    else {
                        sResult = sResult + $('#dvTemp').find('p')[i].innerText + sNewLine;	//'\n';

                    }
                }
            }
            else {
                // Remove <br />

                while (sText.indexOf('<br />') != -1) {
                    sText = sText.replace('<br />', '');
                }

                sResult = sText;

            }


            return sResult;
        }
        else {
            var arrBullet = Triage.sBulleteChar.split(',');

            for (i = 0; i <= arrBullet.length - 1; i++) {
                while (sText.indexOf('>' + arrBullet[i] + '<span') != -1)
                    sText = sText.replace('>' + arrBullet[i] + '<span', '>* <span');

            }

            return sText;
        }

    },

    filterData: function (info2) {
        var mydiv = document.createElement("div");
        mydiv.innerHTML = info2;
        if (navigator.appName == "Microsoft Internet Explorer")
            info2 = mydiv.innerText;
        else
            info2 = mydiv.textContent;
        return info2;
    }

}