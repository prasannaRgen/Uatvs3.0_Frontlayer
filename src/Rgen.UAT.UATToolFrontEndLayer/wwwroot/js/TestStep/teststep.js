/* Copyright © 2012 RGen Solutions . All Rights Reserved.
   Contact : support@rgensolutions.com 
*/
$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});
var teststep={
	
	//For data from WCF
	dataCollection:new Array(),
	TestCaseNameArrForTCID:new Array(),
	onlyTestCasewithTestSteps:-1,
	TestStepArrIndexMap:new Array(),
	testStepsCountInSelectedTP:0,
	lastSequenceWithinTP:-1,
	testingType:0,
	
	SiteURL:Main.getSiteUrl(),
	startIndexA:0,
	EiForAction:0,
	TestStepIDFromEditTestStep:"",
	gTestStepList:"",
	roleLength:0,
	searchKey:'',
	teststatus:'',
	result:new Array(),
	//below buffer to keep data for showing during next/previous paging
	testStepIdsGlbl2:new Array(),
	AllRolesCollection:new Array(),
	
	//below flag is set in multiSelectDDL.js when select all
	flagSelectAll:0,
	//below buffer to keep select all data
	testStepIdsGlblSelectAll:new Array(),
	testCaseIdFrmCookie:new Array(),
	roleIdFrmCookie:new Array(),
	flagForSaveMessage:true,
	flagForSaveMessage1:true,
	TestPassNameBasedOnTestPassID:new Array(),
	TestPassWithNoRolesOfTestStep:new Array(),
	RoleNameBasedOnRoleID:new Array(),
	roleNotSaved:new Array(),
	testCasesInEditMode:new Array(),
	testCasesToBeRemoved:false,
	TestCasesOfRemovedRoles:new Array(),
	positionStored:false,
	sBulleteChar:'Ø,v,ü,§',   //Added by Nikhil
	TestPassStatus:new Array(),
	RolesForTestStepEdit:new Array(),
	//Added by HRW on 18 july
	testCaseNameForTCID:new Array(),
	flagForTC:false,
	attachmentResultForTestStepID:new Array(),
	allTestCaseIDsOfTP:new Array(),
	ParentResultForSave:new Array(),
	addedRoles:new Array(),
	ExpectedResult:"", //shilpa 7 may
	//choiceForTPID:new Array(),
	choiceForTPID:'0',
	sequenceForTPID:'0',
	
	projectId:'',
	testPassId:'',
	projectName:'',
	testPassName:'',
	countVal:'',
	delFlag:0,
	/**************Added by Mohini for resource file**************/
	gCongfigRole:"Role",
	gCongfigRoles:"Role(s)",
	gConfigTestPass:"Test Pass",
	gConfigTester:"Tester",
	gConfigProject:"Project",
	gConfigTestStep:"Test Step",
	gConfigTestCase:"Test Case",
	gConfigExpectedResult:"Expected Result",
	gConfigStatus:"Status",
	gConfigAttachment:"Attachment",
	glablValOfExpectedResult:'',
	gConfigVersion:"Version",
	gConfigGroup:'Group',
	gConfigPortfolio:'Portfolio',

	
	allTestCaseIDsWithinSelectedTestPass : new Array(),//Added by Rajiv on 10 August to resolve 2165 in an optimized way
	allteststepsdata:new Array(),
	arrTestSteps:new Array(),
	
	noprjFlag:0,
	noTPFlag:0,
	noTestrFlag:0,
	noTCFlag:0,

onPageLoad:function()
{      
	Main.showLoading();
	
	$('.navTabs h2:eq(0)').click(function () {


	    /**/
	    //var parameter1 = Main.getSiteUrl() + "/images/";
	    //var parameter2 = Main.getSiteUrl() + "/palletes/";
	    ////  debugger
	    //initRTE(parameter1.toString(), parameter2.toString(), "", true);
	    //writeRichText('rte1', "", 480, 150, false, false);
        /**/

			// Added for DD
			createDD.editMode = 0
			createDD.showDD();

			teststep.delFlag = 1;
			$('#impExpTemplate').hide();
			$('#ActionCount').show();
			$('#testStepGrid').show();
			$('#testStepinput').hide();
			$('#countDiv').show();
			$('.navTabs h2').css('color','#7F7F7F');
			$(this).css('color','#000000');
			$('#Pagination').show();
			$('#btnDelete').show();
			teststep.pagination();
			//$('#countDiv').show();
			teststep.clearFields();
			$('.navTabs h2:eq(3)').hide();
		});
		
		$('.navTabs h2:eq(1)').click(function(){
			// Added for DD
			createDD.editMode = 0;
			createDD.showDD();
			
			//Initialize all the flags
			teststep.noprjFlag = 0;
			
			teststep.noTPFlag = 0;
			
			teststep.noTestrFlag = 0;
			
			teststep.noTCFlag = 0;
			
		
		/****************Added by  Mohini on 12-19-2013****************/
		    if(show.testPassId == '')
		    {
		       if(show.projectId == '')//for bug id 11699
		       {
		           teststep.alertBox2("Sorry! No "+teststep.gConfigProject.toLowerCase()+" is available for selected "+teststep.gConfigPortfolio.toLowerCase()+" !<br/>Please create the "+teststep.gConfigProject.toLowerCase()+" First.");//Added by Mohini for Resource file
                   teststep.noprjFlag=1;
               }
               else
               {
			       teststep.alertBox2("Sorry! No "+teststep.gConfigTestPass.toLowerCase()+" is available for selected "+teststep.gConfigProject.toLowerCase()+" '"+$('#projectTitle label').attr('title')+"'!<br/>Please create the "+teststep.gConfigTestPass.toLowerCase()+" First.");//Added by Mohini for Resource file
			       teststep.noTPFlag=1;
			   }
			}
			else if($("#testCaseName div div li").text() == "")
			{
		        
		        //To check for the Tester present or not
		        var isTesterPresent = 0;
		        $.each( teststep.roles,function(ind,itm){
			
					if(itm.isTestersAssigned == 1)
					{
						isTesterPresent = 1;
					}
			
				});

		        
		        if(isTesterPresent == 0 )
		        {
		            teststep.alertBox2("Sorry! No "+teststep.gConfigTester+" is available for selected "+teststep.gConfigTestPass+"!<br/>Please create the "+teststep.gConfigTester+" First.");//Added by Mohini for Resource file
                    teststep.noTestrFlag=1;
                }
                else
                {
                    teststep.alertBox2("Sorry! No "+teststep.gConfigTestCase+" is available for selected "+teststep.gConfigTestPass+"!<br/>Please create the "+teststep.gConfigTestCase+" First.");//Added by Mohini for Resource file
                    teststep.noTCFlag=1;
                }
            }

		    $('#impExpTemplate').hide();
			$('#ActionCount').hide();
			$('#testStepGrid').hide();
			$('#countDiv').hide();
			$('#testStepinput').show();
			$('.navTabs h2').css('color','#7F7F7F');
			$(this).css('color','#000000');
			$('#Pagination').hide();
			$('#btnDelete').hide();
			teststep.clearFields();
			$('.navTabs h2:eq(3)').hide();
			$('#noTP').hide();
			
			////////Added by Mangesh to uncheck testcase and role checkboxes on clicking on create link after edit
			multiSelectList.selectNone("testCaseName");

			multiSelectList.selectNone("role");
			////////////////////////////////////////////////////
			
		});
		
		$('.navTabs h2:eq(2)').click(function(){
			// Added for DD
			createDD.editMode = 0;
			
			createDD.showDD();
			
			//Initialize all the flags
			teststep.noprjFlag = 0;
			
			teststep.noTPFlag = 0;
			
			teststep.noTestrFlag = 0;
			
			teststep.noTCFlag = 0;

		
		/****************Added by  Mohini on 12-19-2013****************/
		    if(show.testPassId == '')
		    {
		       if(show.projectId == '')//for bug id 11699
		       {
		           teststep.alertBox2("Sorry! No "+teststep.gConfigProject.toLowerCase()+" is available for selected "+teststep.gConfigPortfolio.toLowerCase()+" !<br/>Please create the "+teststep.gConfigProject.toLowerCase()+" First.");//Added by Mohini for Resource file
                   teststep.noprjFlag=1;
               }
               else
               {
			       teststep.alertBox2("Sorry! No "+teststep.gConfigTestPass.toLowerCase()+" is available for selected "+teststep.gConfigProject.toLowerCase()+" '"+$('#projectTitle label').attr('title')+"'!<br/>Please create the "+teststep.gConfigTestPass.toLowerCase()+" First.");//Added by Mohini for Resource file
			       teststep.noTPFlag=1;
			   }
			}
			else if($("#testCaseName div div li").text() == "")
			{
		        //var query = '<Query><Where><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+show.testPassId+'</Value></Eq></Where><ViewFields><FieldRef Name="TesterName"/></ViewFields></Query>';
		        //var Result = teststep.dmlOperation(query,'Tester');
		        
		        //To check for the Tester present or not
		        var isTesterPresent = 0;
		        $.each( teststep.roles,function(ind,itm){
			
					if(itm.isTestersAssigned == 1)
					{
						isTesterPresent = 1;
					}
			
				});

		        
		        if(isTesterPresent  == 0)
		        {
		            teststep.alertBox2("Sorry! No "+teststep.gConfigTester+" is available for selected "+teststep.gConfigTestPass+"!<br/>Please create the "+teststep.gConfigTester+" First.");//Added by Mohini for Resource file
                    teststep.noTestrFlag=1;
                }
                else
                {
                    teststep.alertBox2("Sorry! No "+teststep.gConfigTestCase+" is available for selected "+teststep.gConfigTestPass+"!<br/>Please create the "+teststep.gConfigTestCase+" First.");//Added by Mohini for Resource file
                    teststep.noTCFlag=1;
                }
            }
            
			$('#impExpTemplate').show();
			$('#ActionCount').hide();
			$('#testStepGrid').hide();
			$('#countDiv').hide();
			$('#testStepinput').hide();
			$('.navTabs h2').css('color','#7F7F7F');
			$(this).css('color','#000000');
			$('#Pagination').hide();
			$('#btnDelete').hide();
			teststep.clearFields();
			$('.navTabs h2:eq(3)').hide();
			$('#noTP').hide();
		});
	
     //To make the bredcrumb box label cofigurable :Ejaz Waquif DT:2/18/2014
		$("#groupHead label").html(teststep.gConfigGroup + '<img src="/images/drop-arrow.gif" style="float:right;padding-top:5px"/>');
	      $("#portfolioHead label").html(teststep.gConfigPortfolio+'<img src="/images/drop-arrow.gif" style="float:right;padding-top:5px"/>');
	      $("#projectHead label").html(teststep.gConfigProject+'<img src="/images/drop-arrow.gif" style="float:right;padding-top:5px"/>');
	      $("#versionHead label").html(teststep.gConfigVersion+'<img src="/images/drop-arrow.gif" style="float:right;padding-top:5px"/>');
		  $("#TestPassHead label").html(teststep.gConfigTestPass+'<img src="/images/drop-arrow.gif" style="float:right;padding-top:5px"/>');

	   $('#impTestStep').html('Import '+teststep.gConfigTestStep+'(s)');
	   $('#expTestStep').html('Export '+teststep.gConfigTestStep+'(s)');
	   $('#selTestCase').attr('title','Please select single '+teststep.gConfigTestCase.toLowerCase()+' for '+teststep.gConfigTestStep.toLowerCase()+' sequence configuration.');
	   $('#assoTestcase').append('&nbsp;&nbsp;&nbsp;&nbsp;<img src="/images/drop-arrow.gif"/>');
	   teststep.glablValOfExpectedResult=$('#lblExpRes').text().substring(0,$('#lblExpRes').text().length-1);
	   $('#clipBrdImage').attr('title',teststep.glablValOfExpectedResult);
	   $('#paraStep').find('p:eq(0)').text('Please follow below steps to Import '+teststep.gConfigTestStep+'(s):');
	   $('#paraStep').find('p:eq(2)').html('&nbsp;&nbsp;2. Populate data of '+teststep.gConfigTestStep+'s as directed in template.');
	   $('#paraStep').find('p:eq(4)').html("&nbsp;&nbsp;4. Upload this saved template using Import '"+teststep.gConfigTestStep+'(s);');
	   $('#divExprt').html('Please click to export all the '+teststep.gConfigTestStep+'s within the '+teststep.gConfigTestPass+'.')
	   $('#noTP').html('No '+teststep.gConfigTestStep+'(s) Available.');
	/*************************************************************/
	
	
	multiSelectList.functionToInvoke1='teststep.delFlag = 0;teststep.pagination(this);';
	
	show.showData('teststep');
	$('.rgTableBread').show();
	isPortfolioOn = true;
    if(isPortfolioOn) 
    {
    	$(".prjHead").hide();
		$(".tpHead").hide();
    	createDD.create();
    	$('#impexpTS').attr('title','To import the '+teststep.gConfigTestStep+'s using the standard excel Template. '+
                              'User can export all '+teststep.gConfigTestStep+'s of current '+teststep.gConfigTestPass+'.');//For Hover Over Text Added by Mohini
    }
    else
    {
        $(".prjHead").hide();
        $(".tpHead").hide();
        createDD.create();
        $('#impexpTS').attr('title', 'To import the ' + teststep.gConfigTestStep + 's using the standard excel Template. ' +
                              'User can export all ' + teststep.gConfigTestStep + 's of current ' + teststep.gConfigTestPass + '.');//For Hover Over Text Added by Mohini
    	//$('#impexpTS').attr('title','To import the '+teststep.gConfigTestStep+'s using the standard excel Template.');//For Hover Over Text Added by Mohini
    	//createDD.createWithoutPort();
    }
	
	/*****Logic for storing positions*****/
	if(!teststep.positionStored)
	{
	/*
		var obj = new Array();
		var result;
		var actionListName = jP.Lists.setSPObject(teststep.SiteURL,'Action');
		var query;
		query='<Query><Where><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+teststep.testPassId+'</Value></Eq></Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="position"/></ViewFields></Query>';
		result = teststep.dmlOperation(query,'Action');
		if(result!=undefined && result!=null)
			if(result[0]["position"]==undefined || result[0]["position"]==null || result[0]["position"]=='')
				for(var j=0;j< result.length;j++)
				{	
					obj.push({'ID':result[j]['ID'],
							  'position':(j)	
					});
					var result = actionListName.updateItem(obj);
				}
		teststep.positionStored=true;
		*/
	}
	
	/* to make img non-draggable */
     $('.pasteImage').mouseover(function(e){
			$(this).bind('dragstart', function(event) { event.preventDefault(); });	               
	  });
    /**/
    
   	window.setTimeout("Main.hideLoading()", 200);
},

showTestStep:function(sel)
{

	//<--Code to handle the case:if user trying to uncheck the Test Case which is the only Test Case
	//that contains Test Steps than dont allow to uncheck it |Ejaz Waquif DT:Dec/3/2014
	if ( sel != undefined && sel != -1 && sel != "swap" && sel != "delete")
	{
		if(teststep.onlyTestCasewithTestSteps == sel.id.split("_")[1] )
		{
			teststep.alertBox('Sorry! You can\'t uncheck this '+teststep.gConfigTestCase+' as among the selected '+teststep.gConfigTestCase+'s, this is the only '+teststep.gConfigTestCase+' which has '+teststep.gConfigTestStep+'s.');//Added by Mohini for Resource file
			$(sel).attr('checked','checked');
			return;
		}
	}
	//-->

	$('#testStepGrid table').show();
	
	
	teststep.arrTestSteps.length = 0;
	teststep.allTestCaseIDsWithinSelectedTestPass.length;
	teststep.testStepIdsGlbl2.length=0;
	
	var checkedTestCaseCount=0;
	flagAll=0;//flag for select all
	
	var id =new Array();	
	$("#assotestcases div div li").each(
		function()
		{
   			if($(this).children(".mslChk").attr('checked') == true)
			{
				id.push($(this).children(".mslChk").attr('Id').split("_")[1]);		
				checkedTestCaseCount = checkedTestCaseCount+1;			
			}
			teststep.allTestCaseIDsWithinSelectedTestPass.push($(this).children(".mslChk").attr('Id').split("_")[1]);//Added by Rajiv on 10 August to resolve 2165 in an optimized way
		});
	
		
		if(id.length !=0)
		{
		
				$('#noTP').hide();
				
				$('#Pagination').show();
				
				$('#testStepGrid').show();
				
				$('#countDiv').show();
				
				$('#btnDelete').show();
				
				//Code modified for WCF data | Ejaz Waquif DT:11/28/2014 
				var data = new Array();
				if(sel == "swap")
				{
					data = teststep.result;
				}
				else
				{
				    
				    var ts_datacollection = ServiceLayer.GetData("GetTestStepsByTestPassID/" + show.testPassId, "", "TestStep");
                    
				    for (var i = 0; i < ts_datacollection.length; i++) {
				        var ts_role = [];
				        ts_datacollection[i].testStepRoleCollection =  '<root>' + ts_datacollection[i].testStepRoleCollection + '</root>';
				        var count_ts = (ts_datacollection[i].testStepRoleCollection == null) ? 0 : $($.parseXML(ts_datacollection[i].testStepRoleCollection)).find('role>roleId').length;
				        for (var j = 0; j < count_ts; j++) {
				            ts_role.push({
				                "roleId": $($($.parseXML(ts_datacollection[i].testStepRoleCollection)).find('role>roleId')[j]).text(),
				                "roleName": $($($.parseXML(ts_datacollection[i].testStepRoleCollection)).find('role>roleName')[j]).text(),
				                "countOfTestStepPlanInStartDate": $($($.parseXML(ts_datacollection[i].testStepRoleCollection)).find('role>countOfTestStepPlanInStartDate')[j]).text(),
				                "countOfTestersAssigned": $($($.parseXML(ts_datacollection[i].testStepRoleCollection)).find('role>countOfTestersAssigned')[j]).text()
				            });
				        }
				        ts_datacollection[i].testStepRoleCollection = ts_role;
				        ts_datacollection[i].roleList = ts_role;
				    }

				    teststep.dataCollection = ts_datacollection;
					teststep.testStepsCountInSelectedTP = teststep.dataCollection.length;
					
					data = teststep.dataCollection;
					
			    	$("#chkbxSelectAll").attr("checked",false);

				}
				
				if( data == "" || data == null || data == undefined)
				{
					$('#noTP').show();
					
					$('#Pagination').hide();
					
					$('#testStepGrid').hide();
					
					$('#countDiv').hide();
					
					$('#btnDelete').hide();
					
					return;
				}
				
				//if(checkedTestCaseCount==1 && sel != "swap")
					//data = teststep.sortJSON(data,"testStepSequence","asc");
					
				var loopCounter = data.length;
				
				if( loopCounter != 0 )
				{
				
					var testCaseIdsThatContainsTestSteps = new Array();
					
					var stepSequence = 0;
					
					teststep.result = new Array();
					
					var lastSequenceArr = new Array();
					
					for(var i=0 ; i<loopCounter; i++)
					{
					
						if( $.inArray( data[i].testCaseId.toString(), id ) == -1 )
						{
							continue;
						}
						
						//<-- Code to handle the case:if user trying to uncheck the Test Case which is the only Test Case
						//that contains Test Steps than dont allow to uncheck it |Ejaz Waquif DT:Dec/3/2014 
						if( sel == undefined || sel == "delete")
						{
							if( $.inArray( data[i].testCaseId, testCaseIdsThatContainsTestSteps ) ==-1 )
							{
								testCaseIdsThatContainsTestSteps.push( data[i].testCaseId );
							}
						}
						//-->
						
						var table='';
						var completeTestCaseName = teststep.TestCaseNameArrForTCID[ data[i].testCaseId ];
																												
						if( data[i].erAttachmentURL != "" )
							var attachimg = '<img title="View Attachment Details" src="/images/icon-attachment.png" alt="Attachment"></img>';
						else
							var attachimg = '&nbsp';	
																		
						expResult = ( data[i].expectedResult == undefined || data[i].expectedResult == "" ) ? '-' : data[i].expectedResult;
						
						var testStepName = data[i].testStepName;
						
						//Nikhil - 02/04/2012 - Added to handle Bullete Text
						actionName = teststep.GetFormatedText(testStepName,'false');		
									
						var completeActionName = teststep.filterData(actionName);
						
						//Added by HRW to show the data that contains "" in title
						completeActionName = completeActionName.replace(/"/g, "&quot;");
						completeTestCaseName = completeTestCaseName.replace(/"/g, "&quot;");
						
							
						completeActionName =completeActionName.replace(/(\r\n)+/g, '');
						if(actionName.indexOf("<") == -1 && actionName.indexOf(">") == -1)
							actionName=actionName;
						else
						   actionName=completeActionName;
						
						var completeExpectedResult = expResult.replace(/(\r\n)+/g, '');
		                if(expResult.indexOf("<") != -1 && expResult.indexOf(">") != -1)
		                	expResult=completeExpectedResult;
						
		               	
						var sequence = (parseInt(data[i].testStepSequence)+1).toString();
		
						table += '<tr><td style="padding-left:3px;"><input class="mslChk chkBoxTS" testStepId="'+data[i].testStepId+'"  type="checkbox"/></td><td style="text-align:center">'+(stepSequence+1)+'</td><td class="selTD">'+actionName.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</td><td>'+completeTestCaseName.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</td>' +'<td>'+expResult+'</td>';
		
						if(attachimg == '&nbsp')
							table += '<td class="center"><span>N/A</span></td>';								 
						else								 
							table +='<td class="center"><span><a onclick="teststep.onClickAttaAnch('+data[i].testCaseId	+','+ data[i].testStepId+');" style="cursor:pointer;">'+attachimg+'</a></span></td>';
						
						if( (checkedTestCaseCount==1 && teststep.testingType == "0") || teststep.testingType == "1" )
						{
							table +='<td class="center"><span><a class="sequenceup"  onclick="Main.showLoading();setTimeout(\'teststep.swapUp('+stepSequence+')\',200);" style="cursor:pointer;"><img src="/images/Admin/Road-Forward.png" style="height:30px;width:25px" /></a><a title="Edit '+teststep.gConfigTestStep+' Details" onclick="Main.showLoading();setTimeout(\'teststep.editTestStep('+data[i].testStepId+')\',200);" style="cursor:pointer;"><img src="/images/Admin/Edit1.png" style="height:25px;width:25px;padding-right:3px" /></a><a class="sequencedown"  style="cursor:pointer;"  onclick="Main.showLoading();setTimeout(\'teststep.swapDown('+stepSequence+')\',200);"><img src="/images/Admin/Road-Backward.png" style="height:30px;width:25px" /></a></span></td>'+ 
							'</tr>';		
							//<a title="Delete '+teststep.gConfigTestStep+'"'+'  onclick="teststep.deleteTestStep('+data[i].testStepId+')" style="cursor:pointer;"><img src="../SiteAssets/images/Admin/Garbage1.png" style="height:25px;width:25px" /></a>				 									 
						}
						else
						{
							table +='<td class="center"><span><a title="Edit '+teststep.gConfigTestStep+' Details" onclick="Main.showLoading();setTimeout(\'teststep.editTestStep('+data[i].testStepId+')\',200);" style="cursor:pointer;" ><img src="/images/Admin/Edit1.png" style="height:25px;width:25px;padding-right:7px" /></a></span></td>'+ 
							'</tr>';	
							//<a title="Delete '+teststep.gConfigTestStep+'"'+'  onclick="teststep.deleteTestStep('+data[i].testStepId+')" style="cursor:pointer;"><img src="../SiteAssets/images/Admin/Garbage1.png" style="height:25px;width:25px" /></a>					 									 
						}
						
						teststep.arrTestSteps.push(table);
						
						stepSequence++;
						
						teststep.result.push(data[i]);
						
						if( sel == undefined )
						{
							teststep.TestStepArrIndexMap[data[i].testStepId] = new Array();
							
							teststep.TestStepArrIndexMap[data[i].testStepId] = i;
							
							lastSequenceArr.push( parseInt(data[i].testStepSequence) );
						}
						else if( sel == "delete" )
						{
							lastSequenceArr.push( parseInt(data[i].testStepSequence) );
						}

					}
					
					//<--Code to handle the case:if user trying to uncheck the Test Case which is the only Test Case
					//that contains Test Steps than dont allow to uncheck it |Ejaz Waquif DT:Dec/3/2014
					if( sel == undefined || sel == "delete") 
					{
						if(testCaseIdsThatContainsTestSteps.length > 1)
						{
							teststep.onlyTestCasewithTestSteps = 0;
						}
						else if(testCaseIdsThatContainsTestSteps.length == 1)
						{
							teststep.onlyTestCasewithTestSteps = testCaseIdsThatContainsTestSteps[0];
						}
						
						teststep.lastSequenceWithinTP = Math.max.apply(Math, lastSequenceArr);
					}
					//-->
					
				
				}
				
	}
	else
	{
		$('#noTP').show();
		$('#Pagination').hide();
		$('#testStepGrid').hide();
		$('#countDiv').hide();
		$('#btnDelete').hide();
	}
	
	return teststep.arrTestSteps;	
	
	Main.hideLoading();		 
},

clearFields:function()
{
		//teststep.startIndexA = 0;//Added for bug 5947
		$('#ulItemstestCaseName div').css('height','130px');
		teststep.flagForTC = false;	
		//DropDown.fillStatusTestDD('status');
		teststep.flagSelectAll=0;
		enableDesignMode("rte1",'', false);	
		$('#expectedResultWithImage').html('');
		$("iframe[name='rte1'").contents().bind("paste keyup", function(e) {
			$("iframe[name='rte1'").contents().find('body').find('a').mouseover(function(e){
			   $("iframe[name='rte1'").contents().find('body').attr('contentEditable','false');
			   $(this).attr('title',$(this)[0].href); 
			});
			$("iframe[name='rte1'").contents().find('body').find('a').mouseout(function(e){
			   $("iframe[name='rte1'").contents().find('body').attr('contentEditable','true'); 
			});
			$("iframe[name='rte1'").contents().find('body').find('a').each(function(){
				$(this).unbind('click');    
				$(this).click(function(){
					window.open($(this)[0].href,'_blank');
					return false;
				});
			});
		}); 
			 $("iframe[name='rte2'").contents().bind("paste keyup", function(e) {
				
			     $("iframe[name='rte2'").contents().find('body').find('a').mouseover(function(e){
		               $("iframe[name='rte2'").contents().find('body').attr('contentEditable','false');
		               $(this).attr('title',$(this)[0].href); 
				  });
	              $("iframe[name='rte2'").contents().find('body').find('a').mouseout(function(e){
			             	$("iframe[name='rte2'").contents().find('body').attr('contentEditable','true'); 
					  });
				 	$("iframe[name='rte2'").contents().find('body').find('a').each(function(){
					$(this).unbind('click');    
		            $(this).click(function(){
			                //$("iframe[name='rte2'").contents().find('body').attr('contentEditable','true');
			                 window.open($(this)[0].href,'_blank');
			                 return false;
			             });
			        });
			});
			
		document.getElementById('status').disabled = 'disabled';
		$('#btnUpdate').hide();
		$('#reset').hide();
		$('#btnSave').show();		
		$('#btnCancelNew').show();
		$('#addNewTestStep').hide();
		$('#teststepid1').hide();
		$('#teststepid2').hide();
		$('#attachment').empty();
		teststep.testStepIdsGlblSelectAll.splice(0,teststep.testStepIdsGlblSelectAll.length);
		teststep.testStepIdsGlbl2.splice(0,teststep.testStepIdsGlbl2.length);
},

dmlOperation:function(search,list)
{
	var listname = jP.Lists.setSPObject(teststep.SiteURL,list);	
	var query = search;
	var result = listname.getSPItemsWithQuery(query).Items;
	return (result);
},

populateTestCase:function()
{
		
		teststep.roles = new Array();
		
		var TestCaseResult = new Array();
		
		//To get the data from WCF | Ejaz Waquif DT:12/2/2014 
		$.each(show.GetGroupPortfolioProjectTestPass, function(ind,itm){
		
			if(itm.projectId == show.projectId)
			{
				
				$.each(itm.testPassList, function(index,item){
					
					if(item.testpassId == teststep.testPassId)
					{
						TestCaseResult = item.testCaseList;
						
						//To get roles for Test Pass
						teststep.roles = item.listRoles;
						
						teststep.testingType = item.testingType == null || item.testingType == "" || item.testingType == "N" ? "0" : item.testingType;

					}
				});
			}
			
		});
		
		teststep.TestCaseNameArrForTCID = new Array();
		//To get Test case name by test cace id
		$.each(TestCaseResult, function(ind,itm){
			
			//teststep.TestCaseNameArrForTCID[itm.testCaseId] = new Array();
			teststep.TestCaseNameArrForTCID[itm.testCaseId] = itm.testCaseName;
			
		}); 
		
		
		if(TestCaseResult != null && TestCaseResult != undefined)
		{
				teststep.flagForTC = false; // Added by shilpa on 23 apr bug:7762
			
				/**********************************************************************************************************************************/
				document.getElementById('btnSave').disabled = false;

             
				multiSelectList.createMultiSelectList("testCaseName",TestCaseResult,"testCaseName","testCaseId","130px;","480px");
				
				multiSelectList.createMultiSelectList("assotestcases",TestCaseResult,"testCaseName","testCaseId","130px;","420px");
				$('#assotestcases div ul div li:eq(0) input').attr('checked','checked');
								
				if(teststep.testCaseIdFrmCookie == null || teststep.testCaseIdFrmCookie == undefined)
					multiSelectList.selectItem("testCaseName",TestCaseResult[0]["testCaseId"]);
				else
					multiSelectList.setSelectedItemsFromArray("testCaseName",teststep.testCaseIdFrmCookie);
                  
		}
		else
		{
			$('#testCaseName').html('<div style="border:1px #ccc solid;width:480px;height:165px"> No Test Case Available.</div>');
		}
},

//Nikhil - 2/03/2012 - Returns Formated Text for Actual and Expected Results.
GetFormatedText:function(sText,FromExport)
{
	if(FromExport=='true')
	{
		var sNewLine='\n';
		if(FromExport=='true')
		{
			sNewLine='\n';
		}
		else
		{
			sNewLine='<br/>';
		}
		var sResult ='';
		var FlagBullete='false';
  		
		$('#dvTemp').html('');
		$('#dvTemp').html(sText);
		var length = $('#dvTemp').find('p').length-1;
			
		if(length>0)
		{
			for(i=0;i<=length;i++)
			{
				FlagBullete='false';
				var txtText;
				var pElement= $('#dvTemp').find('p')[i];
				
					// case for Special bullete 
				if(pElement.childNodes.length==1)
				{
					//if(pElement.childNodes[0].nodeName=='A')
					if(pElement.childNodes[0].childNodes.length >= 2)
					{
						pElement= pElement.childNodes[0];
					}
				}
				// Handle Three Span to determine bullete.
				
				if(pElement.childNodes.length>=2)
				{
					FlagBullete='true';
				}
						
				if(pElement.childNodes.length>=2)
				{
					txtText= pElement.childNodes[pElement.childNodes.length-1].innerText;
						
					if(txtText!=undefined && txtText!=null && txtText!='')
					{	
						if(FlagBullete=='true')
						{
							sResult = sResult+'*  '+txtText+sNewLine;	//'\n';
						}
						else
						{
							sResult = sResult + txtText+sNewLine;	//'\n';
						}
					}
				}
				else
				{
					sResult = sResult + $('#dvTemp').find('p')[i].innerText +sNewLine;	//'\n';
				}
			}
		}
		else
		{
			// Remove <br />
			while(sText.indexOf('<br />')!=-1)
			{
				sText= sText.replace('<br />','');
			}
			sResult= sText;
		}
	  	return sResult;
  	}
  	else
  	{
  		var arrBullet= teststep.sBulleteChar.split(',');
		for(i=0;i<=arrBullet.length-1;i++)
		{
			while(sText.indexOf('>'+arrBullet[i]+'<span')!=-1)
			   	sText= sText.replace('>'+arrBullet[i]+'<span','>*<span');
		}
		return sText;
  	}
},

filterData:function (info2)
{
   		var mydiv = document.createElement("div");
        mydiv.innerHTML = info2;
        if(navigator.appName=="Microsoft Internet Explorer")
        	info2=mydiv.innerText;    
        else
        	info2=mydiv.textContent;	        
		return  info2;     
},

populateRole:function()
{
	//var query = '<Query><Where><Eq><FieldRef Name="ProjectID" /><Value Type="Text">'+teststep.projectId+'</Value></Eq></Where>'+
				//'<ViewFields><FieldRef Name="ID"/><FieldRef Name="Role" /><FieldRef Name="Tester" /></ViewFields>'+
				//'</Query>';
		
        var TesterRoles =new Array();
		//TesterRoles = teststep.dmlOperation(query,'TesterRole');
		//teststep.roles=TesterRoles;
		TesterRoles = $.grep(teststep.roles,function(item){ 
		
						return item.roleId != "1";
					  });
		if(TesterRoles!= null && TesterRoles!= undefined)
		{			
			$("#role").html('');
			multiSelectList.createRoleMultiSelectList("role",TesterRoles,"roleName","roleId","130px;")//changed by rajiv on 15 march 2012
			if(teststep.roleIdFrmCookie== null || teststep.roleIdFrmCookie== undefined)
				multiSelectList.selectNone("role");
			else
				multiSelectList.setSelectedItemsFromArray("role",teststep.roleIdFrmCookie);
		}
		else
		{
			teststep.createMultiSelectList("role","130px;");
		}
},

createMultiSelectList:function(divID,height)
{
	var divhtml="";
	var divhtml="<div class='Mediumddl' style='border: solid 1px #ccc;  width:447px; padding-left:1px;'>"+
				
				"<ul id='ulItems"+divID+"' style='list-style-type:none; list-style-position:outside;display:inline;'>"+
					"<li>Select:&nbsp;<a id='linkSA_"+divID+"' style='color:blue; text-decoration:underline; cursor:pointer' onclick='multiSelectList.selectAll(\""+divID+"\");'>All</a>"+
						 "&nbsp;&nbsp;&nbsp;<a id='linkSN_"+divID+"' style='color:blue; text-decoration:underline; cursor:pointer' onclick='multiSelectList.selectNone(\""+divID+"\");'>None</a>"+
						 "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;Show:&nbsp;<a id='anchShow_"+divID+"' style='color:blue; text-decoration:underline; cursor:pointer' onclick='multiSelectList.toggleSelectionDisplay(\""+divID+"\");"+multiSelectList.functionToInvoke+"'>Selected</a></li>"+
					"<li><hr/></li>"+
					//"<div style='overflow-y:scroll; height:"+multiSelectList.height+" width:290px'>";
					"<div style='overflow-y:scroll; height:"+height+" width:447px'>";
					
	var itemId = divID+"_1";
	divhtml=divhtml+"<li title='Standard'><input id='"+itemId+"'  type='checkbox' class='mslChk'></input><span id='"+itemId+"' style=\"display: none;\">Standard</span>Standard</li>";
	divhtml+="</div></ul></div>";
	$("#"+divID).html(divhtml);										

},


flagForSave : false,

saveTestStep:function()
{
	impTS.flagForImport = 1;
	
	teststep.flagForSave = true;
	
	Main.showLoading();	
	
	teststep.TestPassStatus.length=0;
	
	teststep.ExpectedResult = $('#expectedResultWithImage').html();
	
	//code added on 30 March for Richtextbox for teststep name by sheetal////
	updateRTE('rte1');
	
	var testStepName =document.getElementById('hdn' + 'rte1').value.replace(/&nbsp;/g,'').replace(/^\s+|\s+$/g, "");//Added by HRW for bug 5963
	
	jQuery.trim(testStepName);	
	
	testStepDetail =document.getElementById('hdn' + 'rte1').value.replace(/&nbsp;/g,'').replace(/^\s+|\s+$/g, "");//Added by HRW for bug 5963
	
	jQuery.trim(testStepDetail);
	
	testStepDetail = (testStepDetail.length == 0) ? '-' : testStepDetail;
	
	var testCaseID =new Array();
	
	$("#testCaseName div div li").each( function(){
	
		if($(this).children(".mslChk").attr('checked') == true)
			testCaseID.push($(this).children(".mslChk").attr('Id').split("_")[1]);	
			
	});	

    testCaseID.join(",");    
    
    var roleIDs = new Array();
    
    teststep.RoleNameBasedOnRoleID.length=0;
    
    if(testStepName.indexOf("~") == -1 && testStepDetail.indexOf("~") == -1)
	{
		if(testStepName.length == 0 || testCaseID == null || testCaseID == undefined || testCaseID == '' || $("#role div div li").find(":checked").length == "0")
			teststep.alertBox("Fields marked with asterisk(*) are mandatory field!");
		else
		{		
			 $("#role div div  li").each(function()
			 {
				if($(this).children(".mslChk").attr('checked') == true)
				{
					roleIDs.push($(this).children(".mslChk").attr('Id').split("_")[1]);	
						
					multiSelectList.allRolesUnchecked=false;			
				}
				
				teststep.RoleNameBasedOnRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();
			 });
		
			//To get the roles that has Tester available WCF changes |Ejaz Waquif DT:12/2/2014 
			var rolesWithTester = new Array();
			
			teststep.flagForSaveMessage1 = true;
			
			teststep.roleNotSaved = new Array();
			
			$.each( teststep.roles,function(ind,itm){
			
				if( $.inArray(itm.roleId, roleIDs ) != -1)
				{
					if(itm.isTestersAssigned == 1)
					{
						rolesWithTester.push(itm.roleId);
					}
					else
					{
						teststep.roleNotSaved.push(itm.roleId);
						
						teststep.flagForSaveMessage1 = false;
					}
				}
			
			});
			
			//If No Role(s) contain Tester than show the message
			if(rolesWithTester.length == 0)
			{
				teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the selected "+teststep.gCongfigRoles.toLowerCase()
								  +", hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be added with the selected "
								  +teststep.gCongfigRoles.toLowerCase()+"!");//Added by Mohini for Resource file
								  
				Main.hideLoading();	
							  
				return;				  
			}
			
			var rolesPresentForTester = 0;
			
			if(rolesWithTester.length > 0)
			{
				rolesPresentForTester = rolesWithTester;
			}
			
			if(rolesPresentForTester == 0)
			{
				if(multiSelectList.allRolesUnchecked==false)
					teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the selected "+teststep.gCongfigRoles.toLowerCase()+", hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be saved with the selected "+teststep.gCongfigRoles.toLowerCase()+"!");//Added by Mohini for Resource file
				else
				    teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the standard "+teststep.gCongfigRole.toLowerCase()+"(default "+teststep.gCongfigRole.toLowerCase()+"), hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be saved!");//Added by Mohini for Resource file
			}
			else if($('#ulItemstestCaseName input:checked').length > 1)   /*Code added by Deepak for sequencing*/
  			{
				teststep.alertBox("Cannot save "+teststep.gConfigTestStep.toLowerCase()+" under more than one "+teststep.gConfigTestCase.toLowerCase()+"!");//Added by Mohini for Resource file    
		    }/*Code added by Deepak for sequencing*/
			else
			{
					
					var data={
						'testCaseId':testCaseID[0],
						'testStepName':testStepName,
						'expectedResult':teststep.ExpectedResult,
						'testStepSequence': (teststep.lastSequenceWithinTP + 1).toString() ,//testStepsCountInSelectedTP
						'roleArray':rolesPresentForTester,
						'action':'add'
					};
					
					var result = ServiceLayer.InsertUpdateData("InsertUpdateTestStep", data, "TestStep");
					
			    //if( result == "ErrorDetails")
					if (result.ErrorDetails != undefined || result.ErrorDetails != null)
					{
						teststep.alertBox(teststep.gConfigTestStep+' with "'+testStepName+'" name already exists!');
						Main.hideLoading();
						return;
					}
					
					if(teststep.flagForSaveMessage1==true)
					{
						setTimeout(function(){ Main.AutoHideAlertBox(teststep.gConfigTestStep+" added successfully!")},1);
						//teststep.alertBox(teststep.gConfigTestStep+" added successfully!");//Added by Mohini for Resource file
						//$(".navTabs h2:eq(0)").click();
					}
					else
					{
						var roleNames=new Array();
						
						for(var i=0;i<teststep.roleNotSaved.length;i++)
							roleNames.push(teststep.RoleNameBasedOnRoleID[teststep.roleNotSaved[i]]);
							
						var msg=teststep.gConfigTestStep+" is added successfully but it could not be saved under "+teststep.gCongfigRoles+" "+roleNames+" as it does not have any "+teststep.gConfigTester+" with these "+teststep.gCongfigRoles;//Added by Mohini for Resource file
						
						teststep.alertBox(msg);
					}
	
					teststep.clearFields();
					
					teststep.showTestStep();

					multiSelectList.selectNone("role");
					
					//$('.navTabs h2:eq(1)').click();

					$('.navTabs h2:eq(0)').click();	// For view all
					
			}			
		}
	}
	else
		teststep.alertBox("~ is not allowed in "+$('#lblPNameStar').text().substring(0,$('#lblPNameStar').text().length-2)+" and "+$('#lblExpRes').text().substring(0,$('#lblExpRes').text().length-1)+"!");//Added by Mohini for Resource file
	
	window.setTimeout("Main.hideLoading()", 200);
},


testerListItem : new Array(),
preSaveTestStep:function(roleIDs,testCaseID)
{
	/* Algorithm :
		1. fetch ID from TestPassToTestCaseMapping based on testpass id and testcase id
		2. for each test case selected make entry in TestCaseToTestStep containing ( fetched id from step 1, teststepID, status=Not Completed) 
	*/	
	
	if(teststep.ParentResultForSave != undefined)
		teststep.ParentResultForSave.length = 0;
	var newRole=new Array();	
	var flagForRole=0;	
	var testPassIDs = new Array();
	
	var iteration= Math.ceil((testCaseID.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
	var iterationStartPoint=0;
	for(var y=0;y<iteration;y++)
    {
	   if(y!=iteration-1)
	   {
      		var q = '';
      		var camlQuery = '<Query><Where>';	
      		var camlQueryForParentMapping = '<Query><Where>';	
			for(var u=0+iterationStartPoint;u<(147+iterationStartPoint)-1;u++)			 
			{
				camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+testCaseID[u]+'</Value></Eq>';
				camlQueryForParentMapping += '<Or><Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+testCaseID[u]+'</Value></Eq>';
				q += '</Or>';		
	        }			
			camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+testCaseID[u]+'</Value></Eq>';
			camlQueryForParentMapping += '<Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+testCaseID[u]+'</Value></Eq>';
			
	        if(q != '')
			{
				camlQuery += q;	
				camlQueryForParentMapping += q;
			}	
												
			camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="TestPassID" /></ViewFields></Query>';	
			camlQueryForParentMapping +='</Where><ViewFields><FieldRef Name="TestPassID"/><FieldRef Name="status"/><FieldRef Name="SPUserID"/><FieldRef Name="Title" /></ViewFields></Query>';
			
			iterationStartPoint+=147;

			var TestCasesItems = teststep.dmlOperation(camlQuery,'TestCases');
			if(TestCasesItems !=null && TestCasesItems !=undefined)
			{
				//Code added by HRW for optimization	
				for(var i=0;i<TestCasesItems.length;i++)
				{
					var testPassIDsForTC = TestCasesItems[i]['TestPassID'].split(",");
					for(var aa=0;aa<testPassIDsForTC.length;aa++)
					{
						if($.inArray(testPassIDsForTC[aa],testPassIDs) == -1)
							testPassIDs.push(testPassIDsForTC[aa]);
					}		
				}
			}
			if(teststep.flagForSave == true)
			{
				var parentResult = teststep.dmlOperation(camlQueryForParentMapping,'TestPassToTestCaseMapping');
				if(parentResult != null && parentResult != undefined)
				{
					for(var mm=0;mm<parentResult.length;mm++)
					{
							teststep.ParentResultForSave.push(parentResult[mm]);
					}
				}	
			}		
	  	  }
		  else
		  {
				var q = '';
				var camlQuery = '<Query><Where>';
				var camlQueryForParentMapping = '<Query><Where>';
				for(var w=iterationStartPoint;w<(testCaseID.length)-1;w++)			 
				{
					camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+testCaseID[w]+'</Value></Eq>';
					camlQueryForParentMapping += '<Or><Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+testCaseID[w]+'</Value></Eq>';
					q += '</Or>';	
				}
				camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+testCaseID[w]+'</Value></Eq>';	
				camlQueryForParentMapping += '<Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+testCaseID[w]+'</Value></Eq>';
				
				if(q != '')
				{
					camlQuery += q;		
					camlQueryForParentMapping += q;
				}							
				camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="TestPassID" /></ViewFields></Query>';	
				camlQueryForParentMapping +='</Where><ViewFields><FieldRef Name="TestPassID"/><FieldRef Name="status"/><FieldRef Name="SPUserID"/><FieldRef Name="Title" /></ViewFields></Query>';
			
				var TestCasesItems = teststep.dmlOperation(camlQuery,'TestCases');
				if(TestCasesItems !=null && TestCasesItems !=undefined)
				{
					//Code added by HRW for optimization	
					for(var i=0;i<TestCasesItems.length;i++)
					{
						var testPassIDsForTC = TestCasesItems[i]['TestPassID'].split(",");
						for(var aa=0;aa<testPassIDsForTC.length;aa++)
						{
							if($.inArray(testPassIDsForTC[aa],testPassIDs) == -1)
								testPassIDs.push(testPassIDsForTC[aa].replace(/\|/g,''));
						}		
					}
				}
				if(teststep.flagForSave == true)
				{
					var parentResult = teststep.dmlOperation(camlQueryForParentMapping,'TestPassToTestCaseMapping');
					if(parentResult != null && parentResult != undefined)
					{
						for(var mm=0;mm<parentResult.length;mm++)
						{
							teststep.ParentResultForSave.push(parentResult[mm]);
						}
					}	
				}						
		   }
	  }
	//Ankita: 8/27/2012 Bulk Data Handling 
	var testerList = jP.Lists.setSPObject(Main.getSiteUrl(),'Tester');
	if(testPassIDs.length<=147)
	{		
		var q = '';
		var camlQuery = '<Query><Where>';
		for(var iii=0;iii<testPassIDs.length-1;iii++)
		{
			camlQuery += '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
			q += '</Or>';	
		}	
		camlQuery += '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
		if(q != '')
			camlQuery += q;
		camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="RoleID" /></ViewFields></Query>';
		var testerListItem = testerList.getSPItemsWithQuery(camlQuery).Items;
	}
	else
	{
		var numberOfIterations=Math.ceil(testPassIDs.length/147);
		var iterationsPoint=0;
		var orEndTags;
		var camlQuery;
		var testerListItem= new Array();
		for(var y=0; y<numberOfIterations-1; y++)
		{
			camlQuery = '<Query><Where>';
			orEndTags='';
			for(var iii=iterationsPoint; iii<(iterationsPoint+147)-1; iii++)
			{	
				camlQuery += '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
				orEndTags += '</Or>';
			}
			camlQuery += '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
			camlQuery += orEndTags;
			camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="RoleID" /></ViewFields></Query>';
			var TesterResult = testerList.getSPItemsWithQuery(camlQuery).Items;
			if(TesterResult != null && TesterResult != undefined)
				$.merge(testerListItem,TesterResult);
			iterationsPoint+=147;
		}
		camlQuery = '<Query><Where>';
		orEndTags='';
		for(var iii=iterationsPoint; iii<testPassIDs.length-1; iii++)
		{	
			camlQuery += '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
			orEndTags += '</Or>';
		}
		camlQuery += '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassIDs[iii]+'</Value></Eq>';
		camlQuery += orEndTags;
		camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="RoleID" /></ViewFields></Query>';
		var TesterResult = testerList.getSPItemsWithQuery(camlQuery).Items;
		if(TesterResult != null && TesterResult != undefined)
			$.merge(testerListItem,TesterResult);

	}
	if(testerListItem !=null && testerListItem!=undefined)
	{
		teststep.testerListItem = testerListItem;//Added by HRW for optimization
		for(x in testerListItem)
	    {
		      var temp=parseInt(testerListItem[x]['RoleID']).toString();
		      //Added on 19 July 2012
		      if($.inArray(temp,roleIDs)!=-1)//roleIDs are Role(s) selected by User
			  {	
				 if($.inArray(temp,newRole)==-1)//Added by Harshal on 8 Feb 2012
			    	newRole.push(temp);
			  }
	    } 
	}
	
	//Code added by Harshal on 3/01/11
	if(newRole.length>0)
	{
		/*Code Modified by Rajiv and Harshal on 1 feb to return correct flag as per role availibity of test step*/
		for(var xy=0;xy<roleIDs.length;xy++)
		{
			if($.inArray(roleIDs[xy],newRole)!=-1)
			{	flagForRole=1;
			    break;
			}
		}
		
		if(flagForRole==1)
		 	return newRole;
		else 
		 	return 0;
	}
	else
		return 0;
},


//saveTestCaseToTestStepMapping:function(testStepID,roleIDs,testCaseID)
//{
//	/* Algorithm :
//		1. fetch ID from TestPassToTestCaseMapping based on testpass id and testcase id
//		2. for each test case selected make entry in TestCaseToTestStep containing ( fetched id from step 1, teststepID, status=Not Completed) 
//	*/		
//	/******code added for master list*******/
//	teststep.flagForSaveMessage1=true;
//	teststep.TestPassNameBasedOnTestPassID.length=0;
//	//Code added by Rajiv and Harshal on 31 jan to save testpassname to be stored in MY activity list//  
//	$("#testPassName > option").each(function(){
//		teststep.TestPassNameBasedOnTestPassID[this.value] = this.text; 
//	});  
    
//	var TesterSPUserIDWithRoleArray=new Array();
//	var XCounters=0;
//	var AllRoles = new Array();
//	var availableTestersRolesForTestPass = new Array();
//	var availableTestersRolesForTestPass2 = new Array();
//	var TestPassToBeConsideredInChildMappingList = new Array();
//	teststep.TestPassWithNoRolesOfTestStep.length = 0;
//	var listname = jP.Lists.setSPObject(teststep.SiteURL,'TestCaseToTestStepMapping');
//    /******code added for master list******/
                 
//    var testPassListItems = new Array();
//    var ParentMappingIDForCombOfTPIDAndSPUserID = new Array(); //To maitain ParentMapping( ID ) for combination of( TestPassID & SPUSerID )
//    var TestPassIDs = new Array();
//    var forParentIDGetTCID = new Array();
//    var forParentIDGetTPID = new Array();
//    var forParentIDGetSPID = new Array();

//    for(var i=0;i<teststep.ParentResultForSave.length;i++)			 
//	{
//		var combOfTPIDAndSPUserID = teststep.ParentResultForSave[i]["TestPassID"]+","+ teststep.ParentResultForSave[i]["SPUserID"];
//		if(ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID] == undefined)
//			ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID] = teststep.ParentResultForSave[i]["ID"];
//		else
//			ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID]+= "," + teststep.ParentResultForSave[i]["ID"];	
			
//		if($.inArray(teststep.ParentResultForSave[i]["TestPassID"],TestPassIDs) == -1)
//			TestPassIDs.push(teststep.ParentResultForSave[i]["TestPassID"]);		
//		forParentIDGetTCID[teststep.ParentResultForSave[i]['ID']] = teststep.ParentResultForSave[i]["TestCaseID"];
//	    forParentIDGetTPID[teststep.ParentResultForSave[i]['ID']] = teststep.ParentResultForSave[i]["TestPassID"];
//	    forParentIDGetSPID[teststep.ParentResultForSave[i]['ID']] = teststep.ParentResultForSave[i]["SPUserID"];	
//	}

//	var testerListItem = teststep.testerListItem;
//    var testPassListItems = new Array();
    
	
//	//Added by HRW on 5 Sep 2012
//	var iteration= Math.ceil((TestPassIDs.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//	var iterationStartPoint=0;
//	for(var y=0;y<iteration;y++)
//    {
//	   if(y!=iteration-1)
//	   {
//	 		var q = '';
//			var camlQuery = '<Query><Where>';
      					
//			for(var u=0+iterationStartPoint;u<(147+iterationStartPoint)-1;u++)			 
//			{
//				camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassIDs[u]+'</Value></Eq>';
//				q += '</Or>';
//	        }			

//			camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+TestPassIDs[u]+'</Value></Eq>';
			
//			if(q != '')
//				camlQuery += q;
		
//			camlQuery +='</Where><ViewFields><FieldRef Name="AllRoles"/><FieldRef Name="ID"/><FieldRef Name="Status" /><FieldRef Name="ProjectId" /></ViewFields></Query>';	
			
//			iterationStartPoint+=147;  
//			var Result = teststep.dmlOperation(camlQuery,'TestPass');
//			if(Result != null && Result != undefined)
//				$.merge(testPassListItems,Result);
//	   }
	   
//	    var q = '';
//		var camlQuery = '<Query><Where>';
  					
//		for(var u=iterationStartPoint;u<TestPassIDs.length-1;u++)			 
//		{
//			camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassIDs[u]+'</Value></Eq>';
//			q += '</Or>';
//        }			
//		camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+TestPassIDs[u]+'</Value></Eq>';
//        if(q != '')
//			camlQuery += q;
	
//		camlQuery +='</Where><ViewFields><FieldRef Name="AllRoles"/><FieldRef Name="ID"/><FieldRef Name="Status" /><FieldRef Name="ProjectId" /></ViewFields></Query>';	
		
//		var Result = teststep.dmlOperation(camlQuery,'TestPass');
//		if(Result != null && Result != undefined)
//			$.merge(testPassListItems,Result);
//	}
//    var AllRolesForTestPassID=new Array();
//    var ProjectID = '';
//    if(testPassListItems != null && testPassListItems != undefined)
//	{
//	    ProjectID = testPassListItems[0]['ProjectId'];
//	    for(var ii=0;ii<testPassListItems.length;ii++)
//	    {
//	    	AllRolesForTestPassID[testPassListItems[ii]['ID']] = testPassListItems[ii]['AllRoles'];
//	    	teststep.TestPassStatus[testPassListItems[ii]['ID']] = testPassListItems[ii]['Status'];
//	    }	
//	 }   
		
//	  ////////////////////////////////////////////////// This is code is moved to up by Harshal & Rajiv on 10 Feb/////////////////////////////////////////////////
//	  var role=new Array();//To maintain the roles whose testers are available
//	  var role2=new Array(); 
//	  var newRole=new Array();//To maintain all the selected roles whose tester(s) is/are present.
//	  var parentMappingIDsToBeSavedInChildMapping = new Array(); 
//	  if(testerListItem!= null && testerListItem != undefined)
//	  { 
//       	var TesterSPUSerIDArray=new Array();
//		 for(var x=0;x<testerListItem.length;x++)
//	     {
//		      var temp=parseInt(testerListItem[x]['RoleID']);
//		      role2.push(temp.toString())
//		      var roleAndSPUserID = temp + "," + testerListItem[x]['SPUserID'];
//		      role.push(roleAndSPUserID);//To manintain the roles whose testers are available
		      
//		      /**Code added by Rajiv on 1 feb to track testers' roles availability for each testpasses(of the selected testcase)**/ 
		         		
//				if(availableTestersRolesForTestPass[testerListItem[x]['TestPassID'] +"," + testerListItem[x]['SPUserID']] == undefined 
//					|| availableTestersRolesForTestPass[testerListItem[x]['TestPassID'] +"," + testerListItem[x]['SPUserID']].length==0)
//				{	
//					availableTestersRolesForTestPass[testerListItem[x]['TestPassID'] +"," + testerListItem[x]['SPUserID']]=parseInt(testerListItem[x]['RoleID']).toString();
//				}
//				else
//				{
//					availableTestersRolesForTestPass[testerListItem[x]['TestPassID'] +"," + testerListItem[x]['SPUserID']]+=","+parseInt(testerListItem[x]['RoleID']).toString();
//				}
		
//				if(availableTestersRolesForTestPass2[testerListItem[x]['TestPassID']] == undefined 
//					|| availableTestersRolesForTestPass2[testerListItem[x]['TestPassID']].length==0)
//				{	
//					availableTestersRolesForTestPass2[testerListItem[x]['TestPassID']]=parseInt(testerListItem[x]['RoleID']).toString();
//				}
//				else
//				{
//					availableTestersRolesForTestPass2[testerListItem[x]['TestPassID']]+=","+parseInt(testerListItem[x]['RoleID']).toString();
//				}

//	            /**code added for master list**/
//			     if($.inArray(temp.toString(),roleIDs)!=-1)
//			      { 
//				      	if($.inArray(testerListItem[x]['SPUserID']+','+temp.toString()+','+testerListItem[x]['TestPassID'],TesterSPUSerIDArray)==-1)
//		         		{	
//		         			TesterSPUserIDWithRoleArray[XCounters]=new Array(); 
//		         			TesterSPUserIDWithRoleArray[XCounters][0]=testerListItem[x]['SPUserID'] + "," + testerListItem[x]['TestPassID']; //Code modified By Rajiv and Harshal on 31 jan 2012 to append testpass ID to which the tester belongs
//		         			TesterSPUserIDWithRoleArray[XCounters][1]=temp.toString();
//		         			TesterSPUSerIDArray.push(testerListItem[x]['SPUserID']+','+temp.toString()+','+testerListItem[x]['TestPassID']); //code modified by rajiv on 1 feb to make entry in my activity for another associated test pass
//		         			if($.inArray(temp.toString(),AllRoles) == -1)
//		         			{
//		         				AllRoles.push(temp.toString());
//		         			}	
//		         			XCounters=XCounters+1; 
//		         		}
//			      }
		      
//		      /**code added for master list**/
//			/*   Code added by Rajiv & Harshal on 10 Feb 2012 to maitain ParentMapping( ID )s to be stored in Childmapping */
//				var combOfTPIDAndSPUserID1 = '';
//				if($.inArray(parseInt(testerListItem[x]['RoleID']).toString(),roleIDs) != -1)
//		        	combOfTPIDAndSPUserID1 = testerListItem[x]['TestPassID']+","+testerListItem[x]['SPUserID'];
//		        if(combOfTPIDAndSPUserID1 != '')	
//	    			$.merge(parentMappingIDsToBeSavedInChildMapping,ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID1].split(","));
//	    	} 
//	    	   /*Code to maintain only those selected roles whose testers are available*/
		  		
//				for(var f=0;f<role.length;f++)
//				{
//					if($.inArray(role[f].split(",")[0],roleIDs)!=-1) //roleIDs array contains all the selected roles
//					{	
//						if($.inArray(role[f].split(",")[0],newRole)==-1)
//					    	newRole.push(role[f].split(",")[0]); //all the roles whose tester(s) is/are present.
//					}
//				}

//				/*********************************************************/
//				//Added by Harshal on 8 Feb 2012 for solving Bug of Bug ID 347
//				teststep.roleNotSaved.length=0;
//				for(var mm=0;mm<roleIDs.length;mm++)
//				{
//					if($.inArray(roleIDs[mm],role2)==-1) 
//					{
//						if($.inArray(roleIDs[mm],teststep.roleNotSaved)==-1)
//						{
//							teststep.roleNotSaved.push(roleIDs[mm]);
//							teststep.flagForSaveMessage1=false;
//						}	
//					}
//				}
//		 } 
		
//		if(teststep.ParentResultForSave != null && teststep.ParentResultForSave != undefined)
//		{			
//			var storeIt=false;
//			var objForTestPassStatus = new Array();
//			var objForProjectStatus = new Array();
//			var objForParentListStatus = new Array();
//			var FlagForProjectStatus = true;
//			var TPID = new Array(); 
//			var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//			var ProjectList = jP.Lists.setSPObject(teststep.SiteURL,'Project');
//			var ParentList = jP.Lists.setSPObject(teststep.SiteURL,'TestPassToTestCaseMapping');
		
//			var TesterSPUSerIDArray=new Array();
//			for(var m=0;m<teststep.ParentResultForSave.length;m++)
//			{
//				if(newRole.length>0)
//				{	
//					var obj = new Array();	
//					for(var nwrcnt=0;nwrcnt<newRole.length;nwrcnt++)
//					{
//					   var allRolesOfTestPass = new Array();
//					   var availableTestersRoles = new Array();
//					   var availableTestPassRoles = new Array();
//					   availableTestPassRoles = availableTestersRolesForTestPass2[teststep.ParentResultForSave[m]['TestPassID']].split(",");
//					   if($.inArray(newRole[nwrcnt],availableTestPassRoles)!=-1 )
//					   {
//						   availableTestersRoles =availableTestersRolesForTestPass[teststep.ParentResultForSave[m]['TestPassID']+ "," +teststep.ParentResultForSave[m]['SPUserID']].split(",");
//						   allRolesOfTestPass = AllRolesForTestPassID[teststep.ParentResultForSave[m]['TestPassID']].split(",");  //Code modified by Rajiv and Harshal on 31 jan to save only those testpasses which have tester(s) with role(s) of test step to be saved.
//	/*commented by rajiv on 1 feb as it is not working as expected*/ //if($.inArray(newRole[nwrcnt],allRolesOfTestPass)!=-1)  //Code modified by Rajiv and Harshal on 31 jan to save only those testpasses which have tester(s) with role(s) of test step to be saved.
//						   if($.inArray(newRole[nwrcnt],availableTestersRoles)!=-1 )
//						   {	
//						        if($.inArray(teststep.ParentResultForSave[m]['ID'],parentMappingIDsToBeSavedInChildMapping)!=-1)
//								{
//									obj = new Array();
//									obj.push({'Title':'TestCaseToTestStepMapping',
//										  	  'TestPassMappingID':teststep.ParentResultForSave[m]['ID'],
//										  	  'TestStep':testStepID,
//										  	  'status': 'Not Completed',
//										  	  'Role':newRole[nwrcnt],
//										  	  'TestPassID':forParentIDGetTPID[ teststep.ParentResultForSave[m]['ID'] ],	
//											  'TestCaseID':forParentIDGetTCID[ teststep.ParentResultForSave[m]['ID'] ],
//											  'SPUserID':forParentIDGetSPID[ teststep.ParentResultForSave[m]['ID'] ]		
//									});
//									var res = listname.updateItem(obj);
									
//									//Added for updating the status of Parent List on 13 April 2012
//									if(teststep.ParentResultForSave[m]['status'] == "Pass")
//									{
//										objForParentListStatus.push({
//											'ID' : teststep.ParentResultForSave[m]['ID'],
//											'status' : 'Not Completed'
//										});
//									}	
//									if(teststep.TestPassStatus[teststep.ParentResultForSave[m]['TestPassID']] == "Complete" && $.inArray(teststep.ParentResultForSave[m]['TestPassID'],TPID) == -1)
//									{
//										TPID.push(teststep.ParentResultForSave[m]['TestPassID']);
//										objForTestPassStatus.push({
//											'ID' : teststep.ParentResultForSave[m]['TestPassID'],
//											'Status' : 'Active'
//										});
										
//										if(FlagForProjectStatus == true)
//										{
//											objForProjectStatus.push({
//											'ID' : ProjectID,
//											'status' : 'Active'
//											});
//											FlagForProjectStatus = false;
//										}
//									}	
//								}	
//							}
//						}	
//						else
//						{	
//							teststep.TestPassWithNoRolesOfTestStep.push(teststep.TestPassNameBasedOnTestPassID[ teststep.ParentResultForSave[m]['TestPassID'] ]);
//							teststep.flagForSaveMessage=false;
//						}
//					}	
//					/*Commneted by HRW as the data is not saving in a list for bulk
//					if(obj.length>0)
//						var res = listname.updateItem(obj);*/
						
//					if(objForParentListStatus.length>0)
//						var res = ParentList.updateItem(objForParentListStatus);	
						
//					if(objForTestPassStatus.length>0)
//						var res = TestPassList.updateItem(objForTestPassStatus);
						
//					if(objForProjectStatus.length>0)
//						var res = ProjectList.updateItem(objForProjectStatus);
//				}
//				else //if user has selected all the roles for which there are no testers
//				{
//					//teststep.alertBox("There is no tester with the selected role(s), hence the test step cannot be saved with the selected role(s)!");
//					teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the selected "+teststep.gCongfigRoles.toLowerCase()+", hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be saved with the selected "+teststep.gCongfigRoles.toLowerCase()+"!");//Added by Mohini for Resource file
//					Main.hideLoading();
//				}
//			}
//		}		
//	if(impTS.flagForImport == 1)	
//		teststep.saveDetailsInMasterList(TesterSPUserIDWithRoleArray,AllRoles,"",testCaseID,"","");////******code added for master list*******/
//	else
//		impTS.saveDetailsInMasterList(TesterSPUserIDWithRoleArray,AllRoles,"",testCaseID,"","");	
//},


alertBox:function(msg){
	$("#divAlert").html(msg);
	$('#divAlert').dialog({height: 150,title: "",modal: true, buttons: { "Ok":function() { $(this).dialog("close");}} });
},

alertBox1:function(msg){
	$("#divAlert").html(msg);
	$('#divAlert').dialog({height: 150,title: "",modal: true, buttons: { "Ok":function() { $('#testStepGrid').load(); $(this).dialog("close");}} });
},

popUpForExpected:function(){
	$('#expectedResultPreview').html($('#expectedResultWithImage').html());
	teststep.enableHyperlink('#expectedResultPreview');
	$('#clipBrdImage').dialog({height: 550,width: 550,resizable:false, modal: true, buttons: {
		"Save": function(){
			$('#expectedResultWithImage').html($('#expectedResultPreview').html());
			$( this ).dialog( "close" );
		}, 
	
		"Cancel": function(){
			$( this ).dialog( "close" );
		} 
	} 
	});
},
  
enableHyperlink:function(element){
	$(element).find('a').mouseover(function(e){
	    $(element).attr('contentEditable','false');
	    $(this).attr('title',$(this)[0].href); 
	});
	$(element).find('a').mouseout(function(e){
		$(element).attr('contentEditable','true'); 
	});
	$(element).find('a').each(function(){
		$(this).unbind('click');    
	    $(this).click(function(){
	        window.open($(this)[0].href,'_blank');
	        return false;
		});
	});
	$('#expectedResultPreview').click(function(){
		$("#clipBrdImage").height(600);
	});
},

arr:new Array(),
initpage:function(page_index, jq)
{
    var items_per_page = 10;
    if(teststep.arr != null && teststep.arr != undefined)
    {
    	var max_elem = Math.min((page_index+1)*items_per_page,teststep.arr.length);
	    var newhtml = '';
	    for(var i=page_index*items_per_page;i<max_elem;i++)
	    {
	        newhtml=newhtml+teststep.arr[i];
	    }     
	    if(newhtml == '')
	    {
	    	$("#Pagination").css('display','none');
	    	$("#noTP").css('display','');
	    }
	    else
	    {
	    	$('#showTestSteps').html("");
	    	$('#showTestSteps').html(newhtml);
	    	
	    	//To show all the Test Step check boxes selected for "Selelect All" option
	    	if($("#chkbxSelectAll").attr("checked"))
	    	{
	    		$(".chkBoxTS").attr("checked",true);
	    	}

			
			$('#showTestSteps').find('tr').each(function(i,v){
		    	$(v).find('td:eq(4)').find('a').css('color','blue').css('text-decoration','underline');
		    	$(v).find('td:eq(4)').find('a').attr('target','_blank');
		    	$(v).find('td:eq(4)').find('img').attr('height','100');
		    	$(v).find('td:eq(4)').find('img').attr('width','150');
		    	$(v).find('td:eq(4)').find('img').css('height','100px').css('width','150px');
		    	$(v).find('td:eq(4)').find('table').css('width','170px');

	    	});
	    	
	    	$(".chkBoxTS").click(function(){
    
		    	$("#chkbxSelectAll").attr("checked",false);
		    
		    });
	    }
	}
    return false;
},
pagination:function(sel)
{
	if($('#ulItemsassotestcases div').find('input[type=checkbox]').length != 0)
	{
		if($('#ulItemsassotestcases div').find('input[type=checkbox]:checked').length != 0)
		{
			var len = 0;
			teststep.arr = teststep.showTestStep(sel); 
			//teststep.arr = teststep.initPagination();
			if(teststep.arr != null && teststep.arr != undefined)
				len = teststep.arr.length;
			else if(sel != undefined)
					len = parseInt($("#labelCount").html());	
			
		     var countVal=((len)>=10)?(len):('0'+(len));
		     if(countVal== 00)
             {
                $("#countDiv").css('display','none');
             }
             else
             {
               $("#countDiv").css('display','');
               $("#labelCount").html(countVal);
            }

			if(len != 0)
			{
				$("#Pagination").pagination(len,{
				    callback:teststep.initpage,
				    items_per_page:10, 
				    num_display_entries:10,
				    num:2
				});
			}
			else
			{
				$('#noTP').show();
				$('#Pagination').hide();
				$('#testStepGrid').hide();
				$('#countDiv').hide();
				$('#btnDelete').hide();
			}
		}
		else
		{
			//teststep.alertBox("Please select atleast one testcase.");
			teststep.alertBox("Please select at least one "+teststep.gConfigTestCase+".");//Added by Mohini for Resource file	
			$(sel).attr('checked','checked');
			return; 
		}
	}
	else
	{
		$('#noTP').show();
		$('#Pagination').hide();
		$('#testStepGrid').hide();
		$('#countDiv').hide();
		$('#btnDelete').hide();
	}
},


reset:function()
{
	if(teststep.gTestStepList != null || teststep.gTestStepList != undefined)
	{
		enableDesignMode("rte1",teststep.gTestStepList.testStepName, false);	
		$("iframe[name='rte1'").contents().find('body p.MsoListParagraphCxSpLast').css("margin-bottom","0pt");//to remove scroll even if text is small
		
		if(teststep.gTestStepList.expectedResult == "" || teststep.gTestStepList.expectedResult == undefined)
			$("#expectedResultWithImage").html("");
		else
			$("#expectedResultWithImage").html(teststep.gTestStepList.expectedResult);
		
		//var temp = teststep.teststatus;						    			    
	    //DropDown.fillTestStatusDDInEdit(temp,'status');
	    var TestCasesID = new Array();
	    
	    TestCasesID.push(teststep.gTestStepList.testCaseId);
	    
	    multiSelectList.setSelectedItemsFromArray("testCaseName",TestCasesID);
	    
	    var role = new Array();
	    
	    $( teststep.gTestStepList.roleList ).each(function(ind,itm){
	    
	    	role.push(itm.roleId);
	    
	    });
	    
	    //var role = (teststep.gTestStepList[0]['Role'] != null || teststep.gTestStepList[0]['Role'] != undefined) ? teststep.gTestStepList[0]['Role'] : '';
	    if(role.length == 0)
	    	multiSelectList.selectNone("role");
	    else if(role.length == teststep.roleLength)
	    	multiSelectList.selectAll("role");
	    else
	    {
	    	//role = role.split(",");
	    	multiSelectList.setSelectedItemsFromArray("role",role);
	    }
	    //teststep.showTestStep(); // Added for bug 6097	   		   
	}
	document.getElementById('status').disabled = false; 
	//document.getElementById('devitem').value = '';
	//To enable the Create and View links
	//$(".navTabs h2:eq(0)").removeAttr("disabled").css("cursor","pointer");
	//$(".navTabs h2:eq(1)").removeAttr("disabled").css("cursor","pointer");
			
},

editTestStep:function(id)
{
	Main.showLoading();
	// Added for DD
	createDD.editMode = 1;
	
	createDD.hideDD();

	$('.navTabs h2:eq(3)').show();
	
	$('.navTabs h2').css('color','#7F7F7F');
	
	$('.navTabs h2:eq(3)').css('color','#000000');
	
	$('#testStepinput').show();
	
	$('#testStepGrid').hide();
	
	$('#countDiv').hide();
	
	teststep.RolesForTestStepEdit.length = 0;
	
	$('#rte1').attr('height','150');

	var indexForTestStepToBeEdited;
	
	teststep.TestStepIDFromEditTestStep = id;
	
	$('#btnSave').hide();
	
	$('#btnCancelNew').hide();
	
	$('#btnUpdate').show();
	
	$('#reset').show();
	
	$('#addNewTestStep').show();
	
	var temp='Not Completed';
	
	var TestStepList = new Array();
	
	TestStepList = teststep.dataCollection[ teststep.TestStepArrIndexMap[id] ];
	
	teststep.gTestStepList = TestStepList;
	
	if(TestStepList != null || TestStepList != undefined || TestStepList.length > 0)
	{			
		$('#teststepid1').show();
		
		document.getElementById('teststepid2').value = id;
		
		// code added on 30 March For richtextbox by sheetal//// 
		enableDesignMode("rte1", TestStepList.testStepName, false);
		
		//if(TestStepList[0]['ExcelImport'] == 1)//Added on 23 July 2014 by HRW
			//$(document).contents().find('#rte1').contents().find('table').css('width','455px');
				
		if(TestStepList.expectedResult != undefined)
			$('#expectedResultWithImage').html(TestStepList.expectedResult);
		else
			$('#expectedResultWithImage').html('');	
		
		var testPassID = teststep.testPassId; //$('#testPassName').val();
				
		var testCaseID =new Array();	
		/****************Move from down side to here by Harshal and Rajiv on 1 feb 2012************************************/
		testCaseID = TestStepList.testCaseId;//.split(",");
		
		var AllTestCasesInTestStep = new Array();//Added by Harshal on 28 March
		
	    teststep.showAttachment(id);
		
		AllTestCasesInTestStep.push( testCaseID );
		
		var role = new Array();
		
		$.each( TestStepList.roleList, function(ind,itm){
		
			role.push( itm.roleId );
			
		});
		
		multiSelectList.setSelectedItemsFromArray("testCaseName",AllTestCasesInTestStep);
		   
	    if(role.length>0) //code modified by Harshal and Rajiv on 1 feb
	    	multiSelectList.setSelectedItemsFromArray("role",role);
	    else
	    {	 
	        if(role.length == 0 || role == '')
		    	multiSelectList.selectNone("role");
		    else if(role.length == teststep.roleLength)
		    	multiSelectList.selectAll("role");
		    else
		    	multiSelectList.setSelectedItemsFromArray("role",role);
		}    
	}
	
	document.getElementById('status').disabled = false; 
	
	$("iframe[name='rte1'").contents().find('body').find('a').each(function(){    
      $(this).click(function(){
             window.open($(this)[0].href,'_blank');
             return false;
         });
	});

	$("iframe[name='rte1'").contents().find('body').find('a').mouseover(function(e){
	     $("iframe[name='rte1'").contents().find('body').attr('contentEditable','false'); 
	  });
	  
	$("iframe[name='rte1'").contents().find('body').find('a').mouseout(function(e){
	     $("iframe[name='rte1'").contents().find('body').attr('contentEditable','true'); 
	  });	  
	  
	$("iframe[name='rte1'").contents().bind("paste keyup", function(e) {
	    $("iframe[name='rte1'").contents().find('body').find('a').each(function(){
		$(this).unbind('click');    
	    $(this).click(function(){
	             window.open($(this)[0].href,'_blank');
	             return false;
	         });
	    });
	    
		$("iframe[name='rte1'").contents().find('body').find('a').mouseover(function(e){
			$("iframe[name='rte1'").contents().find('body').attr('contentEditable','false');
			$(this).attr('title',$(this)[0].href); 
		});
		
		$("iframe[name='rte1'").contents().find('body').find('a').mouseout(function(e){
		 	$("iframe[name='rte1'").contents().find('body').attr('contentEditable','true'); 
		});
	});
	 
	$('#ulItemstestCaseName div').css('height','127px');
	
	Main.hideLoading();
	
	//To disable the Create and view links on edit mode
	//$(".navTabs h2:eq(0)").attr("disabled",true).css("cursor","default");
	//$(".navTabs h2:eq(1)").attr("disabled",true).css("cursor","default");
},

showAttachment:function(id)
{
/*
	var markup='<b style="margin-top:4px">Attachment:</b>';	
	var attachquery = '<Query><Where><Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+id+'</Value></Contains></Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
	var attachResult = teststep.dmlOperation(attachquery,'Attachment');
	
    if(attachResult != null || attachResult != undefined)
    	markup += '<span><b>YES</b></span>';
    else
    	markup +='&nbsp;<b>NO</b>&nbsp;&nbsp;<a onclick="teststep.showUpload();" style="cursor:pointer" title="Upload File"><font color="#FF6500">Attach File</font></a>';
    $('#attachment').html(markup);
    */
},

updateTestStep:function()
{
	teststep.flagForSave = false;
	
	teststep.TestCasesOfRemovedRoles.length = 0;
	
	Main.showLoading();
	
	//code added for rich text box on 30 march by sheetal 
	updateRTE('rte1');
	
	teststep.ExpectedResult = $('#expectedResultWithImage').html();
	
	var testStepName = document.getElementById('hdn' + 'rte1').value.replace(/&nbsp;/g,'').replace(/^\s+|\s+$/g, "");//Added by HRW for bug 5963
	
	teststep.TestPassStatus.length = 0;
	
	jQuery.trim(testStepName);
	
	var testStepDetail = document.getElementById('hdn' + 'rte1').value.replace(/&nbsp;/g,'').replace(/^\s+|\s+$/g, "");//Added by HRW for bug 5963
	
	jQuery.trim(testStepDetail);
	
	testStepDetail = (testStepDetail.length == 0) ? '-' : testStepDetail;
	
	var RoleNameBasedOnRoleID=new Array();
	
	var testCaseID =new Array();	
	
	var allTestCasesInTestPass = new Array();
	
	$("#testCaseName div div li").each(function(){
	
		allTestCasesInTestPass.push($(this).children(".mslChk").attr('Id').split("_")[1]);//Added by Harshal on 17 Feb
		
		if($(this).children(".mslChk").attr('checked') == true)
		{
			testCaseID.push($(this).children(".mslChk").attr('Id').split("_")[1]);					
		}
	});	
	
	var roleIDs = new Array();  
	
	var RemovedRoles=new Array();//logic to update masterList
	
	var AddedRoles=new Array();
	
	var o=0;//logic to update masterList
	
	var RolesOfSelectedTestStepVar = teststep.RolesForTestStepEdit;//Code commneted and new code added for bug 899//teststep.gTestStepList[0]['Role'];//logic to update masterList
	
	var RolesOfSelectedTestStepArray=new Array();//logic to update masterList
	
	RolesOfSelectedTestStepArray=RolesOfSelectedTestStepVar;//logic to update masterList
	
	var isonlyts=0;
	
	var allRolesFromTestStepListVar='';
	
	var allRolesFromTestStepList=new Array();
	
	if(testStepName.indexOf("~") == -1 && testStepDetail.indexOf("~") == -1)    
	{
		var ts = teststep.filterData(testStepName);
		
		ts = ts.replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, "");
		
		ts = ts.replace(/\s+/g, '');
		
		ts = jQuery.trim(ts);
		
		if(ts.length == 0 || testCaseID == null || testCaseID == undefined || testCaseID == '' || $("#role div div li").find(":checked").length == "0")
		{
			teststep.alertBox("Fields marked with asterisk(*) are mandatory!");
			
			Main.hideLoading();
		}	
		else if($('#ulItemstestCaseName input:checked').length > 1)   /*Code added by Deepak for sequencing*/
		{
			teststep.alertBox("Cannot save "+teststep.gConfigTestStep.toLowerCase()+" under more than one "+teststep.gConfigTestCase.toLowerCase()+"!");//Added by Mohini for Resource file     
		}/*Code added by Deepak for sequencing*/
		else
		{	
			
			var testCaseID= new Array();
			$("#testCaseName div div li").each(function() {
			
				if($(this).children(".mslChk").attr('checked') == true)
				{
					testCaseID.push($(this).children(".mslChk").attr('Id').split("_")[1]);     
				}
			});
			
			teststep.addedRoles.length = 0;
			
			$("#role div div  li").each(function()
			{
				if($(this).children(".mslChk").attr('checked') == true)
				{
					roleIDs.push($(this).children(".mslChk").attr('Id').split("_")[1]);	
					
					multiSelectList.allRolesUnchecked=false;			
				}
				teststep.RoleNameBasedOnRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();
			});
			
			//To get the roles that has Tester available WCF changes |Ejaz Waquif DT:12/2/2014 
			var rolesWithTester = new Array();
			
			teststep.flagForSaveMessage1 = true;
			
			teststep.roleNotSaved = new Array();
			
			$.each( teststep.roles,function(ind,itm){
			
			if( $.inArray(itm.roleId, roleIDs ) != -1)
			{
				if(itm.isTestersAssigned == 1)
				{
					rolesWithTester.push(itm.roleId);
				}
				else
				{
					teststep.roleNotSaved.push(itm.roleId);
					
					teststep.flagForSaveMessage1 = false;
				}
			}
			
			});
			
			if(rolesWithTester.length == 0)
			{
				teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the selected "+teststep.gCongfigRoles.toLowerCase()
				  					+", hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be added with the selected "
				  					+teststep.gCongfigRoles.toLowerCase()+"!");//Added by Mohini for Resource file
			  
				Main.hideLoading();	
			
				return;				  
			}
			
			var data={
			
				'testStepId':teststep.TestStepIDFromEditTestStep.toString(),
				'testCaseId': testCaseID[0],
				'testStepName':testStepName,
				'expectedResult':teststep.ExpectedResult,
				//'testStepSequence':'3',
				//'erAttachmentName': 'Test Attachmeent',
				//'erAttachmentURL': 'http://msn.com',
				'roleArray':rolesWithTester,
				'action':'edit'
			};
			
			var result = ServiceLayer.InsertUpdateData("InsertUpdateTestStep", data, "TestStep");
			
			if( result.ErrorDetails != undefined && result.Value == "[Test Step is already available with this name! Please select different Test Step Name.]")
			{
				teststep.alertBox(teststep.gConfigTestStep+' with '+testStepName+' name already exists!');
				$('.navTabs h2:eq(0)').click();	// For view all				
				Main.hideLoading();
				return;
			}
			
			if(teststep.flagForSaveMessage1==true)
			{
				//teststep.alertBox(teststep.gConfigTestStep+" updated successfully!");
				Main.AutoHideAlertBox(teststep.gConfigTestStep+" updated successfully!");//Added by Mohini for Resource file
				
			}
			else
			{
				var roleNames=new Array();
			
				for(var i=0;i<teststep.roleNotSaved.length;i++)
				roleNames.push(teststep.RoleNameBasedOnRoleID[teststep.roleNotSaved[i]]);
				
				var msg=teststep.gConfigTestStep+" is updated successfully but it could not be saved under "+teststep.gCongfigRoles+" "+roleNames+" as it does not have any "+teststep.gConfigTester+" with these "+teststep.gCongfigRoles;//Added by Mohini for Resource file
				
				teststep.alertBox(msg);
			}
			
			// Added for DD
			createDD.editMode = 0;
			
			createDD.showDD();
			
			teststep.clearFields(); //Position swapped by rajiv on 7 june 2012 to resolve the bug mentioned by Steve on the same date. 
			
			multiSelectList.selectNone("role");	
			
			$('.navTabs h2:eq(0)').click();	// For view all
			
			
		}
	}
	else
	//teststep.alertBox("~ is not allowed in Test Step Details and Expected Result!");
	teststep.alertBox("~ is not allowed in "+$('#lblPNameStar').text().substring(0,$('#lblPNameStar').text().length-2)+" and "+$('#lblExpRes').text().substring(0,$('#lblExpRes').text().length-1)+"!");//Added by Mohini for Resource file    
	
	window.setTimeout("Main.hideLoading()", 200);	
	
	//To enable the Create and View links
	//$(".navTabs h2:eq(0)").removeAttr("disabled").css("cursor","pointer");
	//$(".navTabs h2:eq(1)").removeAttr("disabled").css("cursor","pointer");			
},

//updateTestCaseToTestStepMapping:function(testStepID,roleIDs,AddedRoles,RemovedRoles,TestStepResult,testCasesOfHiddenTestPasses)
//{
//	teststep.TestPassNameBasedOnTestPassID.length=0;
//	//Code added by Rajiv and Harshal on 31 jan to save testpassname to be stored in MY activity list//  
//	$("#testPassName > option").each(function(){
//		teststep.TestPassNameBasedOnTestPassID[this.value] = this.text; 
//	});  
	
//	var testCaseID =new Array(); 
//	var allTestCaseID =new Array(); 
//	var XCounters=0;
//	$("#testCaseName div div li").each(
//	function()
//	{
//	   	if($(this).children(".mslChk").attr('checked') == true)
//		{
//		 	testCaseID.push($(this).children(".mslChk").attr('Id').split("_")[1]);     
//		}
//	});
//	var oldTestCaseID ='';
//	oldTestCaseID = TestStepResult[0]['TestCasesID'];
//	oldTestCaseID = oldTestCaseID.split(",");
	
//	$.merge(allTestCaseID ,testCaseID);
//	$.merge(allTestCaseID ,oldTestCaseID );
	
//	allTestCaseID= allTestCaseID.map(Number);
//	allTestCaseID= $.unique(allTestCaseID).map(String);
//	var newTestCaseID = testCaseID;
//	var testCasesToBeRemoved = new Array(); 
//	var testCasesToBeRemoved = new Array(); 
//	var testCasesToBeRemained = new Array(); 
//	var flagfortestcase = 0;
//	var rolesRemovedFlag = true;
//	var flagforroleadd=1; 
//	var TesterSPUserIDWithRoleArray=new Array();
//	var availableTestersRolesForTestPass = new Array();
//	var ParentList = jP.Lists.setSPObject(teststep.SiteURL,'TestPassToTestCaseMapping'); 
//	var ChildList = jP.Lists.setSPObject(teststep.SiteURL,'TestCaseToTestStepMapping'); 
	
//	if(RemovedRoles.length==0)
//	rolesRemovedFlag=false;
//	if(AddedRoles.length==0)
//	flagforroleadd=0;//Change by Harshal on 6-2-12 
//	if(oldTestCaseID != null && TestStepResult != undefined)
//	{
//		/************Logic for deleting the rows from TCTSM list if some previous testcases are removed from teststeps ;added by Rajiv and Harshal on 3 feb 2012***************/
//		for(var i=0;i<oldTestCaseID.length;i++)
//		{
//			if($.inArray(oldTestCaseID[i],testCaseID) == -1)
//			{
//				if($.inArray(oldTestCaseID[i],testCasesOfHiddenTestPasses) == -1)
//					testCasesToBeRemoved.push(oldTestCaseID[i]);
//			}		
//			else
//				testCasesToBeRemained.push(oldTestCaseID[i]);//Added by Harshal on 14 Feb 2012 for the Bug 690		
//		}
//		 // Adding New Mapping for new TestCase association
//		 var addedTestCases = new Array();//Move to top by Harshal on 6 Feb 2012
//		 for(var i=0;i<testCaseID.length;i++)
//		 {
//		 	if( $.inArray(testCaseID[i],oldTestCaseID) == -1 )
//		 	{
//		 		addedTestCases.push( testCaseID[i] ); 
//		 	}
//		 }
//		 /*Code wrtten by rajiv and harshal to make query optimization;to fetch TPTC ID(s) & TestPassID(s) pertaining to selected test case(s)*/
//		 /////// Query for mapping////// // 
//		 /*Ankita:8/17/2012 Bulk data handling*/
//		var ParentResult = new Array();
			
//		var numberOfIterations = Math.ceil((allTestCaseID.length)/147);
//		var iterationPoint = 0;
//		var OrEndTags; 
//	    var camlQuery;
//		for(var y=0;y<numberOfIterations-1;y++)
//		{
//			camlQuery = '<Query><Where>';
//			OrEndTags= '';
//			for(var ii=iterationPoint ;ii< (147+iterationPoint-1);ii++)
//			{
//				camlQuery +='<Or><Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+allTestCaseID[ii]+'</Value></Eq>';
//				OrEndTags+= '</Or>';
//			}
//			camlQuery += '<Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+allTestCaseID[ii]+'</Value></Eq>';
//			camlQuery += OrEndTags;
//			camlQuery +='</Where><ViewFields></ViewFields></Query>';
//			var TPTCResult = teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping');
//			if(TPTCResult !=null && TPTCResult != undefined)
//		    	$.merge(ParentResult,TPTCResult);
//		    iterationPoint+=147;
//	    }
//	    camlQuery= '<Query><Where>';
//		OrEndTags='';
//		for(var ii=iterationPoint ;ii<allTestCaseID.length-1;ii++)
//		{
//			camlQuery +='<Or><Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+allTestCaseID[ii]+'</Value></Eq>';
//			OrEndTags+= '</Or>';
//		}
//		camlQuery += '<Eq><FieldRef Name="TestCaseID" /><Value Type="Text">'+allTestCaseID[ii]+'</Value></Eq>';
//		camlQuery += OrEndTags;
//		camlQuery +='</Where><ViewFields></ViewFields></Query>';
//	    var TPTCResult = teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping');
//		if(TPTCResult != null && TPTCResult != undefined)
//		    $.merge(ParentResult,TPTCResult);
//		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//		var TestPassIDOfAddedTestCases = new Array();
//		var TestPassIDOfRemovedTestCases = new Array();
//		var ParentResultIDOfAddedTestCases = new Array();
//		var ParentResultIDOfRemovedTestCases = new Array();
//		var ParentResultIDOfHiddenTestCase = new Array();//Added on 28 March
		
//		//Moved here from bottom
//		var ParentMappingIDForCombOfTPIDAndSPUserID = new Array(); //To maitain ParentMapping( ID ) for combination of( TestPassID & SPUSerID )
		
//		//Added by HRW for optimization
//		var TestPassIDOfAllTestCases = new Array();
//		var TPIDOfAddedTC = new Array();
		
//		var forParentIDGetTPID = new Array();
//		var forParentIDGetTCID = new Array();
//	    var forParentIDGetSPID = new Array();
//		for(var i=0;i<ParentResult.length;i++)
//		{
//			forParentIDGetTCID[ParentResult[i]['ID']] = ParentResult[i]['TestCaseID'];
//			forParentIDGetTPID[ParentResult[i]['ID']] = ParentResult[i]['TestPassID'];
//			forParentIDGetSPID[ParentResult[i]['ID']] = ParentResult[i]['SPUserID'];
//			//Added by HRW for optimization
//			if($.inArray(ParentResult[i]['TestPassID'],TestPassIDOfAllTestCases) == -1)
//				TestPassIDOfAllTestCases.push(ParentResult[i]['TestPassID']);
				
//			if($.inArray(ParentResult[i]['TestCaseID'],addedTestCases) != -1)
//			{
//				TestPassIDOfAddedTestCases.push(ParentResult[i]);
//				ParentResultIDOfAddedTestCases.push(ParentResult[i]);
//				 //Added by HRW for optimization
//				if($.inArray(ParentResult[i]['TestPassID'],TPIDOfAddedTC) == -1)
//					TPIDOfAddedTC.push(ParentResult[i]['TestPassID']);
//			}
//			if($.inArray(ParentResult[i]['TestCaseID'],testCasesToBeRemoved) != -1)
//			{
//				if($.inArray(ParentResult[i]['TestPassID'],TestPassIDOfRemovedTestCases) == -1)
//					TestPassIDOfRemovedTestCases.push(ParentResult[i]['TestPassID']);
//				ParentResultIDOfRemovedTestCases.push(ParentResult[i]['ID']);
//			}
//			if($.inArray(ParentResult[i]['TestCaseID'],testCasesOfHiddenTestPasses) != -1)
//			{
//				ParentResultIDOfHiddenTestCase.push(ParentResult[i]['ID']);
//			}
//			/* A Code added by Rajiv & Harshal on 10 Feb 2012 to maitain ParentMapping( ID ) for combination of( TestPassID & SPUSerID )*/
//			var combOfTPIDAndSPUserID = ParentResult[i]["TestPassID"]+","+ ParentResult[i]["SPUserID"];
//			if(ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID] == undefined)
//			  	ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID] = ParentResult[i]["ID"];
//		    else
//		  		ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID]+= "," + ParentResult[i]["ID"];
//		}
//		 /*Code wrtten by rajiv and harshal to make query optimization;to fetch entries of Selected Test Step in child mapping*/
//	}
//	///////////////////////////// Query on Child List added by Harshal on 6 March 2012 ///////////////////////
//	var TestPassesOfRemovedRoles = new Array();//Required for the Removed Role(s) condition
//	var CombOfTPMappingIDAndRoleID = new Array();
//	var TestPassMappingIDsForRemovedRoles = new Array();
//	var TestPassMapppingIDsForRemovedTestCases = new Array();
//	if(ParentResultIDOfRemovedTestCases.length!=0 || rolesRemovedFlag == true || AddedRoles.length != 0)
//	{
//		var ChildResult = new Array();
//		var numberOfIterations = Math.ceil((ParentResult.length)/147);
// 		var iterationPoint = 0;
// 		var camlQuery;
// 		var OrEndTags;
// 		for(var y=0;y<numberOfIterations-1;y++)
// 		{
// 			camlQuery = '<Query><Where>';
// 			OrEndTags = '';
// 			for(var ii=iterationPoint ;ii< (147+iterationPoint-1);ii++)
// 			{
// 				camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ParentResult[ii]['ID']+'</Value></Eq>';
// 				OrEndTags +='</Or>';
// 			}
// 			camlQuery += '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ParentResult[ii]['ID']+'</Value></Eq>';
// 			camlQuery +=OrEndTags;
// 			camlQuery +='</Where><ViewFields><FieldRef Name="TestPassMappingID"/><FieldRef Name="TestStep"/><FieldRef Name="ID"/><FieldRef Name="TestStep"/><FieldRef Name="Role"/></ViewFields></Query>';
 			
// 			var TCToTSResult = teststep.dmlOperation(camlQuery,'TestCaseToTestStepMapping');
// 			if(TCToTSResult != null && TCToTSResult != undefined)
// 				$.merge(ChildResult,TCToTSResult);
// 			iterationPoint += 147;
// 		}
// 		camlQuery = '<Query><Where>';
// 		OrEndTags = '';
// 		for(var ii=iterationPoint ;ii<ParentResult.length-1;ii++)
// 		{
// 			camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ParentResult[ii]['ID']+'</Value></Eq>';
// 			OrEndTags +='</Or>';
// 		}
// 		camlQuery += '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ParentResult[ii]['ID']+'</Value></Eq>';
//		camlQuery +=OrEndTags;
//		camlQuery +='</Where><ViewFields><FieldRef Name="TestPassMappingID"/><FieldRef Name="TestStep"/><FieldRef Name="ID"/><FieldRef Name="TestStep"/><FieldRef Name="Role"/></ViewFields></Query>';
//	 	var TCToTSResult = teststep.dmlOperation(camlQuery,'TestCaseToTestStepMapping');
//		if(TCToTSResult != null && TCToTSResult != undefined)
//			$.merge(ChildResult,TCToTSResult);		
		 
//		if(ChildResult != null && ChildResult != undefined)
//		{
//			for(var i=0;i<ChildResult.length;i++)
//			{
//				if($.inArray(ChildResult[i]['TestPassMappingID'],ParentResultIDOfRemovedTestCases)!=-1 && ChildResult[i]['TestStep'] == testStepID)
//				{
//					var r = ChildList.deleteItem(ChildResult[i]['ID']);
//					TestPassMapppingIDsForRemovedTestCases.push(ChildResult[i]['TestPassMappingID']);
//				}
//				if($.inArray(ChildResult[i]['Role'],RemovedRoles)!=-1 && ChildResult[i]['TestStep'] == testStepID && $.inArray(ChildResult[i]['TestPassMappingID'],ParentResultIDOfHiddenTestCase) ==-1)
//				{
//					var r = ChildList.deleteItem(ChildResult[i]['ID']);
//					TestPassMappingIDsForRemovedRoles.push(ChildResult[i]['TestPassMappingID']);
//				}
//				if($.inArray(ChildResult[i]['Role'],AddedRoles)!=-1 && ChildResult[i]['TestStep'] == testStepID)//Added by Harshal for bug 1342
//					CombOfTPMappingIDAndRoleID.push(ChildResult[i]['TestPassMappingID'] + "|" + ChildResult[i]['Role']);	
//			}
//			if(rolesRemovedFlag)
//			{
//				for(var i=0;i<ParentResult.length;i++)
//		        {
//		    		if($.inArray(ParentResult[i]['ID'],TestPassMappingIDsForRemovedRoles) != -1)
//		        	{
//		        		 if($.inArray(ParentResult[i]['TestPassID'],TestPassesOfRemovedRoles) == -1)
//							TestPassesOfRemovedRoles.push(ParentResult[i]['TestPassID']);
						
//						  if($.inArray(ParentResult[i]['TestCaseID'],teststep.TestCasesOfRemovedRoles) == -1)
//							teststep.TestCasesOfRemovedRoles.push(ParentResult[i]['TestCaseID']);
//		        	}
//		        }
//		    }   
//		}
//	}	
//	///////////////// Logic for deleting Test Step from Unselected Test Case(s) added By Harshal on 13 Feb 2012/////////////////
			
//			  // Query modified By Rajiv and Harshal on 3 feb 2012 to fetch all the testers with their roles for all the testpasses of the added testcase(s) // 
//        var testerListItem = new Array();
//        var ProjectID = '';
//        var TPIDsForQuery = new Array();
//        if(TestPassIDOfAddedTestCases.length !=0)
//        	TPIDsForQuery = TPIDOfAddedTC;
//        else
//        	TPIDsForQuery = TestPassIDOfAllTestCases;	
//        var testPassListItems = new Array();
//        var AllRolesForTestPassID=new Array();
        
        
//		//Added by HRW on 6 Sep 2012
//		var iteration= Math.ceil((TPIDsForQuery.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//		var iterationStartPoint=0;
//		for(var y=0;y<iteration;y++)
//	    {
//		   if(y!=iteration-1)
//		   {
//		 		var q = '';
//				var camlQuery = '<Query><Where>';
//				for(var u=0+iterationStartPoint;u<(147+iterationStartPoint)-1;u++)			 
//				{
//					camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TPIDsForQuery[u]+'</Value></Eq>';
//					q += '</Or>';
//		        }			
//				camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+TPIDsForQuery[u]+'</Value></Eq>';
//				if(q != '')
//					camlQuery += q;
//				camlQuery +='</Where><ViewFields><FieldRef Name="AllRoles"/><FieldRef Name="ProjectId" /><FieldRef Name="ID" /><FieldRef Name="Status" /></ViewFields></Query>';	
				
//				iterationStartPoint+=147;  
//				var Result = teststep.dmlOperation(camlQuery,'TestPass');
//				if(Result != null && Result != undefined)
//					$.merge(testPassListItems,Result);
//		   }
		   
//		    var q = '';
//			var camlQuery = '<Query><Where>';
//			for(var u=iterationStartPoint;u<TPIDsForQuery.length-1;u++)			 
//			{
//				camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TPIDsForQuery[u]+'</Value></Eq>';
//				q += '</Or>';
//	        }			
//			camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+TPIDsForQuery[u]+'</Value></Eq>';
//	        if(q != '')
//				camlQuery += q;
//			camlQuery +='</Where><ViewFields><FieldRef Name="AllRoles"/><FieldRef Name="ProjectId" /><FieldRef Name="ID" /><FieldRef Name="Status" /></ViewFields></Query>';	
//			var Result = teststep.dmlOperation(camlQuery,'TestPass');
//			if(Result != null && Result != undefined)
//				$.merge(testPassListItems,Result);
//		}
//		if(testPassListItems!=null && testPassListItems!=undefined)
//		{
//			ProjectID = testPassListItems[0]['ProjectId'];
//			for(var ii=0;ii<testPassListItems.length;ii++)
//		    {
//		    	AllRolesForTestPassID[testPassListItems[ii]['ID']] = testPassListItems[ii]['AllRoles'];
//		    	teststep.TestPassStatus[testPassListItems[ii]['ID']] = testPassListItems[ii]['Status'];
//		    } 
//		 }
//		 var TestPassIDsToBeChecked = new Array();
//		 if(TPIDOfAddedTC.length != 0)
//		 	TestPassIDsToBeChecked = TPIDOfAddedTC; 
//		 else
//		 	TestPassIDsToBeChecked = TestPassIDOfAllTestCases;	
		 	
//		 var storeIt=false;
//		 var TesterSPUSerIDArray=new Array();
//		 var newRole=new Array();
//	     var role=new Array();
//	 	 var parentMappingIDsToBeSavedInChildMapping = new Array(); 
//	 	 var RolesForParentMappingID = new Array();
//		  if(teststep.testerListItem != null && teststep.testerListItem != undefined)
//		  { 
//		    for(var x=0;x<teststep.testerListItem.length;x++)
//		    {
//		      if($.inArray(teststep.testerListItem[x]['TestPassID'],TestPassIDsToBeChecked) != -1)
//			  {
//			      var temp=parseInt(teststep.testerListItem[x]['RoleID']);
//			      var roleAndSPUserID=temp.toString()+","+teststep.testerListItem[x]['SPUserID'];
//			      role.push(roleAndSPUserID);
//			      /**Code added by Rajiv and Harshal on 3 feb to track testers' roles availability for each testpasses(of the selected testcase)**/ 
//	     			if(availableTestersRolesForTestPass[teststep.testerListItem[x]['TestPassID']] == undefined 
//	     				|| availableTestersRolesForTestPass[teststep.testerListItem[x]['TestPassID']].length==0)
//	     			{	
//	     				availableTestersRolesForTestPass[teststep.testerListItem[x]['TestPassID']]=parseInt(teststep.testerListItem[x]['RoleID']).toString();
//	     			}
//	     			else
//	     			{
//	     				availableTestersRolesForTestPass[teststep.testerListItem[x]['TestPassID']]+=","+parseInt(teststep.testerListItem[x]['RoleID']).toString();
//	     			}
//			     /******************************************************************************************************************/
//	                /**code added for master list**/
//				     if($.inArray(temp.toString(),roleIDs)!=-1)
//				      { 
//					      	if($.inArray(teststep.testerListItem[x]['SPUserID']+','+temp.toString()+','+teststep.testerListItem[x]['TestPassID'],TesterSPUSerIDArray)==-1)
//			         		{	
//			         			TesterSPUserIDWithRoleArray[XCounters]=new Array(); 
//			         			TesterSPUserIDWithRoleArray[XCounters][0]=teststep.testerListItem[x]['SPUserID'] + "," + teststep.testerListItem[x]['TestPassID']; //Code modified By Rajiv and Harshal on 31 jan 2012 to append testpass ID to which the tester belongs
//			         			TesterSPUserIDWithRoleArray[XCounters][1]=temp.toString();
//			         			TesterSPUSerIDArray.push(teststep.testerListItem[x]['SPUserID']+','+temp.toString()+','+teststep.testerListItem[x]['TestPassID']); //code modified by rajiv on 1 feb to make entry in my activity for another associated test pass
//			         			//TestPassToBeConsideredInChildMappingList.push(teststep.testerListItem[x]['TestPassID']);
//			         			if(XCounters==0)
//			         				AllRoles=temp.toString();
//			         			else
//			         				AllRoles=AllRoles+","+temp.toString();
			         				
//			         			XCounters=XCounters+1; 	
//			         		}
			         		 
//				      }
//			      /**code added for master list**/
//			      /*   Code added by Rajiv & Harshal on 10 Feb 2012 to maitain ParentMapping( ID )s to be stored in Childmapping */
//					var combOfTPIDAndSPUserID1 = '';
//					if($.inArray(parseInt(teststep.testerListItem[x]['RoleID']).toString(),roleIDs) != -1)
//			        	combOfTPIDAndSPUserID1 = teststep.testerListItem[x]['TestPassID']+","+teststep.testerListItem[x]['SPUserID'];
//			        if(combOfTPIDAndSPUserID1 != '')	
//		    			$.merge(parentMappingIDsToBeSavedInChildMapping,ParentMappingIDForCombOfTPIDAndSPUserID[combOfTPIDAndSPUserID1].split(","));
//		    	/*****************************************************************************************************************/
		    	
//		    	//Added by Harshal on 6 March to get the Role for ParentID
//		    		var ParentIDs = ParentMappingIDForCombOfTPIDAndSPUserID[teststep.testerListItem[x]['TestPassID']+","+teststep.testerListItem[x]['SPUserID']].split(",");//If Parent IDs are comma seperated for the comb of TPID & SPUserID 
//		    		for(var ii=0;ii<ParentIDs.length;ii++)
//			    	{
//			    		if(RolesForParentMappingID[ ParentIDs[ii] ] == undefined)
//			    			RolesForParentMappingID[ ParentIDs[ii] ] = teststep.testerListItem[x]['RoleID']; 
			    			
//			    		else
//			    			RolesForParentMappingID[ ParentIDs[ii] ] += "," + teststep.testerListItem[x]['RoleID'];
//			    	}		
//				}//End Of If
//		    } 
//		  }
//		  //Staus of Test Pass & Project for Test Case add or Role Add 
//		    var objForTestPassStatus = new Array();
//			var objForProjectStatus = new Array();
//			var FlagForProjectStatus = true;
//			var TPID = new Array(); 
//			var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//			var ProjectList = jP.Lists.setSPObject(teststep.SiteURL,'Project');
		 
//		 /*Logic for adding new testcase association in childmapping Modified by Harshal on 6-02-2012*/ 
//		 var listname =  jP.Lists.setSPObject(teststep.SiteURL,'TestCaseToTestStepMapping');
//		 if(ParentResultIDOfAddedTestCases!=null && ParentResultIDOfAddedTestCases!=undefined)
//		 {
//		 	var flagForAlertMessage = true;
//		 	for(var ss=0;ss<ParentResultIDOfAddedTestCases.length;ss++)
//			{	
//				newRole.length = 0;//For Maintaning Test Pass Tester specific role(s)
//				for(var f=0;f<role.length;f++)
//				{
//					if($.inArray(role[f].split(",")[0],roleIDs)!=-1 && role[f].split(",")[1] == ParentResultIDOfAddedTestCases[ss]['SPUserID']) //roleIDs array contains all the selected roles
//					{	
//						if($.inArray(role[f].split(",")[0],newRole)==-1)
//					    	newRole.push(role[f].split(",")[0]); //all the roles whose tester(s) is/are present.
//					}
//				}
//				if(newRole.length>0)
//				{	var obj = new Array();
//					flagForAlertMessage = false;	
//					for(var nwrcnt=0;nwrcnt<newRole.length;nwrcnt++)
//					{
//					   var allRolesOfTestPass = new Array();
//					   var availableTestersRoles = new Array();
//					   availableTestersRoles =availableTestersRolesForTestPass[ParentResultIDOfAddedTestCases[ss]['TestPassID']].split(",");
//					   allRolesOfTestPass = AllRolesForTestPassID[ParentResultIDOfAddedTestCases[ss]['TestPassID']].split(",");  //Code modified by Rajiv and Harshal on 31 jan to save only those testpasses which have tester(s) with role(s) of test step to be saved.
//					   /*commented by rajiv on 1 feb as it is not working as expected*/ //if($.inArray(newRole[nwrcnt],allRolesOfTestPass)!=-1)  //Code modified by Rajiv and Harshal on 31 jan to save only those testpasses which have tester(s) with role(s) of test step to be saved.
//					   if($.inArray(newRole[nwrcnt],availableTestersRoles)!=-1)
//					   {
//							if($.inArray(ParentResultIDOfAddedTestCases[ss]['ID'],parentMappingIDsToBeSavedInChildMapping)!=-1)
//				   			{
//								obj.push({'Title':'TestCaseToTestStepMapping',
//									  	  'TestPassMappingID':ParentResultIDOfAddedTestCases[ss]['ID'],
//									  	  'TestStep':testStepID,
//									  	  'status': 'Not Completed',
//									  	  'Role':newRole[nwrcnt],
//									  	  'TestPassID':forParentIDGetTPID[ParentResultIDOfAddedTestCases[ss]['ID']],	
//										  'TestCaseID':forParentIDGetTCID[ParentResultIDOfAddedTestCases[ss]['ID']],
//										  'SPUserID':forParentIDGetSPID[ParentResultIDOfAddedTestCases[ss]['ID']]		
//								});
//								if($.inArray(newRole[nwrcnt],AddedRoles) != -1)//Added for 6002(Export Test Step functionality)
//							 		teststep.addedRoles.push(newRole[nwrcnt]);
//								if(teststep.TestPassStatus[ParentResultIDOfAddedTestCases[ss]['TestPassID']] == "Complete" && $.inArray(ParentResultIDOfAddedTestCases[ss]['TestPassID'],TPID) == -1)
//								{
//									TPID.push(ParentResultIDOfAddedTestCases[ss]['TestPassID']);
//									objForTestPassStatus.push({
//										'ID' : ParentResultIDOfAddedTestCases[ss]['TestPassID'],
//										'Status' : 'Active'
//									});
									
//									if(FlagForProjectStatus == true)
//									{
//										objForProjectStatus.push({
//										'ID' : ProjectID,
//										'status' : 'Active'
//										});
//										FlagForProjectStatus = false;
//									}
//								}
//							}
//						}
//						else
//						{	teststep.TestPassWithNoRolesOfTestStep.push(teststep.TestPassNameBasedOnTestPassID[ ParentResultIDOfAddedTestCases[ss]['TestPassID'] ]);
//							teststep.flagForSaveMessage=false;
//						}
//					}	
//					if(obj.length>0)
//						var res = listname.updateItem(obj);
//			  }
//			}
//			if(flagForAlertMessage == true && ParentResultIDOfAddedTestCases.length !=0) //if user has selected all the roles for which there are no testers
//			{
//				//teststep.alertBox("There is no tester with the selected role(s), hence the test step cannot be saved with the selected role(s)!");
//				teststep.alertBox("There is no "+teststep.gConfigTester.toLowerCase()+" with the selected "+teststep.gCongfigRoles.toLowerCase()+", hence the "+teststep.gConfigTestStep.toLowerCase()+" cannot be saved with the selected "+teststep.gCongfigRoles.toLowerCase()+"!");//Added by Mohini for Resource file
//				Main.hideLoading();
//		    }	
//		}	
//	/*Logic for adding new testcase association in childmapping ends*/
	
//	// Adding New Mapping for new TestCase association if new roles are added//
//	if(flagforroleadd == 1 && testCasesToBeRemained.length != 0)
//	{
//		var obj = new Array();
//		for(var parlist=0;parlist<ParentResult.length;parlist++)
//	    {
//			if( ($.inArray(ParentResult[parlist]['TestCaseID'],testCasesToBeRemained) != -1 ) )//Edited by Harshal on 14 Feb for bug 690
//			{     
//			  var avilableRolesForParrentID = new Array();
//			  avilableRolesForParrentID = RolesForParentMappingID[ParentResult[parlist]['ID']];
//			  if(avilableRolesForParrentID!=undefined)
//			  {
//			  	  avilableRolesForParrentID = avilableRolesForParrentID.split(",").map(Number).map(String);
//				  for(var ridarrcnt=0;ridarrcnt<AddedRoles.length;ridarrcnt++)
//			      {
//			       	if(($.inArray(AddedRoles[ridarrcnt],avilableRolesForParrentID)!=-1))
//			       	{
//		       		 	if($.inArray(ParentResult[parlist]['ID'],parentMappingIDsToBeSavedInChildMapping)!=-1)
//				   		{
//							if($.inArray(ParentResult[parlist]['ID']+"|"+AddedRoles[ridarrcnt],CombOfTPMappingIDAndRoleID) == -1)//Added for bug 1342					      
//							{	
//								 if($.inArray(AddedRoles[ridarrcnt],teststep.addedRoles) == -1)
//								 	teststep.addedRoles.push(AddedRoles[ridarrcnt]);
								 	
//								 obj.push({ 'Title' :'TestCaseToTestStepMapping',
//						            'TestPassMappingID':ParentResult[parlist]['ID'],
//						            'TestStep':testStepID,
//						            'status': 'Not Completed',
//						            'Role':AddedRoles[ridarrcnt],
//						            'TestPassID':forParentIDGetTPID[ParentResult[parlist]['ID']],	
//								    'TestCaseID':forParentIDGetTCID[ParentResult[parlist]['ID']],
//								    'SPUserID':forParentIDGetSPID[ParentResult[parlist]['ID']]

//						         });
						         
//						        if(teststep.TestPassStatus[ParentResult[parlist]['TestPassID']] == "Complete" && $.inArray(ParentResult[parlist]['TestPassID'],TPID) == -1)
//								{
//									TPID.push(ParentResult[parlist]['TestPassID']);
//									objForTestPassStatus.push({
//										'ID' : ParentResult[parlist]['TestPassID'],
//										'Status' : 'Active'
//									});
									
//									if(FlagForProjectStatus == true)
//									{
//										objForProjectStatus.push({
//										'ID' : ProjectID,
//										'status' : 'Active'
//										});
//										FlagForProjectStatus = false;
//									}
//								} 
//							}
//					     } 
//				    }  
//			      }
//			   }
//		     }    
//		} 
//		if(obj.length!=0)
//			var r = ChildList.updateItem(obj);
//	} 
//	//For status updation on Test Pass List and Project List
//	if(objForTestPassStatus.length>0)
//	var res = TestPassList.updateItem(objForTestPassStatus);
//	if(objForProjectStatus.length>0)
//	var res = ProjectList.updateItem(objForProjectStatus);
//	// Adding New Mapping for new TestCase association if new roles are added//
//	var addedrolesVar=AddedRoles.join(',');
//	teststep.saveDetailsInMasterList2(TesterSPUserIDWithRoleArray,addedrolesVar,RemovedRoles,testCaseID,TestPassIDOfRemovedTestCases,TestPassesOfRemovedRoles,TestPassMappingIDsForRemovedRoles,TestPassMapppingIDsForRemovedTestCases);////******code added for master list*******/
//},

/******code added for master list*******/

//saveDetailsInMasterList:function(TesterSPUserIDWithRoleArray,AllRoles,DelfromMA,testCaseID2,TestPassIDOfRemovedTestCases,TestPassesOfRemovedRoles) //TesterSPUserIDWithRoleArray also contains the TestPassID
//{
//    var testCaseID=new Array();
//    var testPassID=new Array();
//    var temp= new Array();
    
//   ///////////Code to fetch all testpasses of all the selectecd testcase added by Rajiv and Harshal on 31 Jan 2012////////////////
//    var testPassIDVariable;
//    for(var i=0;i<TesterSPUserIDWithRoleArray.length;i++)
//    {   testPassIDVariable = TesterSPUserIDWithRoleArray[i][0].split(",")[1];
//    	if($.inArray(testPassIDVariable ,testPassID)==-1)	
//    		testPassID.push(testPassIDVariable);
//	}
        
//    /////////////////////////Code added by Rajiv and Harhsal to retrieve names of all the testpasse(s) and the roles of teststeps under them ;added on 31 jan 2012////////////////////////
//	var TestPassResult = new Array();
	
//	var q = '';
//	var camlQuery='';
//	camlQuery = '<Query><Where>';

//	for(var i=0;i<testPassID.length-1;i++)			 
//	{
//		camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+testPassID[i]+'</Value></Eq>';
//		q += '</Or>';
//	}	
//	camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+testPassID[i]+'</Value></Eq>';
//	if(q != '')
//		camlQuery += q;
//	camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="AllRoles"/><FieldRef Name="TestPassName"/></ViewFields></Query>';
//    var TestPassResult2 = teststep.dmlOperation(camlQuery,'TestPass');
//	if(TestPassResult2 != undefined)
//		TestPassResult = TestPassResult2;			   
		
//		for(var jj=0;jj<TestPassResult.length;jj++) //Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//		{
//	 	    //Added by Harshal on 30 Jan 2012
// 			 if(teststep.TestPassNameBasedOnTestPassID[TestPassResult[jj]['ID']] == undefined)
// 			 	teststep.TestPassNameBasedOnTestPassID[TestPassResult[jj]['ID']] = TestPassResult[jj]['TestPassName'];
 			 	
// 			 var rolesForTestPassID = new Array();
//		     var roleNameForRoleID=new Array();
//		     var MyActivityListname =jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//		     var AllRolesFromList=new Array(); 
//		     var AllRolesToBeSaved =new Array();
//		     var AllSaveableRoles=new Array();
//		     var rolesToBeSavedOnTP='';
//		     var rolesToBeSavedOnTPArray=new Array();
//		     var AllRolesFromListvar;
		
//		     if(TestPassResult !=null && TestPassResult !=undefined && TestPassResult[0]["AllRoles"]!=undefined )
//		     {  
//		     	AllRolesToBeSaved= AllRoles;
		     	
//		        if(TestPassResult[jj]["AllRoles"]!='-1')// if there were some teststeps under this testpass. //modified by rajiv and harhsal on 1/2 feb
//		        {
//			     	AllRolesFromList=TestPassResult[jj]["AllRoles"].split(',');
//			     	AllRolesFromListvar=TestPassResult[jj]["AllRoles"];
//		     	}
//		     	else // if there were no teststeps under this testpass.
//		     		$.merge(AllSaveableRoles,AllRolesToBeSaved);
//		     }
//		     if(AllSaveableRoles.length==0)
//		     {
//			     var c=0;
//			     if($.inArray("1",AllRolesToBeSaved)==0)
//			     	AllRolesToBeSaved.splice(0,1);
//			      $("#role div div  li").each(function()
//						{
//				   			if($(this).children(".mslChk").attr('checked') == true)
//							{
//								roleNameForRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();	
//								//if(AllRolesFromList.length!=0 && c<AllRolesToBeSaved.length && $(this).children(".mslChk").attr('Id').split("_")[1]==AllRolesToBeSaved[c])
//								if(AllRolesFromList.length!=0 && c<AllRolesToBeSaved.length ) //Modified by Rajiv on 2 feb to resolve bug 508 
//								{		
//									if($.inArray(AllRolesToBeSaved[c],AllRolesFromList)==-1)
//										AllSaveableRoles.push(AllRolesToBeSaved[c]);
//									c++;		
//								}
											
//							}
//						});
//						if(c==0 && $.inArray("1",AllRolesFromList)==-1)
//						{
//						AllSaveableRoles.push('1');		
//						}
//			 }	
//			 else  //23-12-11
//			 {
//			 		 $("#role div div  li").each(function()
//						{
				   			
//							roleNameForRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();																
						
//						});
			 
//			 }	
		
//		    var obj = new Array();
//		    var roleofcurract;
//		    for(var i=0;i<TesterSPUserIDWithRoleArray.length;i++)
//			{   
//			    if(AllRolesFromList.length==0)
//			    {	
//			    	if(TesterSPUserIDWithRoleArray[i][0]!='-3' && TesterSPUserIDWithRoleArray[i][0].split(",")[1] == TestPassResult[jj]['ID'])//Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//			    	{
//				    	 obj = new Array();
//				    	 obj.push({		
//					                  'Title':'MasterDetailsList',
//								  	  'ProjectName':teststep.projectName,
//								  	  'TestPassID':TesterSPUserIDWithRoleArray[i][0].split(",")[1],//modified on 31 jan 2012
//								  	  'ProjectID':teststep.projectId,
//								  	  'TestPassName':teststep.TestPassNameBasedOnTestPassID[ TesterSPUserIDWithRoleArray[i][0].split(",")[1] ], //modified on 31 jan 2012
//								  	  'Action': 'Begin Testing',
//								  	  'TesterSPUserID':TesterSPUserIDWithRoleArray[i][0].split(",")[0],//modified on 31 jan 2012
//								  	  'RoleID':TesterSPUserIDWithRoleArray[i][1],
//								  	  'RoleName':roleNameForRoleID[TesterSPUserIDWithRoleArray[i][1]]
//								  	  //'AllRoles':AllRoles
//							});	
//							var res = MyActivityListname.updateItem(obj);
							
//					}			
//					 rolesToBeSavedOnTP = (i==0)? TesterSPUserIDWithRoleArray[i][1] :(rolesToBeSavedOnTP+','+TesterSPUserIDWithRoleArray[i][1]);
					 
//					  //Added by Harshal on 24 Feb 2012
//					 if(rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] == undefined)
//						rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] = TesterSPUserIDWithRoleArray[i][1];
//					 else 
//					 {
//					 	rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] += "," + TesterSPUserIDWithRoleArray[i][1];
//					 }
//			    }
//			    else
//			    {   //if(TesterSPUserIDWithRoleArray[i][1]!='1') //commented on 2 feb by rajiv
//			    	{
//						if($.inArray(TesterSPUserIDWithRoleArray[i][1],AllSaveableRoles)!=-1 )
//					    {   
//					    	if(TesterSPUserIDWithRoleArray[i][0]!='-3' && TesterSPUserIDWithRoleArray[i][0].split(",")[1] == TestPassResult[jj]['ID'])//Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//					        {
//						        obj = new Array();
//						        obj.push({
//						                  'Title':'MasterDetailsList',
//									  	  'ProjectName':teststep.projectName, 
//									  	  'TestPassID':TesterSPUserIDWithRoleArray[i][0].split(",")[1],//modified on 31 jan 2012 to get the TestPasssID
//									  	  'ProjectID':teststep.projectId,
//									  	  'TestPassName':teststep.TestPassNameBasedOnTestPassID[ TesterSPUserIDWithRoleArray[i][0].split(",")[1] ], //modified on 31 jan 2012 to get the TestPassNAme
//									  	  'Action': 'Begin Testing',
//									  	  'TesterSPUserID':TesterSPUserIDWithRoleArray[i][0].split(",")[0],//modified on 31 jan 2012
//									  	  'RoleID':TesterSPUserIDWithRoleArray[i][1],
//									  	  'RoleName':roleNameForRoleID[TesterSPUserIDWithRoleArray[i][1]],
//									  	  //'AllRoles':AllRoles
//								});
//								var res = MyActivityListname.updateItem(obj);
//							}	
											
//						}
//						 rolesToBeSavedOnTP = (i==0)? TesterSPUserIDWithRoleArray[i][1] :(rolesToBeSavedOnTP+','+TesterSPUserIDWithRoleArray[i][1]);
//						 //rolesToBeSavedOnTPArray.push(TesterSPUserIDWithRoleArray[i][1]);
						 
//						 //Added by Harshal on 24 Feb 2012
//						  if(rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] == undefined)
//							rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] = TesterSPUserIDWithRoleArray[i][1];
//						 else 
//						 {
//						 	rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] += "," + TesterSPUserIDWithRoleArray[i][1];
//						 }
//					}
//				}
//			}
//			/*Commneted by HRW as the data is not saving in a list for bulk
//			if(obj.length!=0)
//				var res = MyActivityListname.updateItem(obj);*/
//			var object1=new Array();
//			var rolesToBeSavedOnTP2 = new Array();
			
//			////////////////////////  Code Modified by Harshal on 24 Feb 2012(Above code is commented & copy of above code modified here) //////////////////////////
//			rolesToBeSavedOnTP2 = rolesForTestPassID[TestPassResult[jj]['ID']];
//			if(AllRolesFromList.length>0)
//			{
//			    //rolesToBeSavedOnTP=(rolesToBeSavedOnTP=='')?"1":rolesToBeSavedOnTP.replace("1,","");
//			    /*Code modififed by rajiv on 2 feb 2012*/
			    
//				if(rolesToBeSavedOnTP2=='')
//			    {
//			    	rolesToBeSavedOnTP2 = "1";
//			    }
//			    /*else  commented on 23 Sep 2013
//			    {
//			    	var temp = new Array();
//			    	temp = rolesToBeSavedOnTP2.split(",");
//			    	var index = $.inArray("1",temp);
//			    	if(index!=-1)
//			    		temp = temp.splice(index,1);
//			    	rolesToBeSavedOnTP2 = temp.join(",");
//			    }*/
//			    if(rolesToBeSavedOnTP2.length!=0)
//			      {
//			       rolesToBeSavedOnTP2=AllRolesFromListvar+','+rolesToBeSavedOnTP2;    
//			      }
//		    } 
		       
//		    rolesToBeSavedOnTPArray = rolesToBeSavedOnTP2.split(',');
//		    uniqueRolesToBeSavedOnTPArray= new Array();
//			for(var t=0;t<rolesToBeSavedOnTPArray.length;t++)
//			{
//				//rolesToBeSavedOnTPArray.remove(rolesToBeSavedOnTPArray[t]);
//				if($.inArray(rolesToBeSavedOnTPArray[t],uniqueRolesToBeSavedOnTPArray)==-1)
//					uniqueRolesToBeSavedOnTPArray.push(rolesToBeSavedOnTPArray[t]);
//			}
			
//			rolesToBeSavedOnTP2 = uniqueRolesToBeSavedOnTPArray.join(',')
			
//			/////////////////////////   End Of Code Modification  ///////////////////////////
			
//			var TestPassListname= jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//			object1.push({
//							  	  'ID':TestPassResult[jj]['ID'],//Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//							  	  'AllRoles':rolesToBeSavedOnTP2
//						});
						
//		   var result = TestPassListname.updateItem(object1);
//		}
//		///////////////////////////// Moved here from updateteststep function to here by Harshal on 15 Feb 2012 //////////////////////////////////
//},

/******code added for master list*******/
//saveDetailsInMasterList2:function(TesterSPUserIDWithRoleArray,AllRoles,DelfromMA,testCaseID2,TestPassIDOfRemovedTestCases,TestPassesOfRemovedRoles,TestPassMappingIDsForRemovedRoles,TestPassMapppingIDsForRemovedTestCases) //TesterSPUserIDWithRoleArray also contains the TestPassID
//{
//     var testCaseID=new Array();
//     var testPassID=new Array();
//     var temp= new Array();
//     AllRoles=AllRoles.split(',');
    
//	///////////Code to fetch all testpasses of all the selectecd testcase added by Rajiv and Harshal on 31 Jan 2012////////////////
//	var testPassIDVariable;
//	for(var i=0;i<TesterSPUserIDWithRoleArray.length;i++)
//	{   testPassIDVariable = TesterSPUserIDWithRoleArray[i][0].split(",")[1];
//		if($.inArray(testPassIDVariable ,testPassID)==-1)	
//			testPassID.push(testPassIDVariable);
//	}
	
//	/////////////////////////Code added by Rajiv and Harhsal to retrieve names of all the testpasse(s) and the roles of teststeps under them ;added on 31 jan 2012////////////////////////
//    var TestPassResult = new Array();
//	var q = '';
//	var camlQuery='';
//	camlQuery = '<Query><Where>';

//	for(var i=0;i<testPassID.length-1;i++)			 
//	{
//		camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+testPassID[i]+'</Value></Eq>';
//		q += '</Or>';
//	}	
//	camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+testPassID[i]+'</Value></Eq>';
//	if(q != '')
//		camlQuery += q;
//	camlQuery +='</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="AllRoles"/><FieldRef Name="TestPassName"/></ViewFields></Query>';
//    var TestPassResult2 = teststep.dmlOperation(camlQuery,'TestPass');
//	if(TestPassResult2 != undefined)
//		TestPassResult = TestPassResult2;	
		
//	var allRolesforTestPassIDs = new Array();
//	for(var jj=0;jj<TestPassResult.length;jj++) //Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//	{
//     	    	//Added by Harshal on 30 Jan 2012
//		 if(teststep.TestPassNameBasedOnTestPassID[TestPassResult[jj]['ID']] == undefined)
//		     teststep.TestPassNameBasedOnTestPassID[TestPassResult[jj]['ID']] = TestPassResult[jj]['TestPassName'];

//		 var rolesForTestPassID = new Array();
//	     var roleNameForRoleID=new Array();
//	     var MyActivityListname =jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//	     var AllRolesFromList=new Array(); 
//	     var AllRolesToBeSaved =new Array();
//	     var AllSaveableRoles=new Array();
//	     var rolesToBeSavedOnTP='';
//	     var rolesToBeSavedOnTPArray=new Array();
//	     var AllRolesFromListvar;
	     
//	     allRolesforTestPassIDs[TestPassResult[jj]['ID']] = TestPassResult[jj]['AllRoles']; 
//	     if(TestPassResult !=null && TestPassResult !=undefined && TestPassResult[0]["AllRoles"]!=undefined )
//	     {  
//	     	AllRolesToBeSaved= AllRoles;
//	        if(TestPassResult[jj]["AllRoles"]!='-1')// if there were some teststeps under this testpass. //modified by rajiv and harhsal on 1/2 feb
//	        {
//		     	AllRolesFromList=TestPassResult[jj]["AllRoles"].split(',');
//		     	AllRolesFromListvar=TestPassResult[jj]["AllRoles"];
//	     	}
//	     	else // if there were no teststeps under this testpass.
//	     		$.merge(AllSaveableRoles,AllRolesToBeSaved);
//	     }
//	     if(AllSaveableRoles.length==0)
//	     {
//			var c=0;
//			$("#role div div  li").each(function()
//			{
//				if($(this).children(".mslChk").attr('checked') == true)
//				{
//					roleNameForRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();	
//					if(AllRolesFromList.length!=0 && c<AllRolesToBeSaved.length ) //Modified by Rajiv on 2 feb to resolve bug 508 
//					{		
//						if($.inArray(AllRolesToBeSaved[c],AllRolesFromList)==-1)
//							AllSaveableRoles.push(AllRolesToBeSaved[c]);
//						c++;		
//					}
//				}
//			});
//			if(c==0 && $.inArray("1",AllRolesFromList)==-1)
//			{
//				AllSaveableRoles.push('1');		
//			}
//		 }	
//		 else  //23-12-11
//		 {
//	 		 $("#role div div  li").each(function()
//				{
//					roleNameForRoleID[$(this).children(".mslChk").attr('Id').split("_")[1]] =$(this).children('span').text();																
//				});
//		 }	
	   
//	    var obj = new Array();
//	    var roleofcurract;
//	    for(var i=0;i<TesterSPUserIDWithRoleArray.length;i++)
//		{   
//		    if(AllRolesFromList.length==0)
//		    {	
//		    	if(TesterSPUserIDWithRoleArray[i][0]!='-3' && TesterSPUserIDWithRoleArray[i][0].split(",")[1] == TestPassResult[jj]['ID'])//Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//		    	 obj.push({		
//			                  'Title':'MasterDetailsList',
//						  	  'ProjectName':teststep.projectName,//projectName,
//						  	  'TestPassID':teststep.testPassId, //TesterSPUserIDWithRoleArray[i][0].split(",")[1],//modified on 31 jan 2012
//						  	  'ProjectID':teststep.projectId, //$('#projectName').val(),
//						  	  'TestPassName':teststep.TestPassNameBasedOnTestPassID[ TesterSPUserIDWithRoleArray[i][0].split(",")[1] ], //modified on 31 jan 2012
//						  	  'Action': 'Begin Testing',
//						  	  'TesterSPUserID':TesterSPUserIDWithRoleArray[i][0].split(",")[0],//modified on 31 jan 2012
//						  	  'RoleID':TesterSPUserIDWithRoleArray[i][1],
//						  	  'RoleName':roleNameForRoleID[TesterSPUserIDWithRoleArray[i][1]]
//					});	
							
//					rolesToBeSavedOnTP = (i==0)? TesterSPUserIDWithRoleArray[i][1] :(rolesToBeSavedOnTP+','+TesterSPUserIDWithRoleArray[i][1]);
					 
//					  //Added by Harshal on 24 Feb 2012
//					 if(rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] == undefined)
//						rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] = TesterSPUserIDWithRoleArray[i][1];
//					 else 
//					 {
//					 	rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] += "," + TesterSPUserIDWithRoleArray[i][1];
//					 }
//		    }
//		    else
//		    {   
//				if($.inArray(TesterSPUserIDWithRoleArray[i][1],AllSaveableRoles)!=-1 )
//			    {   
//			    	if(TesterSPUserIDWithRoleArray[i][0]!='-3' && TesterSPUserIDWithRoleArray[i][0].split(",")[1] == TestPassResult[jj]['ID'])//Modified by Rajiv and Harshal on 2 feb to resolve bug 424/444 (as the sequece of testpasses in collection and array were different)
//			        {
//				        obj.push({
//				                  'Title':'MasterDetailsList',
//							  	  'ProjectName':teststep.projectName,
//							  	  'TestPassID':teststep.testPassId, //TesterSPUserIDWithRoleArray[i][0].split(",")[1],//modified on 31 jan 2012 to get the TestPasssID
//							  	  'ProjectID':teststep.projectId, //$('#projectName').val(),
//							  	  'TestPassName':teststep.TestPassNameBasedOnTestPassID[ TesterSPUserIDWithRoleArray[i][0].split(",")[1] ], //modified on 31 jan 2012 to get the TestPassNAme
//							  	  'Action': 'Begin Testing',
//							  	  'TesterSPUserID':TesterSPUserIDWithRoleArray[i][0].split(",")[0],//modified on 31 jan 2012
//							  	  'RoleID':TesterSPUserIDWithRoleArray[i][1],
//							  	  'RoleName':roleNameForRoleID[TesterSPUserIDWithRoleArray[i][1]],
//						});
//					}		
//				}
//				 rolesToBeSavedOnTP = (i==0)? TesterSPUserIDWithRoleArray[i][1] :(rolesToBeSavedOnTP+','+TesterSPUserIDWithRoleArray[i][1]);
				 
//				 //Added by Harshal on 24 Feb 2012
//				  if(rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] == undefined)
//					rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] = TesterSPUserIDWithRoleArray[i][1];
//				 else 
//				 {
//				 	rolesForTestPassID[TesterSPUserIDWithRoleArray[i][0].split(",")[1]] += "," + TesterSPUserIDWithRoleArray[i][1];
//				 }
//			}
//		}
//		if(obj.length != 0)
//			var res = MyActivityListname.updateItem(obj);

//		var object1=new Array();
//		var rolesToBeSavedOnTP2 = new Array();
		
//		rolesToBeSavedOnTP2 = rolesForTestPassID[TestPassResult[jj]['ID']];
//		if(AllRolesFromList.length>0)
//		{
//			if(rolesToBeSavedOnTP2=='')
//		    {
//		    	rolesToBeSavedOnTP2 = "1";
//		    }
//		    else
//		    {
//		    	var temp = new Array();
//		    	temp = rolesToBeSavedOnTP2.split(",");
//		    	rolesToBeSavedOnTP2 = temp.join(",");
//		    }
//		    if(rolesToBeSavedOnTP2.length!=0)
//		      {
//		       rolesToBeSavedOnTP2=AllRolesFromListvar+','+rolesToBeSavedOnTP2;    
//		      }
//	    }    
	    
//	    rolesToBeSavedOnTPArray = rolesToBeSavedOnTP2.split(',');
//	    uniqueRolesToBeSavedOnTPArray= new Array();
//		for(var t=0;t<rolesToBeSavedOnTPArray.length;t++)
//		{
//			if($.inArray(rolesToBeSavedOnTPArray[t],uniqueRolesToBeSavedOnTPArray)==-1)
//				uniqueRolesToBeSavedOnTPArray.push(rolesToBeSavedOnTPArray[t]);
//		}
//		rolesToBeSavedOnTP2 = uniqueRolesToBeSavedOnTPArray.join(',')
		
//		var TestPassListname= jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//		object1.push({
//					  	  'ID':TestPassResult[jj]['ID'],
//					  	  'AllRoles':rolesToBeSavedOnTP2
//					});
//	   var result = TestPassListname.updateItem(object1);
//	}		 
		
//		///////////////////////////// Moved here from updateteststep function to here by Harshal on 15 Feb 2012 //////////////////////////////////
//		//Added by Harshal on 16 Feb 2012
//	if(TestPassesOfRemovedRoles.length != 0 || TestPassIDOfRemovedTestCases.length != 0)
//	{
//		// Added by HRW for optimization
//		TestPassesOfRemovedRoles = TestPassesOfRemovedRoles.concat(TestPassIDOfRemovedTestCases);
//		var TestPassesOfRemove = new Array();
//		TestPassesOfRemove = TestPassesOfRemovedRoles.concat(TestPassIDOfRemovedTestCases);
//		TestPassesOfRemovedRoles = new Array();
//		for(var i=0;i<TestPassesOfRemove.length;i++)
//		{
//			if($.inArray(TestPassesOfRemove[i],TestPassesOfRemovedRoles) == -1)
//				TestPassesOfRemovedRoles.push(TestPassesOfRemove[i]);
//		}	
//		/***********************************************************************************************************************************/
//		var CombinationOfTestPassIDAndSPUserIDForPMID = new Array();
//		var CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity = new Array();
//		var CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity = new Array();
//		var StatusForParentID = new Array();//For updating the status of parent list
//		//Query on Parent List with Test Pass ID(s) to get all the Parent Mapping ID(s) related to these Test Pass(es)
//		//Query on Test Pass list using ID to get All Roles column of them added by Harshal on 2 March
//		 /*Ankita:8/17/2012 Bulk data handling*/
//		 if(TestPassesOfRemovedRoles.length<=147)
//		 {
//			var q = '';
//			var camlQueryOnParentList= '<Query><Where>';
//			var camlQueryTestPass= '<Query><Where>';
//			for(var ii=0;ii<TestPassesOfRemovedRoles.length-1;ii++)
//			{
//				camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				camlQueryTestPass+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				q += '</Or>';	
//			}	
//			camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//			camlQueryTestPass+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//			camlQueryOnParentList+= q;
//			camlQueryTestPass+= q;
		
//			camlQueryOnParentList+='</Where></Query>';
//			camlQueryTestPass+='</Where><ViewFields><FieldRef Name="AllRoles" /><FieldRef Name="ID" /></ViewFields></Query>';
//			var ResultInParentList = teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
			
//			var ResultInTestPassList = teststep.dmlOperation(camlQueryTestPass,'TestPass');
//		 }
//		 else
//		 {
//		 	var OrEndTags;
//			var camlQueryOnParentList;
//			var camlQueryTestPass;
//			var numberOfIterations = Math.ceil((TestPassesOfRemovedRoles.length)/147);
//			var iterationPoint = 0;
//			var ResultInParentList = new Array();
//			var ResultInTestPassList = new Array();
//			for(var y=0;y<numberOfIterations-1;y++)
//			{
//				OrEndTags = '';
//				camlQueryOnParentList= '<Query><Where>';
//				camlQueryTestPass= '<Query><Where>';
//				for(var ii=iterationPoint ;ii< (147+iterationPoint-1);ii++)
//				{
//					camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//					camlQueryTestPass+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//					OrEndTags+= '</Or>';
//				}
//				camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				camlQueryTestPass+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				camlQueryOnParentList+= OrEndTags;
//				camlQueryTestPass+= OrEndTags;
			
//				camlQueryOnParentList+='</Where></Query>';
//				camlQueryTestPass+='</Where><ViewFields><FieldRef Name="AllRoles" /><FieldRef Name="ID" /></ViewFields></Query>';
//				var TPTCResult = teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
//				if(TPTCResult != null && TPTCResult != undefined)
//					$.merge(ResultInParentList,TPTCResult);
//				var TPresult = teststep.dmlOperation(camlQueryTestPass,'TestPass');
//				if(TPresult !=null && TPresult !=undefined)
//					$.merge(ResultInTestPassList,TPresult);
//				iterationPoint+=147;
//			}
//			camlQuery= '<Query><Where>';
//			OrEndTags='';
//	 		for(var ii=iterationPoint ;ii<TestPassesOfRemovedRoles.length-1;ii++)
//	 		{
//	 			camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				camlQueryTestPass+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				OrEndTags+= '</Or>';
//	 		}
//	 		camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//			camlQueryTestPass+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//			camlQueryOnParentList+= OrEndTags;
//			camlQueryTestPass+= OrEndTags;
		
//			camlQueryOnParentList+='</Where></Query>';
//			camlQueryTestPass+='</Where><ViewFields><FieldRef Name="AllRoles" /><FieldRef Name="ID" /></ViewFields></Query>';
//			var TPTCResult = teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
//			if(TPTCResult != null && TPTCResult != undefined)
//				$.merge(ResultInParentList,TPTCResult);
//			var TPresult = teststep.dmlOperation(camlQueryTestPass,'TestPass');
//			if(TPresult !=null && TPresult !=undefined)
//				$.merge(ResultInTestPassList,TPresult);
//		 }
//		//Query on Child List using Parent Maping ID(s)
//		if(ResultInParentList !=null && ResultInParentList!=undefined)
//		{
//			var ResultInChildList = new Array();
//			if(ResultInParentList.length <= 147)
//			{
//				var q = '';
//				var camlQueryOnChildList= '<Query><Where>';
//				for(var ii=0;ii<ResultInParentList.length-1;ii++)
//				{	camlQueryOnChildList+= '<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//					q += '</Or>';
//					/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//						CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//					/***************************************************************************************************************************************************************************************/	
//				}
//				camlQueryOnChildList+= '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//				/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//					CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//				/***************************************************************************************************************************************************************************************/	
//				if(q != '')
//					camlQueryOnChildList+= q;
//				camlQueryOnChildList+='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
//				ResultInChildList = teststep.dmlOperation(camlQueryOnChildList,'TestCaseToTestStepMapping');
//			}
//			else
//			{
//				var numberOfIterations = Math.ceil((ResultInParentList.length)/147);
//		 		var iterationPoint = 0;
//		 		var camlQuery;
//		 		var OrEndTags;
//		 		for(var y=0;y<numberOfIterations-1;y++)
//		 		{
//		 			camlQuery = '<Query><Where>';
//		 			OrEndTags = '';
//		 			for(var ii=iterationPoint ;ii< (147+iterationPoint-1);ii++)
//		 			{
//		 				camlQuery += '<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//		 				OrEndTags +='</Or>';
//		 			/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//						CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//					/***************************************************************************************************************************************************************************************/	
//		 			}
//		 			/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//						CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//					/***************************************************************************************************************************************************************************************/
//		 			camlQuery += '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//		 			camlQuery +=OrEndTags;
//		 			camlQuery +='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
		 			
//		 			var TCToTSResult = teststep.dmlOperation(camlQuery,'TestCaseToTestStepMapping');
//		 			if(TCToTSResult != null && TCToTSResult != undefined)
//		 				$.merge(ResultInChildList,TCToTSResult);
//		 			iterationPoint += 147;
//		 		}
//		 		camlQuery = '<Query><Where>';
//		 		OrEndTags = '';
//		 		for(var ii=iterationPoint ;ii<ResultInParentList.length-1;ii++)
//		 		{
//		 			camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//		 			OrEndTags +='</Or>';
//					/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//					CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//					/***************************************************************************************************************************************************************************************/
//		 		}
//		 		/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//						CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//				/***************************************************************************************************************************************************************************************/
//		 		camlQuery += '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//	 			camlQuery +=OrEndTags;
//	 			camlQuery +='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
//	 			var TCToTSResult = teststep.dmlOperation(camlQuery,'TestCaseToTestStepMapping');
//	 			if(TCToTSResult != null && TCToTSResult != undefined)
//	 				$.merge(ResultInChildList,TCToTSResult);
//			}	
//			var testPassToBeDeleted = new Array();
//			var testPassMustNotDeleted = new Array();
//			var RolesForTestPassID = new Array();//added by harshal on 2 March
//			var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
			
//			if(ResultInChildList !=null && ResultInChildList!=undefined)
//			{
//				for(var i=0;i<ResultInChildList.length;i++)
//				{
//					if($.inArray(ResultInChildList[i]["Role"],DelfromMA)!=-1)
//					{
//						CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity.push(CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList [i]["TestPassMappingID"] ] + "|" + ResultInChildList[i]["Role"]);
//					}
//					  /******************************** Addition to Algo********************************************************************/
//					if($.inArray(CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0],testPassMustNotDeleted)==-1)	
//						testPassMustNotDeleted.push(CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0]);
					
//					//Added by Harsahl on 2 March
//					if(RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] == undefined)
//						RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] = ResultInChildList[i]["Role"];//Added by Harshal on 2 March
//					else
//					{
//						var rolesInTestPass = RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ].split(",");
//						if($.inArray(ResultInChildList[i]["Role"],rolesInTestPass) == -1)
//						{
//							RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] += "," + ResultInChildList[i]["Role"];
//						}	
//					}	
//					if($.inArray(ResultInChildList[i]["TestPassMappingID"],TestPassMappingIDsForRemovedRoles) != -1)
//					{
//						if(StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] == undefined)
//							StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] = ResultInChildList[i]["status"];
//						else
//							StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] += "," + ResultInChildList[i]["status"];	
//					}		
//				 }
				
//				//Added by Harshal on 2 March 
//				if(RolesForTestPassID.length!=0)
//				{
//			 		var Obj = new Array();
//			 		var CombOfTPIDAndRoleIDToBeDeletedFromMyActivity = new Array();
//					for(var i=0;i<ResultInTestPassList.length;i++)
//			 		{
//			 			var rolesMustNotDeleteFromAllRoles = new Array();
//			 			if(RolesForTestPassID[ResultInTestPassList[i]['ID']] != undefined)
//			 				rolesMustNotDeleteFromAllRoles = RolesForTestPassID[ResultInTestPassList[i]['ID']].split(",");
//			 			var rolesToBeDeleted = new Array();
//			 			var allRolesOfTestPass = ResultInTestPassList[i]['AllRoles'].split(",");
//			 			if(allRolesOfTestPass.length != rolesMustNotDeleteFromAllRoles.length)
//			 			{
//			 				for(var ii=0;ii<DelfromMA.length;ii++)
//			 				{
//			 					if($.inArray(DelfromMA[ii],rolesMustNotDeleteFromAllRoles)==-1)
//			 					{
//			 						rolesToBeDeleted.push(DelfromMA[ii]);
//			 						CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.push(ResultInTestPassList[i]['ID'] + "," + DelfromMA[ii]);//Added by Harshal on 5 March
//			 					}
//			 				}
//				 			var remainingRoleOfTestPass = new Array();
//				 			for(var ii=0;ii<allRolesOfTestPass.length;ii++)
//				 			{
//				 				if($.inArray(allRolesOfTestPass[ii],rolesToBeDeleted) == -1)
//				 					remainingRoleOfTestPass.push(allRolesOfTestPass[ii]);
//				 			}
//				 			if(remainingRoleOfTestPass.length==0)
//				 			{
//				 				Obj.push({
//									'ID':ResultInTestPassList[i]['ID'],
//									'AllRoles' :-1
//								});
//				 			}
//				 			else
//				 			{
//				 				Obj.push({
//									'ID':ResultInTestPassList[i]['ID'],
//									'AllRoles' :remainingRoleOfTestPass
//								});
//							}
//				 		}
//					}
//					if(Obj.length!=0)
//			 			var res = TestPassList.updateItem(Obj);
			 		
//					//Added by Harshal on 5 March	
//			 		if(CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.length!=0)
//			 		{
//			 			var q = '';
//			 			var camlQueryTestPass= '<Query><Where>';
//			 			var query='<Query><Where>';//added by Mohini

//						for(var ii=0;ii<CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.length-1;ii++)
//						{
//							camlQueryTestPass+= '<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And>';
//							query+='<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><And><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq><Eq><FieldRef Name="Role" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And></And>';

//							q += '</Or>';
//						}	
//						camlQueryTestPass+= '<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And>';
//						query+='<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><And><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq><Eq><FieldRef Name="Role" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And></And>';

//						if(q != '')
//						{
//							camlQueryTestPass+= q;
//							query+=q;
//					    }

//						camlQueryTestPass+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//						query+='</Where></Query>';


//						var ResultInMyActivitytList= teststep.dmlOperation(camlQueryTestPass,'MyActivity');
//						var MyActivityListName2 = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
						
//						var Listname = jP.Lists.setSPObject(teststep.SiteURL,'FeedbackRating');
//					    var resultInFeedbackRatingList=teststep.dmlOperation(query,'FeedbackRating');
					    
//						if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//						{
//							for(var i=0;i<ResultInMyActivitytList.length;i++)
//							{
//								var res =MyActivityListName2.deleteItem(ResultInMyActivitytList[i]['ID']);
//							}	
//						}
//						if(resultInFeedbackRatingList!=null && resultInFeedbackRatingList!=undefined)
//						{
//							for(var i=0;i<resultInFeedbackRatingList.length;i++)
//							{
//								var res =Listname.deleteItem(resultInFeedbackRatingList[i]['ID']);
//							}	
//						}

//					}	
//			 	}
//				else
//			 	{
//			 		var CombOfTPIDAndRoleIDToBeDeletedFromMyActivity = new Array();
//			 		var Obj = new Array();
//			 		for(var i=0;i<ResultInTestPassList.length;i++)
//			 		{
//			 			var allRolesOfTestPass = ResultInTestPassList[i]['AllRoles'].split(",");
//			 			var remainingRoleOfTestPass = new Array();
//			 			for(var ii=0;ii<allRolesOfTestPass.length;ii++)
//			 			{
//			 				if($.inArray(allRolesOfTestPass[ii],DelfromMA) == -1)
//			 					remainingRoleOfTestPass.push(allRolesOfTestPass[ii]);
//			 				else
//			 					CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.push(ResultInTestPassList[i]['ID'] + "," + allRolesOfTestPass[ii]);//Added by Harshal on 5 March
//			 			}
//			 			if(remainingRoleOfTestPass.length==0)
//			 			{
//			 				Obj.push({
//								'ID':ResultInTestPassList[i]['ID'],
//								'AllRoles' :-1
//							});
//			 			}
//			 			else
//			 			{
//			 				Obj.push({
//								'ID':ResultInTestPassList[i]['ID'],
//								'AllRoles' :remainingRoleOfTestPass
//							});
//						}
//			 		}
//			 		if(Obj.length!=0)
//			 			var res = TestPassList.updateItem(Obj);
			 		
//                    //Added by Harshal on 5 March	
//			 		if(CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.length!=0)
//			 		{
//			 			var q = '';
//			 			var camlQueryTestPass= '<Query><Where>';
//			 			var query='<Query><Where>';//added by Mohini

//						for(var ii=0;ii<CombOfTPIDAndRoleIDToBeDeletedFromMyActivity.length-1;ii++)
//						{
//							camlQueryTestPass+= '<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And>';
//							query+='<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><And><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq><Eq><FieldRef Name="Role" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And></And>';

//							q += '</Or>';
//						}	
//						camlQueryTestPass+= '<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And>';
//						query+='<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[0]+'</Value></Eq><And><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq><Eq><FieldRef Name="Role" /><Value Type="Text">'+CombOfTPIDAndRoleIDToBeDeletedFromMyActivity[ii].split(",")[1]+'</Value></Eq></And></And>';

//						if(q != '')
//						{
//							camlQueryTestPass += q;
//							query+=q;
//						}
//						camlQueryTestPass+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//						query+='</Where></Query>';


//						var ResultInMyActivitytList= teststep.dmlOperation(camlQueryTestPass,'MyActivity');
//						var MyActivityListName2 = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
						
//						var Listname = jP.Lists.setSPObject(teststep.SiteURL,'FeedbackRating');
//						var resultInFeedbackRatingList=teststep.dmlOperation(query,'FeedbackRating');

//						if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//						{
//							for(var i=0;i<ResultInMyActivitytList.length;i++)
//							{
//								var res =MyActivityListName2.deleteItem(ResultInMyActivitytList[i]['ID']);
//							}	
//						}
//						if(resultInFeedbackRatingList!=null && resultInFeedbackRatingList!=undefined)
//						{
//							for(var i=0;i<resultInFeedbackRatingList.length;i++)
//							{
//								var res =Listname.deleteItem(resultInFeedbackRatingList[i]['ID']);
//							}	
//						}

//					}	
//			 	}
		      
//		        //Added on 1 Mar 2012 by Harshal if any Test Pass(es) of Comman Test Pass(es) don't have any Test Step
//		        for(var i=0;i<TestPassesOfRemovedRoles.length;i++)
//		        {
//		        	if($.inArray(TestPassesOfRemovedRoles[i],testPassMustNotDeleted)==-1)
//		        	{
//		        		testPassToBeDeleted.push(TestPassesOfRemovedRoles[i]);
//		        	}
//		        }
//		        if(testPassToBeDeleted.length!=0)
//		        {
//					var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//					var obj = new Array();
//					var q = '';
//				    var camlQuery= '<Query><Where>';
//				    var query='<Query><Where>';//added by Mohini

//					for(var ii=0;ii<testPassToBeDeleted.length-1;ii++)
//					{
//						camlQuery+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassToBeDeleted[ii]+'</Value></Eq>';
//						query+='<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassToBeDeleted[ii]+'</Value></Eq><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq></And>';

//						q += '</Or>';
//						/***********A separate code accomodated here to avoid iterations;*********/
//						obj.push({
//							'ID' : testPassToBeDeleted[ii],
//							'AllRoles' : -1
//						});
//						/*************************************************************************/
//					}	
//					camlQuery+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassToBeDeleted[ii]+'</Value></Eq>';
//					query+='<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassToBeDeleted[ii]+'</Value></Eq><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq></And>';

//						/***********A separate code accomodated here to avoid iterations;*********/
//						obj.push({
//							'ID' : testPassToBeDeleted[ii],
//							'AllRoles' : -1
//						});
//						/*************************************************************************/

//					if(q != '')
//					{
//						camlQuery += q;
//						query+=q;
//				    }

//					camlQuery+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//					query+='</Where></Query>';
					
//					var ResultInMyActivitytList = teststep.dmlOperation(camlQuery,'MyActivity');
					
//					var Listname = jP.Lists.setSPObject(teststep.SiteURL,'FeedbackRating');
//					var resultInFeedbackRatingList=teststep.dmlOperation(query,'FeedbackRating');

//					if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//					{
//						for(var i=0;i<ResultInMyActivitytList.length;i++)
//						{
//							var res =MyActivityListName.deleteItem(ResultInMyActivitytList[i]['ID']);
//						}	
//					}
//					if(resultInFeedbackRatingList!=null && resultInFeedbackRatingList!=undefined)
//					{
//						for(var i=0;i<resultInFeedbackRatingList.length;i++)
//						{
//							var res =Listname.deleteItem(resultInFeedbackRatingList[i]['ID']);
//						}	
//					}

//					if(obj.length!=0)
//						var res = TestPassList.updateItem(obj);
//		        }	
//			}
//			else//If there is no test step under Test Pass(es) Added by Harshal for bug 1342 and 1065
//			{
//				var obj = new Array();
//				var q = '';
//				var camlQuery= '<Query><Where>';
//				var query='<Query><Where>';//added by Mohini

//				for(var ii=0;ii<TestPassesOfRemovedRoles.length-1;ii++)
//				{
//					camlQuery+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//					query+='<Or><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq></And>';

//					q += '</Or>';
					
//					obj.push({
//								'ID' : TestPassesOfRemovedRoles[ii],
//								'AllRoles' : -1
//							});
//				}			
//				camlQuery+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq>';
//				query+='<And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+TestPassesOfRemovedRoles[ii]+'</Value></Eq><Eq><FieldRef Name="SPUserID" /><Value Type="Text">'+_spUserId +'</Value></Eq></And>';
		
//					obj.push({
//								'ID' : TestPassesOfRemovedRoles[ii],
//								'AllRoles' : -1
//							});	
//				if(q != '')
//				{
//					camlQuery+= q;
//					query+=q;
//				}

//				camlQuery+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//				query+='</Where></Query>';
				
//				var MyActivityResult = teststep.dmlOperation(camlQuery,'MyActivity');
				
//				var Listname = jP.Lists.setSPObject(teststep.SiteURL,'FeedbackRating');
//				var resultInFeedbackRatingList=teststep.dmlOperation(query,'FeedbackRating');

//				if(MyActivityResult !=null && MyActivityResult!=undefined)
//				{
//					var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//					for(var aa=0;aa<MyActivityResult.length;aa++)
//					{
//						var res =MyActivityListName.deleteItem(MyActivityResult[aa]['ID']);
//					}
//				}
//				if(resultInFeedbackRatingList!=null && resultInFeedbackRatingList!=undefined)
//				{
//					for(var i=0;i<resultInFeedbackRatingList.length;i++)
//					{
//						var res =Listname.deleteItem(resultInFeedbackRatingList[i]['ID']);
//					}	
//				}

//				var res = TestPassList.updateItem(obj);
//			}
//		}
		
//		if(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length !=0)
//		{	
//        /******************************** End of Addition to Algo********************************************************************/	
//        	var q = '';									
//			var queryForMyActivity = '<Query><Where>';	
//			var bufferQuery;
//			var OrCount=0;
//			var OneOrForOneDataElement = true; 
//			for(var i=0;i<CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length-1;i++)
//            {
//				if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//				{
//					queryForMyActivity += '<Or><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//					bufferQuery ='<Query><Where><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And></Eq></Where></Query>' 
//					OrCount++;
//					q += '</Or>';
//				}											
//			}
//			if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//			{	queryForMyActivity += '<And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//				OneOrForOneDataElement = false;
//			}
//			if( q != '')
//				queryForMyActivity += q;
				
//            queryForMyActivity += '</Where></Query>';
            
//            if(OneOrForOneDataElement == true &&  OrCount==1)
//            	queryForMyActivity = bufferQuery;
            	
//            if(queryForMyActivity != '<Query><Where></Where></Query>')	
//            {	
//           		var MyActivityResult = teststep.dmlOperation(queryForMyActivity,'MyActivity');
            
//				if(MyActivityResult !=null && MyActivityResult!=undefined)
//				{
//					var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//					for(var aa=0;aa<MyActivityResult.length;aa++)
//					{
//						var res =MyActivityListName.deleteItem(MyActivityResult[aa]['ID']);
//					}
//				} 
//			}	
//		}
//		 //Updating status of Parent List added on 13 April
//        var ParentList = jP.Lists.setSPObject(teststep.SiteURL,'TestPassToTestCaseMapping');
//        var objForParentMapping = new Array();
//    	for(var i=0;i<TestPassMappingIDsForRemovedRoles.length;i++)
//    	{
//    		if(StatusForParentID[TestPassMappingIDsForRemovedRoles[i]] != undefined)
//    		{
//    			var status = StatusForParentID[TestPassMappingIDsForRemovedRoles[i]].split(",");
//    			if($.inArray("Fail",status) != -1)
//    			{
//    				objForParentMapping.push({
//    				'ID' : TestPassMappingIDsForRemovedRoles[i],
//    				'status' : 'Fail'
//    				});
//				}
//    			else if($.inArray("Not Completed",status) != -1)
//    			{
//    				objForParentMapping.push({
//    				'ID' : TestPassMappingIDsForRemovedRoles[i],
//    				'status' : 'Not Completed'
//    				});
//				}
//    			else
//    			{
//    				objForParentMapping.push({
//    				'ID' : TestPassMappingIDsForRemovedRoles[i],
//    				'status' : 'Pass'
//    				});
//    			}
//    		}
//    		else
//    		{
//    			objForParentMapping.push({
//    				'ID' : TestPassMappingIDsForRemovedRoles[i],
//    				'status' : 'Not Completed'
//    			});
//    		}
//    	}
//        if(objForParentMapping.length!=0)
//			var r = ParentList.updateItem(objForParentMapping);
//	}	
//},

//New Function Added for Export test step Feature by swapnil kamle on 27 jan 2013 
//ExporttestSteps:function()
//{
// var query = '<Query><Where><Eq><FieldRef Name="ProjectID" /><Value Type="Text">'+teststep.projectId+'</Value></Eq></Where>'+
//			'<ViewFields><FieldRef Name="ID"/><FieldRef Name="Role" /><FieldRef Name="Tester" /></ViewFields>'+
//			'</Query>';
				
//	teststep.AllRolesCollection=new Array();
//	var TesterRoles =new Array();
//	TesterRoles = teststep.dmlOperation(query,'TesterRole');
//    teststep.AllRolesCollection[1] = 'Standard';
//    if(TesterRoles!=undefined)
//    {
//        for(var i=0;i<TesterRoles.length;i++)
//        {
//           teststep.AllRolesCollection[TesterRoles[i]['ID']] = TesterRoles[i]['Role'];
//		}
//    }
//	teststep.allTestCaseIDsWithinSelectedTestPass.length;
//	teststep.testStepIdsGlbl2.length=0;
//	resultSetForExport = new Array();//awapnil 25 jan 2013
//	flagAll=0;//flag for select all
//	if(flagAll==1)
//	{
//		teststep.showTestStepFromBuffer(teststep.allTestCaseIDsWithinSelectedTestPass);
//	}
//	else
//	{
//	   var id =new Array();	
//		$("#testCaseName div div li").each(
//			function()
//			{
//				id.push($(this).children(".mslChk").attr('Id').split("_")[1]);					
//				teststep.allTestCaseIDsWithinSelectedTestPass.push($(this).children(".mslChk").attr('Id').split("_")[1]);//Added by Rajiv on 10 August to resolve 2165 in an optimized way
//			});
//		var teststepids = new Array();	
//		var teststepsBuffer=new Array();
//		var CollectionFrameworkForTestPassMappingID=new Array();  
//		if(id.length !=0)
//		{
//		   var camlQuery = '<Query><Where><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+teststep.testPassId+'</Value></Eq></Where></Query>';
//		   var TestPassToTestCaseResult = teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping');
//		   //ankita: 8/10/2012 for bug 2165
//		   //teststep.NewTestPassToTestCaseResult=TestPassToTestCaseResult;
//		   var TestCaseIDsForTestStepID = new Array();//Added by Harshal on 28 March 2012
//		   var TCIDForParentID = new Array();
//		   var TestCaseToTestStepResult = new Array();
//		   if(TestPassToTestCaseResult!=null && TestPassToTestCaseResult !=undefined) 
//		   {
//			    //Optimization on 24 April 2012
//			    if(TestPassToTestCaseResult.length<=147)
//				{	
//					var q = '';
//					var camlQuery = '<Query><Where>';
//					for(var i=0;i<TestPassToTestCaseResult.length-1;i++)   
//					{
//						camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+TestPassToTestCaseResult[i]['ID']+'</Value></Eq>';
//						TCIDForParentID[ TestPassToTestCaseResult[i]['ID'] ] = TestPassToTestCaseResult[i]['TestCaseID'];
//						q += '</Or>';
//					}	
//					camlQuery += '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+TestPassToTestCaseResult[i]['ID']+'</Value></Eq>';
//						TCIDForParentID[ TestPassToTestCaseResult[i]['ID'] ] = TestPassToTestCaseResult[i]['TestCaseID'];
//					if(q != '')
//						camlQuery += q;
//					camlQuery +='</Where><ViewFields><FieldRef Name="TestStep" /><FieldRef Name="TestPassMappingID" /></ViewFields></Query>';
//					TestCaseToTestStepResult = teststep.dmlOperation(camlQuery ,'TestCaseToTestStepMapping');
//				}
//				else
//				{
//					var iteration= Math.ceil((TestPassToTestCaseResult.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//		          	var iterationStartPoint=0;
//		          	for(var y=0;y<iteration;y++)
//		          	{
//						if(y!=iteration-1)
//			          	{
//			          		var q = '';
//			          		var camlQuery = '<Query><Where>';	
//			          		for(var i=0+iterationStartPoint;i<(147+iterationStartPoint)-1;i++)
//							{	
//								camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+TestPassToTestCaseResult[i]['ID']+'</Value></Eq>';
//								TCIDForParentID[ TestPassToTestCaseResult[i]['ID'] ] = TestPassToTestCaseResult[i]['TestCaseID'];
//								q += '</Or>';
//							}	
//							camlQuery += '<Eq><FieldRef Name="TestPassMappingID"/><Value Type="Text">'+TestPassToTestCaseResult[i]['ID']+'</Value></Eq>';
//								TCIDForParentID[ TestPassToTestCaseResult[i]['ID'] ] = TestPassToTestCaseResult[i]['TestCaseID'];
//							if(q != '')
//								camlQuery += q;
//							camlQuery +='</Where><ViewFields><FieldRef Name="TestStep"/><FieldRef Name="TestPassMappingID"/><FieldRef Name="ReferenceID"/><FieldRef Name="ExpectedResult"/><FieldRef Name="status"/><FieldRef Name="Role"/><FieldRef Name="TestCasesID"/></ViewFields><OrderBy><FieldRef Name="position" Ascending="True"/></OrderBy></Query>';				
			                
//			                iterationStartPoint+=147;
			            
//							var ActResult = teststep.dmlOperation(camlQuery ,'TestCaseToTestStepMapping');
//				            if(ActResult!=null && ActResult!=undefined)
//				            { 
//				            	  $.merge(TestCaseToTestStepResult,ActResult);	//modified by swapnil on 17 july
//				            } 	
//		                }
//						else
//						{
//							var q = '';
//							var camlQuery = '<Query><Where>';
//							for(var w=iterationStartPoint;w<(TestPassToTestCaseResult.length)-1;w++)
//							{
//								camlQuery +='<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+TestPassToTestCaseResult[w]['ID']+'</Value></Eq>';
//								TCIDForParentID[ TestPassToTestCaseResult[w]['ID'] ] = TestPassToTestCaseResult[w]['TestCaseID'];
//								q += '</Or>';
//							}	
//							camlQuery += '<Eq><FieldRef Name="TestPassMappingID"/><Value Type="Text">'+TestPassToTestCaseResult[w]['ID']+'</Value></Eq>';
//								TCIDForParentID[ TestPassToTestCaseResult[w]['ID'] ] = TestPassToTestCaseResult[w]['TestCaseID'];
//							if(q != '')
//								camlQuery += q;
//							camlQuery +='</Where><ViewFields><FieldRef Name="TestStep"/><FieldRef Name="TestPassMappingID"/></ViewFields></Query>';
											
//				         	var ActResult = teststep.dmlOperation(camlQuery ,'TestCaseToTestStepMapping');
//				            if(ActResult!=null && ActResult!=undefined)
//				            { 
//				            	for(var t=0;t<(ActResult.length);t++)	
//				            		TestCaseToTestStepResult.push(ActResult[t]);
//				            }		  
//				     	}		
//	          		}
//				}		
//				if(TestCaseToTestStepResult != null && TestCaseToTestStepResult != undefined)
//			    {
//			     	for(var m=0;m<TestCaseToTestStepResult.length;m++)
//			    	{
//			    		//Added by Harshal on 29 March If test step present in Test Case(s) of Test Pass but if this Test Step present in comman test case(comman in two test passes) too but not in comman Test Case of selected Test Pass
//			    		if(TestCaseIDsForTestStepID[ TestCaseToTestStepResult[m]['TestStep'] ] == undefined)
//			    			TestCaseIDsForTestStepID[ TestCaseToTestStepResult[m]['TestStep'] ] = TCIDForParentID[ TestCaseToTestStepResult[m]['TestPassMappingID'] ];
//			    		else
//			    		{
//			    			var TCIDs = TestCaseIDsForTestStepID[ TestCaseToTestStepResult[m]['TestStep'] ].split(",");
//			    			if($.inArray(TCIDForParentID[ TestCaseToTestStepResult[m]['TestPassMappingID'] ],TCIDs) == -1)
//			    				TestCaseIDsForTestStepID[ TestCaseToTestStepResult[m]['TestStep'] ] +=  "," + TCIDForParentID[ TestCaseToTestStepResult[m]['TestPassMappingID'] ];
//			    		}		
			    			
//			    		if($.inArray(TCIDForParentID[ TestCaseToTestStepResult[m]['TestPassMappingID'] ],id) != -1)
//			    		{	
//			    			if($.inArray(TestCaseToTestStepResult[m]['TestStep'],teststepids)==-1)
//					        { 
//						       teststepids.push(TestCaseToTestStepResult[m]['TestStep']);
//						       teststep.testStepIdsGlbl2.push(TestCaseToTestStepResult[m]['TestStep']);
//						       if(teststep.flagSelectAll>=1)
//						        teststep.testStepIdsGlblSelectAll.push(TestCaseToTestStepResult[m]['TestStep']);          
//					        }
//			    		}
//			    	}	
//			    }		
//			}
//	   }
//	   else
//	   {
//	     // teststep.alertBox('No test Steps found!');
//	      teststep.alertBox('No '+teststep.gConfigTestStep.toLowerCase()+'s found!');//Added by Mohini for Resource file
//			 return;
//	   }
//     	if(id != null && id != '')
//		{	
//			var teststepresult = new Array();
//			var attachmentresult = new Array();
//			if(teststepids.length<=147)
//			{
//				var q = '';
//				var camlQueryForAttachment='<Query><Where>';
//				var camlQuery='';
//				camlQuery = '<Query><Where>';
//				for(var i=0;i<teststepids.length-1;i++)			 
//				{
//					camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+teststepids[i]+'</Value></Eq>';
//					camlQueryForAttachment += '<Or><Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[i]+'</Value></Contains>';
//					q += '</Or>';	
//				}	
//				camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+teststepids[i]+'</Value></Eq>';
//				camlQueryForAttachment += '<Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[i]+'</Value></Contains>';
//				if(q != '')
//				{
//					camlQuery += q;
//					camlQueryForAttachment += q;
//				}	
//				camlQuery +='</Where><ViewFields><FieldRef Name="ID"/><FieldRef Name="actionName"/><FieldRef Name="ReferenceID"/><FieldRef Name="ExpectedResult"/><FieldRef Name="status"/><FieldRef Name="Role"/><FieldRef Name="TestCasesID"/></ViewFields><OrderBy><FieldRef Name="position" Ascending="True"/></OrderBy></Query>';
//				camlQueryForAttachment += '</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="TestStepID" /></ViewFields></Query>';
//				teststepresult = teststep.dmlOperation(camlQuery,'Action');
//				attachmentresult = teststep.dmlOperation(camlQueryForAttachment,'Attachment');
//			}
//			else
//			{
//				var iteration= Math.ceil((teststepids.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//	          	var iterationStartPoint=0;
//	          	for(var y=0;y<iteration;y++)
//	          	{
//					if(y!=iteration-1)
//		          	{
//		          		var q = '';
//		          		var camlQuery = '<Query><Where>';
//		          		var camlQueryForAttachment='<Query><Where>';	
//		          		for(var i=0+iterationStartPoint;i<(147+iterationStartPoint)-1;i++)
//						{
//							camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+teststepids[i]+'</Value></Eq>';
//							camlQueryForAttachment += '<Or><Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[i]+'</Value></Contains>';
//							q += '</Or>';	
//						}	
//						camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+teststepids[i]+'</Value></Eq>';
//						camlQueryForAttachment += '<Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[i]+'</Value></Contains>';
//						if(q != '')
//						{
//							camlQuery += q;
//							camlQueryForAttachment += q;
//						}
//						camlQuery +='</Where><ViewFields><FieldRef Name="ID"/><FieldRef Name="actionName"/><FieldRef Name="ReferenceID"/><FieldRef Name="ExpectedResult"/><FieldRef Name="status"/><FieldRef Name="Role"/><FieldRef Name="TestCasesID"/></ViewFields><OrderBy><FieldRef Name="position" Ascending="True"/></OrderBy></Query>';				
//		                camlQueryForAttachment += '</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="TestStepID" /></ViewFields></Query>';
		                
//		                iterationStartPoint+=147;
		            
//						var ActResult = teststep.dmlOperation(camlQuery,'Action');
//			            if(ActResult!=null && ActResult!=undefined)
//			            { 
//			            	 $.merge(teststepresult,ActResult);	//modified by swapnil on 17 july
//			            } 
//			            attachmentresult = teststep.dmlOperation(camlQueryForAttachment,'Attachment');	
//			            if(attachmentresult != null && attachmentresult != undefined)
//						{
//							for(var i=0;i<attachmentresult.length;i++)
//							{
//								var m = attachmentresult[i]['TestStepID'].split(",");//Test step can be comma sepearted
//								if(m.length == 1)
//								{
//									if(teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] == undefined)
//										teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] = attachmentresult[i]['ID'];
//								}
//								else
//								{
//									for(var ii = 0;ii<m.length;ii++)
//									{
//										if(teststep.attachmentResultForTestStepID[ m[ii] ] == undefined)
//											teststep.attachmentResultForTestStepID[ m[ii] ] = attachmentresult[i]['ID'];
//									}
//								}		
//							}
//						}
//	                }
//					else
//					{
//						var q = '';
//						var camlQuery = '<Query><Where>';
//						var camlQueryForAttachment='<Query><Where>';
//						for(var w=iterationStartPoint;w<(teststepids.length)-1;w++)
//						{
//							camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+teststepids[w]+'</Value></Eq>';
//							camlQueryForAttachment += '<Or><Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[w]+'</Value></Contains>';
//							q += '</Or>';
//						}	
//						camlQuery += '<Eq><FieldRef Name="ID"/><Value Type="Counter">'+teststepids[w]+'</Value></Eq>';
//						camlQueryForAttachment += '<Contains><FieldRef Name="TestStepID" /><Value Type="Text">'+teststepids[w]+'</Value></Contains>';
//						if(q != '')
//						{
//							camlQuery += q;
//							camlQueryForAttachment += q;
//						}							
//						camlQuery +='</Where><ViewFields><FieldRef Name="ID"/><FieldRef Name="actionName"/><FieldRef Name="ReferenceID"/><FieldRef Name="ExpectedResult"/><FieldRef Name="status"/><FieldRef Name="Role"/><FieldRef Name="TestCasesID"/></ViewFields><OrderBy><FieldRef Name="position" Ascending="True"/></OrderBy></Query>';
//						camlQueryForAttachment += '</Where><ViewFields><FieldRef Name="ID" /><FieldRef Name="TestStepID" /></ViewFields></Query>';
										
//			         	var ActResult = teststep.dmlOperation(camlQuery,'Action');
//			            if(ActResult!=null && ActResult!=undefined)
//			            { 
//			            	for(var t=0;t<(ActResult.length);t++)	
//			            		teststepresult.push(ActResult[t]);
//			            }
			            
//						attachmentresult = teststep.dmlOperation(camlQueryForAttachment,'Attachment');	
//			            if(attachmentresult != null && attachmentresult != undefined)
//						{
//							for(var i=0;i<attachmentresult.length;i++)
//							{
//								var m = attachmentresult[i]['TestStepID'].split(",");//Test step can be comma sepearted
//								if(m.length == 1)
//								{
//									if(teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] == undefined)
//										teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] = attachmentresult[i]['ID'];
//								}
//								else
//								{
//									for(var ii = 0;ii<m.length;ii++)
//									{
//										if(teststep.attachmentResultForTestStepID[ m[ii] ] == undefined)
//											teststep.attachmentResultForTestStepID[ m[ii] ] = attachmentresult[i]['ID'];
//									}
//								}		
//							}
//						}
//			     	}		
//          		}
//			}	
//			teststep.result = teststepresult;
			
//			//Added by HRW on 18 July 2012
//			if(attachmentresult != null && attachmentresult != undefined)
//			{
//				for(var i=0;i<attachmentresult.length;i++)
//				{
//					var m = attachmentresult[i]['TestStepID'].split(",");//Test step can be comma sepearted
//					if(m.length == 1)
//					{
//						if(teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] == undefined)
//							teststep.attachmentResultForTestStepID[ attachmentresult[i]['TestStepID'] ] = attachmentresult[i]['ID'];
//					}
//					else
//					{
//						for(var ii = 0;ii<m.length;ii++)
//						{
//							if(teststep.attachmentResultForTestStepID[ m[ii] ] == undefined)
//								teststep.attachmentResultForTestStepID[ m[ii] ] = attachmentresult[i]['ID'];
//						}
//					}		
//				}
//			}	
//			var actionListName = jP.Lists.setSPObject(teststep.SiteURL,'Action');
//			var obj = new Array();
//			if(teststepids.length>0)
//			{
//				if(teststep.result!=null && teststep.result!=undefined)
//					if(teststep.result[0]["position"]==undefined || teststep.result[0]["position"]==null || teststep.result[0]["position"]=='')
//						for(var j=0;j< teststep.result.length;j++)
//						{	
//								obj.push({'ID':teststep.result[j]['ID'],
//										  'position':(j)	
//								});
//								var result = actionListName.updateItem(obj);
//						}
//			}
//			var actionLength;
//			if( teststep.result != null || teststep.result != undefined)
//				actionLength=teststep.result.length;
//			var Ei;
			                    						
//			if(teststep.result == null || teststep.result == undefined)
//			{	
//			 //teststep.alertBox('No test Steps found!');
//			 teststep.alertBox('No '+teststep.gConfigTestStep.toLowerCase()+'s found!');//Added by Mohini for Resource file
//			 return;
//			}
//			else
//			{				
//				var table='';
//				var expResult ='';					
//				var actionName = '';
//				var attachimg ='';
				
//				//New code added by HRW on 18 July 2012 for speed enhancement 	
//				var allTestCaseIDs = new Array();
//				if(teststep.flagForTC == false)
//				{
//					teststep.flagForTC = true;
//					$("#testCaseName div div li").each(
//						function()
//						{	
//							allTestCaseIDs.push($(this).children(".mslChk").attr('Id').split("_")[1]);
//						});
						
//					//Ankita: 8/27/2012 Bulk data handling
//					if(allTestCaseIDs.length<=147)
//					{
//						var q = '';	
//						var camlQuery = '<Query><Where>';
//						for(var t=0;t<allTestCaseIDs.length-1;t++)   
//						{
//							camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[t]+'</Value></Eq>';
//							q += '</Or>';
//						}	
//						camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[t]+'</Value></Eq>';
//						if(q != '')
//							camlQuery += q;
//						camlQuery +='</Where><ViewFields><FieldRef Name="testCaseName" /><FieldRef Name="ID" /></ViewFields></Query>';
//						var testCResult = teststep.dmlOperation(camlQuery,'TestCases');	
//					}
//					else
//					{
//						var numberOfIterations= Math.ceil(allTestCaseIDs.length/147);
//						var iterationPoint=0;
//						var camlQuery;
//						var orEndfTag;
//						var testCResult= new Array();
//						for(var y=0; y<numberOfIterations-1; y++)
//						{
//							camlQuery = '<Query><Where>';
//							orEndfTag='';
//							for(var i=iterationPoint; i<(iterationPoint+147)-1; i++)
//							{
//								camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[i]+'</Value></Eq>';
//								orEndfTag+= '</Or>';
//							}
//							camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[i]+'</Value></Eq>';
//							camlQuery += orEndfTag;
//							camlQuery +='</Where><ViewFields><FieldRef Name="testCaseName" /><FieldRef Name="ID" /></ViewFields></Query>';
//							var TCResult= teststep.dmlOperation(camlQuery,'TestCases');
//							if(TCResult!=null && TCResult!=undefined)
//								$.merge(testCResult,TCResult);
//							iterationPoint+=147;	
//						}
//						camlQuery = '<Query><Where>';
//						orEndfTag='';
//						for(var i=iterationPoint; i<allTestCaseIDs.length-1; i++)
//						{
//							camlQuery +='<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[i]+'</Value></Eq>';
//							orEndfTag+= '</Or>';
//						}
//						camlQuery += '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+allTestCaseIDs[i]+'</Value></Eq>';
//						camlQuery += orEndfTag;
//						camlQuery +='</Where><ViewFields><FieldRef Name="testCaseName" /><FieldRef Name="ID" /></ViewFields></Query>';
//						var TCResult= teststep.dmlOperation(camlQuery,'TestCases');
//						if(TCResult!=null && TCResult!=undefined)
//							$.merge(testCResult,TCResult);
//					}
//					if(testCResult != null && testCResult != undefined)
//					{
//						for(var i=0;i<testCResult.length;i++)
//							teststep.testCaseNameForTCID[ testCResult[i]['ID'] ] = testCResult[i]['testCaseName'];
//					}
//					teststep.allTestCaseIDsOfTP.length = 0;
//					teststep.allTestCaseIDsOfTP = allTestCaseIDs;
//				}	
				
//				for(var i=0;i<teststep.result.length;i++)//modified by swapnil on 25 jan 2013 for export resultset
//				{																																	
//					var testc2 = teststep.result[i]['TestCasesID'].split(",");
//					//Added by Harshal on 29 March If test step present in Test Case(s) of Test Pass but if this Test Step present in comman test case(comman in two test passes) too but not in comman Test Case of selected Test Pass  		
					
//					var TestCaseIDsOfTestStep = TestCaseIDsForTestStepID[ teststep.result[i]['ID'] ].split(",");
//					var testc = new Array();
//					if(testc2.length>TestCaseIDsOfTestStep.length)
//					{
//						for(var iii=0;iii<testc2.length;iii++)
//						{
//							if($.inArray(testc2[iii],TestCaseIDsOfTestStep) != -1)
//							{
//								if($.inArray(testc2[iii],teststep.allTestCaseIDsOfTP) != -1)
//									testc.push(testc2[iii]);
//							}	
//						}
//					}
//					else
//					{
//						for(var iii=0;iii<testc2.length;iii++)
//						{
//							if($.inArray(testc2[iii],teststep.allTestCaseIDsOfTP) != -1)
//								testc.push(testc2[iii]);
//						}
//					}	
					
//					var testCaseNames='';
//					//Optimized on 18 July
//					for(var t=0;t<testc.length;t++)
//					{
//						if(t<testc.length-1)
//						{
//							testCaseNames +=  teststep.testCaseNameForTCID[ testc[t] ];
//							testCaseNames +="|";
//						}
//						else
//							testCaseNames += teststep.testCaseNameForTCID[ testc[t] ];
//					}
					
//					var completeTestCaseName = 	testCaseNames.replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
//					testCaseNames = trimText(testCaseNames,25);	
					
//					if(teststep.attachmentResultForTestStepID[ teststep.result[i]['ID'] ] != undefined )
//						var attachimg = '<img title="View Attachment Details" src="../SiteAssets/images/icon-attachment.png" alt="Attachment"></img>';
//					else
//						var attachimg = '&nbsp';	
																	
//					expResult = (teststep.result[i]["ExpectedResult"] == undefined || teststep.result[i]["ExpectedResult"] == null ) ? '-' :teststep.result[i]["ExpectedResult"] ;
//					var expResultForExport = expResult;
					
//					//Nikhil - 02/04/2012 - Added to handle Bullete Text
//					expResult = teststep.GetFormatedText(expResult,'false');

//					var completeExpResult = teststep.filterData(expResult);//tooltip on anchor can not be with tags line added by sheetal on 30 March
					
//					//Nikhil - 02/04/2012 - Added to handle Bullete Text
//					actionName = teststep.GetFormatedText(teststep.result[i]['actionName'],'false');		
//					var testStepForExport = actionName; // Added by shilpa			
//					var completeActionName = teststep.filterData(actionName);
					
//					//Added by HRW to show the data that contains "" in title
//					completeActionName = completeActionName.replace(/&quot;/g, '"');
//					completeExpResult = completeExpResult.replace(/"/g, "&quot;");
//					completeTestCaseName = completeTestCaseName.replace(/&quot;/g, '"');
					
//					/*** Added by shilpa ***/	
//					completeActionName =completeActionName.replace(/(\r\n)+/g, '');
//					if(actionName.indexOf("<") == -1 && actionName.indexOf(">") == -1)
//						actionName=actionName;
//					else
//					   actionName=completeActionName;
					
//					completeExpResult=completeExpResult.replace(/(\r\n)+/g, '');
//					if(expResult.indexOf("<") == -1 && expResult.indexOf(">") == -1)
//						expResult =expResult;
//					else
//					   expResult =completeExpResult;
//					/*********/	
					
//                   	//var devitem = (teststep.result[i]['ReferenceID']	!= null && teststep.result[i]['ReferenceID'] != undefined) ? teststep.result[i]['ReferenceID'] : 'N/A';
//					//var sequence=teststep.result[i]['position']!=undefined && teststep.result[i]['position']!=undefined?(parseInt(teststep.result[i]['position'])+1).toString():i+1;
//					var sequence = (parseInt(teststep.result[i]['position'])+1).toString();
//					//teststep.allteststepsdata[i]=completeTestCaseName.replace(/(.|\n)*?/ig,'');
//					teststep.allteststepsdata[i]=completeActionName;
//					/*Code by swapnil on 25 jan 2013 for Export resultset*/
					
//					resultSetForExport["TestStep"] += "`" + testStepForExport; // modified by shilpa
//					resultSetForExport["TestCase"] += "`" + ((completeTestCaseName.replace(/(.|\n)*?/ig,'')).replace(/&lt;/g,'<')).replace(/&gt;/g,'>');
//					//resultSetForExport["ExpectedResult"] += "`" + completeExpResult.replace(/&quot;/g, '"');
//					resultSetForExport["ExpectedResult"] += "`" + expResultForExport;
					
//					var  roles='';
//					if(teststep.result[i]['Role']!=undefined)
//					{
//					   if(teststep.result[i]['Role'].indexOf('div') != -1)
//					   {
//					   		var rolesTS = teststep.result[i]['Role'].split('>')[1].split('<')[0];
//					   		var teststepsroles=rolesTS.split(',');
//					   }	
//					   else
//					   		var teststepsroles=teststep.result[i]['Role'].split(',');
					   				
//					   for(var j=0;j<teststepsroles.length;j++)
//					   {
//					    roles+= ','+teststep.AllRolesCollection[teststepsroles[j]]
//					   }
//					}
//					resultSetForExport["Roles"] += "`" + roles.substring(1,roles.length);
//				}															               
//				return resultSetForExport;
//			}
//		}
//		else
//		{
//		    //teststep.alertBox('No test Steps found!');
//		    teststep.alertBox('No '+teststep.gConfigTestStep.toLowerCase()+'s found!');//Added by Mohini for Resource file
//			 return;
//	    }	
//	}
//	Main.hideLoading();		 
//},	

onClickAttaAnch:function(testCase,testStep)
{
	Main.deletecookie("AttachPageState");
	var prjName = teststep.projectId; //$("#projectName").val(); 
	var passNm = teststep.testPassId; //$('#testPassName').val();
	
	window.location.href="/attachment/Index?pid="+prjName+"&tpid="+passNm+"&tcid="+testCase+"&tsid="+testStep+"";
},

swapUpForTPSeq:function(i)
{
	var actionListName = jP.Lists.setSPObject(teststep.SiteURL,'Action');
	var obj = new Array();
	if(i!=0)
	{
		obj.push({'ID':teststep.result[i]['ID'],
						  'position':teststep.result[i-1]['position']	
				});
		obj.push({'ID':teststep.result[i-1]['ID'],
						  'position':teststep.result[i]['position']	
				});		
		var result = actionListName.updateItem(obj);
		if(i==teststep.startIndexA)
			//teststep.alertBox("The top test step was moved to the previous step(on the previous page in the grid).");
			teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the previous step(on the previous page in the grid).");
	}
	else
	{
		var len = teststep.result.length-1;
		obj.push({'ID':teststep.result[i]['ID'],
						  'position':teststep.result[len]['position']	
				});
		obj.push({'ID':teststep.result[len]['ID'],
						  'position':teststep.result[i]['position']	
				});		
		var result = actionListName.updateItem(obj);
		if(ActionResult.length > 5)//Code added by deepak for sequencing
	    	//teststep.alertBox("The top test step was moved to the last step within this test case(on the last page in the grid).");
	    	teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the last step within this "+teststep.gConfigTestCase+"(on the last page in the grid).");
	    else
	    	//teststep.alertBox("The top test step was moved to the last step within this test case.");
	    	teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the last step within this "+teststep.gConfigTestCase+".");
	}
},
swapUp:function(i)
{
	if(teststep.sequenceForTPID[ $("#testPassName").val() ] == "1")
	{
		teststep.swapUpForTPSeq(i);
	}
	else if(i==0)
	{
			var test = "";
			
			var temp = teststep.result[i]; 
			
			teststep.result[i] = teststep.result[teststep.result.length-1];
						
			teststep.result[teststep.result.length-1] = temp;
			
			
			test = teststep.result[i].testStepId+"~"+teststep.result[teststep.result.length-1].testStepSequence
				   +"#"+teststep.result[teststep.result.length-1].testStepId+"~"+teststep.result[i].testStepSequence;
				   
			//To swap the sequence within array
			var tempSequence = teststep.result[i].testStepSequence;
			teststep.result[i].testStepSequence = teststep.result[teststep.result.length-1].testStepSequence;
			teststep.result[teststep.result.length-1].testStepSequence = tempSequence;
			
			var arrangedTestStepIDs = new Array();
			
			
			/*
			for(var j=0;j< teststep.result.length;j++)
			{	
				arrangedTestStepIDs.push(teststep.result[j].testStepId);
				
				if(test == "")
					test = teststep.result[j].testStepId+"~"+j;
				else
					test += "#"+ teststep.result[j].testStepId+"~"+j;
			}
			*/
			
			var result = ServiceLayer.InsertUpdateData("TestStepSequencing" + "/" + test, null,"TestStep");
						
			if(teststep.result.length > 10)//Code added by deepak for sequencing
		    	teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the last step within this "+teststep.gConfigTestCase+"(on the last page in the grid).");
		    else
		    	teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the last step within this "+teststep.gConfigTestCase+".");	
		    
	} 
	else
	{
			var temp = teststep.result[i];
			
			teststep.result[i] = teststep.result[i-1];
			
			teststep.result[i-1] = temp;
			
			var arrangedTestStepIDs = new Array();
			
			var test = "";
			
			
			test = teststep.result[i].testStepId+"~"+teststep.result[i-1].testStepSequence
				   +"#"+teststep.result[i-1].testStepId+"~"+teststep.result[i].testStepSequence;
				   
			//To swap the sequence within array
			var tempSequence = teststep.result[i].testStepSequence;
			teststep.result[i].testStepSequence = teststep.result[i-1].testStepSequence;
			teststep.result[i-1].testStepSequence = tempSequence;


			
			/*
			for(var j=0;j< teststep.result.length;j++)
			{	
				arrangedTestStepIDs.push(teststep.result[j].testStepId);
				
				if(test == "")
					test = teststep.result[j].testStepId+"~"+j;
				else
					test += "#"+ teststep.result[j].testStepId+"~"+j;
			}
			*/
			
			var result = ServiceLayer.InsertUpdateData("TestStepSequencing" + "/" + test, null, "TestStep");
			
			if(i==teststep.startIndexA)
				teststep.alertBox("The top "+teststep.gConfigTestStep+" was moved to the previous step(on the previous page in the grid).");
	
	}
	teststep.pagination("swap");
	
	Main.hideLoading();
},

swapDownForTPSeq:function(i)
{
	var actionListName = jP.Lists.setSPObject(teststep.SiteURL,'Action');
	var obj = new Array();
	if(i != teststep.result.length-1)
	{
		obj.push({'ID':teststep.result[i]['ID'],
						  'position':teststep.result[i+1]['position']	
				});
		obj.push({'ID':teststep.result[i+1]['ID'],
						  'position':teststep.result[i]['position']	
				});		
		var result = actionListName.updateItem(obj);
		if(i==teststep.EiForAction-1)
			//teststep.alertBox("The bottom test step was moved to the next step(on the next page in the grid)."); 
			teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the next step(on the next page in the grid)."); 
	}
	else
	{
		var len = teststep.result.length-1;
		obj.push({'ID':teststep.result[i]['ID'],
						  'position':teststep.result[0]['position']	
				});
		obj.push({'ID':teststep.result[0]['ID'],
						  'position':teststep.result[len]['position']	
				});		
		var result = actionListName.updateItem(obj);
		if(teststep.result.length > 5)		
			//teststep.alertBox("The bottom test step was moved to the first step within this test pass(on the first page in the grid).");
			teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the first step within this "+teststep.gConfigTestPass+"(on the first page in the grid).");
		else
			//teststep.alertBox("The bottom test step was moved to the first step within this test pass.");
			teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the first step within this "+teststep.gConfigTestPass+".");
	}
},
swapDown:function(i)
{
	if(teststep.sequenceForTPID[ $("#testPassName").val() ] == "1")
	{
		teststep.swapDownForTPSeq(i);
	}
	else if(i==teststep.result.length-1)
	 {
		 	var temp = teststep.result[i];
		 	
		 	teststep.result[i] = teststep.result[0];
		 	
		    teststep.result[0] = temp;
		    
			var arrangedTestStepIDs = new Array();
			
			var test = "";
			
			test = teststep.result[i].testStepId+"~"+teststep.result[0].testStepSequence
				   +"#"+teststep.result[0].testStepId+"~"+teststep.result[i].testStepSequence;
				   
			//To swap the sequence within array
			var tempSequence = teststep.result[i].testStepSequence;
			teststep.result[i].testStepSequence = teststep.result[0].testStepSequence;
			teststep.result[0].testStepSequence = tempSequence;


			/*
			for(var j=0;j< teststep.result.length;j++)
			{	
				
				arrangedTestStepIDs.push(teststep.result[j]['ID']);
				
				if(test == "")
					test = teststep.result[j].testStepId+"~"+j;
				else
					test += "#"+ teststep.result[j].testStepId+"~"+j;
			}
			*/
			
			var result = ServiceLayer.InsertUpdateData("TestStepSequencing" + "/" + test, null, "TestStep");
				
			if(teststep.result.length > 10)		
				teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the first step within this "+teststep.gConfigTestPass+"(on the first page in the grid).");
			else
				teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the first step within this "+teststep.gConfigTestPass+".");
	 } 
	 else
	 {
		 	var temp = teststep.result[i];
		 	
		 	teststep.result[i] = teststep.result[i+1];
		 	
		    teststep.result[i+1] = temp;
		    
			var arrangedTestStepIDs = new Array();
			
			var test = "";
			
			test = teststep.result[i].testStepId+"~"+teststep.result[i+1].testStepSequence
				   +"#"+teststep.result[i+1].testStepId+"~"+teststep.result[i].testStepSequence;
				   
			//To swap the sequence within array
			var tempSequence = teststep.result[i].testStepSequence;
			teststep.result[i].testStepSequence = teststep.result[i+1].testStepSequence;
			teststep.result[i+1].testStepSequence = tempSequence;


			/*
			for(var j=0;j< teststep.result.length;j++)
			{	
				arrangedTestStepIDs.push(teststep.result[j]['ID']);
				
				if(test == "")
					test = teststep.result[j].testStepId+"~"+j;
				else
					test += "#"+ teststep.result[j].testStepId+"~"+j;
			}
			*/
			
			var result = ServiceLayer.InsertUpdateData("TestStepSequencing" + "/" + test, null, "TestStep");
			
		if(i==teststep.EiForAction-1)
			teststep.alertBox("The bottom "+teststep.gConfigTestStep+" was moved to the next step(on the next page in the grid)."); 
	 }
	 teststep.pagination("swap");
	 Main.hideLoading();
},
deleteTestStep:function(id)
{  
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
	//$( "#divConfirm" ).text('Are you sure want to Delete this Test Step?');
	$( "#divConfirm" ).text('Are you sure you want to Delete this '+teststep.gConfigTestStep+'?');//Added by Mohini for Resource file				
	$( "#divConfirm" ).dialog
	({
         autoOpen: false,
         resizable: false,
         height:140,
         modal: true,
         buttons: 
         {
			"Delete": function() {	
									Main.showLoading();																							
									setTimeout('teststep.delOk('+id+');',100);
									$( this ).dialog( "close" );
									Main.hideLoading();
									},
			"Cancel": function() {
									Main.showLoading();		
									$( this ).dialog( "close" );
									Main.hideLoading();
								 }
		}
	});
		
	$('#divConfirm').dialog("open");
},

/* function added by shilpa */
//delOk:function(id)
//{
//	teststep.delFlag = 1;
//	var listName = jP.Lists.setSPObject(teststep.SiteURL,'Action');	
//	teststep.reArrangeSequenceUsingTestStepsBuffer(id);
//	var res = listName.deleteItem(id);												
	
//	var query = '<Query><Where><Eq><FieldRef Name="TestStep" /><Value Type="Text">'+id+'</Value></Eq></Where><ViewFields><FieldRef Name="TestPassMappingID" /><FieldRef Name="Role" /></ViewFields></Query>';
//	var ChildResult = teststep.dmlOperation(query,'TestCaseToTestStepMapping');										
//	var ChildList =  jP.Lists.setSPObject(teststep.SiteURL,'TestCaseToTestStepMapping');
//	var TestStepRoles = new Array();
//	//Added on 13 April 2012 for Updating status in parent list
//	var TestPassMappingIDsOfDelTestStep = new Array();
//	var StatusForParentID = new Array();
	
//	if(ChildResult != null || ChildResult != undefined)
//	{
//		if(ChildResult.length<=147)
//		{
//			var camlQuery= '<Query><Where>';
//			for(var ii=0;ii<ChildResult.length-1;ii++)
//			{
//				camlQuery+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//				if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//					TestStepRoles.push(ChildResult[ii]['Role']);
//				var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//				TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);
//			}	
//			camlQuery+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//			if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//				TestStepRoles.push(ChildResult[ii]['Role']);
//			var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//			TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);
				
//			for(var ii=0;ii<ChildResult.length-1;ii++)
//				camlQuery+= '</Or>';
//			camlQuery+='</Where><ViewFields><FieldRef Name="TestPassID" /></ViewFields></Query>';
			
//			var TPTCResult = teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping');
//			var testPassesForTestStep = new Array();
//			for(var i=0;i<TPTCResult.length;i++)
//			{
//				if($.inArray(TPTCResult[i]['TestPassID'],testPassesForTestStep) == -1)
//					testPassesForTestStep.push(TPTCResult[i]['TestPassID']);
//			}
//	 	}
//	 	else
//	 	{
//	 		var TPTCResult = new Array();
//	 		var numberOfIterations = Math.ceil((ChildResult.length)/147);
//	 		var iterationPoint = 0;
//	 		var camlQuery;
//	 		var OrEndTags;
//	 		for(var y=0;y<numberOfIterations-1;y++)
//	 		{
//				camlQuery= '<Query><Where>';
//				OrEndTags='';
//				for(var ii=iterationPoint ;ii< (147+iterationPoint-1);ii++)
//				{
//					camlQuery+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//					OrEndTags+='</Or>';
//					if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//						TestStepRoles.push(ChildResult[ii]['Role']);
//					var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//					TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);

//				}
//				camlQuery+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//				camlQuery+=OrEndTags;
//				camlQuery+='</Where></Query>';
//				if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//					TestStepRoles.push(ChildResult[ii]['Role']);
//				var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//				TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);
//				var resultOfQuery= teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping');
//				if(resultOfQuery!= null && resultOfQuery!= undefined)
//					$.merge(TPTCResult,resultOfQuery);
//				iterationPoint += 147;	
//	 		}
//	 		camlQuery= '<Query><Where>';
//			OrEndTags='';
//	 		for(var ii=iterationPoint ;ii<ChildResult.length-1;ii++)
//			{
//				camlQuery+= '<Or><Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//				OrEndTags+='</Or>';
//				if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//					TestStepRoles.push(ChildResult[ii]['Role']);
//				var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//				TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);

//			}
//			camlQuery+= '<Eq><FieldRef Name="ID" /><Value Type="Counter">'+ChildResult[ii]['TestPassMappingID']+'</Value></Eq>';
//			camlQuery+=OrEndTags;
//			camlQuery+='</Where></Query>';
//			if($.inArray(ChildResult[ii]['Role'],TestStepRoles)==-1)
//				TestStepRoles.push(ChildResult[ii]['Role']);
//			var res = ChildList.deleteItem(ChildResult[ii]['ID']);
//			TestPassMappingIDsOfDelTestStep.push(ChildResult[ii]['TestPassMappingID']);
//			$.merge(TPTCResult,teststep.dmlOperation(camlQuery,'TestPassToTestCaseMapping'));
//	 	}			
//	}
//	var testPassesForTestStep = new Array();
//	for(var i=0;i<TPTCResult.length;i++)
//	{
//		if($.inArray(TPTCResult[i]['TestPassID'],testPassesForTestStep) == -1)
//			testPassesForTestStep.push(TPTCResult[i]['TestPassID']);
//	}

//	////////////////////////////// Added by Harshal & Rajiv on 29 Feb 2012 //////////////////////////////////////////////////////////////
//	var CombinationOfTestPassIDAndSPUserIDForPMID = new Array();
//	var CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity = new Array();
//	var CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity = new Array();
//	//Query on Parent List with Test Pass ID(s) to get all the Parent Mapping ID(s) related to these Test Pass(es)
//	//Ankita:8/24/2012 Bulk Data Handling
//	if(testPassesForTestStep.length<=147)
//	{
//		var camlQueryOnParentList= '<Query><Where>';
//		var orendTags='';
//		for(var ii=0;ii<testPassesForTestStep.length-1;ii++)
//		{
//			camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//			orendTags +='</Or>';
//		}
//		camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//		camlQueryOnParentList+= orendTags;
//		camlQueryOnParentList+='</Where></Query>';
//		var ResultInParentList = teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
//	}
//	else
//	{
//		var numberOfIterations= Math.ceil(testPassesForTestStep.length/147);
//		var iterations=0;
//		var camlQueryOnParentList;
//		var orEndTags;
//		var ResultInParentList= new Array();
//		for(var y=0; y<numberOfIterations-1; y++)
//		{
//			camlQueryOnParentList= '<Query><Where>';
//			orEndTags='';
//			for(var ii=iterations; ii<(iterations+147)-1; ii++)
//			{
//				camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//				orEndTags +='</Or>';
//			}
//			camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//			camlQueryOnParentList+=orEndTags;
//			camlQueryOnParentList+='</Where></Query>';
//			var ResultOfQuery= teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
//			if(ResultOfQuery!= null && ResultOfQuery!= undefined)
//				$.merge(ResultInParentList,ResultOfQuery);
//			iterations +=147;
//		}
//		camlQueryOnParentList= '<Query><Where>';
//		orEndTags='';
//		for(var ii=iterations; ii<testPassesForTestStep.length-1; ii++)
//		{
//			camlQueryOnParentList+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//			orEndTags +='</Or>';
//		}
//		camlQueryOnParentList+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//		camlQueryOnParentList+=orEndTags;
//		camlQueryOnParentList+='</Where></Query>';
//		var ResultOfQuery= teststep.dmlOperation(camlQueryOnParentList,'TestPassToTestCaseMapping');
//		if(ResultOfQuery!= null && ResultOfQuery!= undefined)
//			$.merge(ResultInParentList,ResultOfQuery);
//	}
//	//Query on Child List using Parent Maping ID(s)
//	if(ResultInParentList !=null && ResultInParentList!=undefined)
//	{
//		//Ankita: 8/24/2012 Bulk data handling
//		if(ResultInParentList.length<=147)
//		{
//			var camlQueryOnChildList= '<Query><Where>';
//			var orEndTags='';
//			for(var ii=0;ii<ResultInParentList.length-1;ii++)
//			{	camlQueryOnChildList+= '<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//				/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//					CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//				/***************************************************************************************************************************************************************************************/	
//				orEndTags +='</Or>';
//			}
//			camlQueryOnChildList+= '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//			/***********A separate code accomodated here to avoid iterations;code to get all TestPassID and SPUserID combination based on ParentMappingID;by Rajiv and Harshal on 29 feb 2012*******/  
//				CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//			/***************************************************************************************************************************************************************************************/	
//			camlQueryOnChildList+=orEndTags;
//			camlQueryOnChildList+='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
//			var ResultInChildList = teststep.dmlOperation(camlQueryOnChildList,'TestCaseToTestStepMapping');
//		}
//		else
//		{
//			var numberOfIterations = Math.ceil(ResultInParentList.length/147);
//			var iterations=0;
//			var camlQueryOnChildList;
//			var OrendTags;
//			var ResultInChildList= new Array();
//			for(var y=0; y<numberOfIterations-1; y++)
//			{
//				camlQueryOnChildList= '<Query><Where>';
//				OrendTags='';
//				for(var ii=iterations; ii<(iterations+147)-1; ii++)
//				{
//					camlQueryOnChildList+= '<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//					OrendTags +='</Or>';
//					CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//				}
//				camlQueryOnChildList+= '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//				CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//				camlQueryOnChildList+=OrendTags;
//				camlQueryOnChildList+='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
//				var ResultOfQuery= teststep.dmlOperation(camlQueryOnChildList,'TestCaseToTestStepMapping');
//				if(ResultOfQuery!= null && ResultOfQuery!= undefined)
//					$.merge(ResultInChildList,ResultOfQuery);
//				iterations+=147;
//			}
//			camlQueryOnChildList= '<Query><Where>';
//			OrendTags='';
//			for(var ii=iterations; ii<ResultInParentList.length-1; ii++)
//			{
//				camlQueryOnChildList+= '<Or><Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//				OrendTags +='</Or>';
//				CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//			}
		
//			camlQueryOnChildList+= '<Eq><FieldRef Name="TestPassMappingID" /><Value Type="Text">'+ResultInParentList[ii]['ID']+'</Value></Eq>';
//			CombinationOfTestPassIDAndSPUserIDForPMID[ResultInParentList[ii]['ID']] = ResultInParentList[ii]['TestPassID']+"|"+ResultInParentList[ii]['SPUserID'];
//			camlQueryOnChildList+=OrendTags;
//			camlQueryOnChildList+='</Where><ViewFields><FieldRef Name="status" /><FieldRef Name="Role" /><FieldRef Name="TestPassMappingID" /><FieldRef Name="status" /></ViewFields></Query>';
//			var ResultOfQuery= teststep.dmlOperation(camlQueryOnChildList,'TestCaseToTestStepMapping');
//			if(ResultOfQuery!= null && ResultOfQuery!= undefined)
//				$.merge(ResultInChildList,ResultOfQuery);
//		}
//		var testPassToBeDeleted = new Array();
//		var testPassMustNotDeleted = new Array();
//		var rolesInDeletedTestStepMustNotDeleteFromTestPass = new Array();
//		var RolesForTestPassID =new Array();
//		if(ResultInChildList !=null && ResultInChildList!=undefined)
//		{
//			for(var i=0;i<ResultInChildList .length;i++)
//			{
//				if($.inArray(ResultInChildList[i]["Role"],TestStepRoles)!=-1)
//				{
//					CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity.push(CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList [i]["TestPassMappingID"] ] + "|" + ResultInChildList[i]["Role"]);
//					 /******************************** Addition to Algo********************************************************************/
						
//					//To maintain the Roles of deleted Test Step for Test Pass(s) which must not delete from My Activity  
//					if(rolesInDeletedTestStepMustNotDeleteFromTestPass[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] == undefined)
//						rolesInDeletedTestStepMustNotDeleteFromTestPass[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] = ResultInChildList[i]["Role"];
//					else
//					{
//						var rolesInTestPass2 = rolesInDeletedTestStepMustNotDeleteFromTestPass[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ].split(",");
//						if($.inArray(ResultInChildList[i]["Role"],rolesInTestPass2) == -1)
//						{
//							rolesInDeletedTestStepMustNotDeleteFromTestPass[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] += "," + ResultInChildList[i]["Role"];
//						}	
//					}
//				}
//				//Added by Harsahl on 7 March
//				if(RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] == undefined)
//					RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] = ResultInChildList[i]["Role"];//Added by Harshal on 2 March
//				else
//				{
//					var rolesInTestPass = RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ].split(",");
//					if($.inArray(ResultInChildList[i]["Role"],rolesInTestPass) == -1)
//					{
//						RolesForTestPassID[CombinationOfTestPassIDAndSPUserIDForPMID[ ResultInChildList[i]["TestPassMappingID"] ].split("|")[0] ] += "," + ResultInChildList[i]["Role"];
//					}	
//				}
//				//Added by Harshal for updating status of Parent List
//				if($.inArray(ResultInChildList[i]["TestPassMappingID"],TestPassMappingIDsOfDelTestStep) !=-1)
//				{
//					if(StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] == undefined)
//						StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] = ResultInChildList[i]["status"];
//					else
//						StatusForParentID[ ResultInChildList[i]["TestPassMappingID"] ] += "," + ResultInChildList[i]["status"];	
//				}												
//			}
	      
//	        //Added on 7 March
//	        if(rolesInDeletedTestStepMustNotDeleteFromTestPass.length == 0)
//	        {
//	        	var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//	        	var obj = new Array();
//	        	for(var i=0;i<testPassesForTestStep.length;i++)
//	        	{
//	        		var rolesToBeRemained = new Array();
//					var testPassRoles = new Array();
//					if(RolesForTestPassID[ testPassesForTestStep[i] ] != undefined)
//						testPassRoles = RolesForTestPassID[ testPassesForTestStep[i] ].split(",");
					
//					for(var ii=0;ii<testPassRoles.length;ii++)
//					{
//						if($.inArray(testPassRoles[ii],TestStepRoles) == -1)
//							rolesToBeRemained.push(testPassRoles[ii]);	
//					}
//					if(rolesToBeRemained.length!=0)
//					{
//						obj.push({
//						'ID' : testPassesForTestStep[i],
//						'AllRoles' : rolesToBeRemained
//						});
//					}
//					else
//					{
//						obj.push({
//						'ID' : testPassesForTestStep[i],
//						'AllRoles' : -1
//						});
//					}
//					//Rare - It is very rare possibility of one Test Step can have more than 147 roles so bulk data handling code is not applied
//					var ResultInMyActivitytList = new Array();
//					var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');

//					if(TestStepRoles.length <= 147)
//					{
//						var camlQuery= '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
//						for(var ii=0;ii<TestStepRoles.length-1;ii++)
//							camlQuery+= '<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+TestStepRoles[ii]+'</Value></Eq>';
//						camlQuery+= '<Eq><FieldRef Name="RoleID" /><Value Type="Text">'+TestStepRoles[ii]+'</Value></Eq>';
//						for(var ii=0;ii<TestStepRoles.length-1;ii++)
//							camlQuery+= '</Or>';
//						camlQuery+='</And></Where></Query>';
//						ResultInMyActivitytList = teststep.dmlOperation(camlQuery,'MyActivity');
//						if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//						{
//							for(var ii=0;ii<ResultInMyActivitytList.length;ii++)
//							{
//								var res = MyActivityListName.deleteItem(ResultInMyActivitytList[ii]['ID']);
//							}	
//						}
//					}
//					else
//					{
//						//Added by HRW on 6 Sep 2012
//						var iteration= Math.ceil((TestStepRoles.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//						var iterationStartPoint=0;
//						for(var y=0;y<iteration;y++)
//					    {
//						   if(y!=iteration-1)
//						   {
//						 		var q = '';
//								var camlQuery = '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
				          					
//								for(var u=0+iterationStartPoint;u<(147+iterationStartPoint)-1;u++)			 
//								{
//									camlQuery +='<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+TestStepRoles[u]+'</Value></Eq>';
//									q += '</Or>';
//						        }			
//								camlQuery += '<Eq><FieldRef Name="RoleID"/><Value Type="Text">'+TestStepRoles[u]+'</Value></Eq>';
//								if(q != '')
//									camlQuery += q;
//								camlQuery +='</And></Where></Query>';	
								
//								iterationStartPoint+=147;  
//								var Result = teststep.dmlOperation(camlQuery,'MyActivity');
//								if(Result != null && Result != undefined)
//									$.merge(ResultInMyActivitytList,Result);
//						   }
						   
//						    var q = '';
//							var camlQuery = '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
				      					
//							for(var u=iterationStartPoint;u<TestStepRoles.length-1;u++)			 
//							{
//								camlQuery +='<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+TestStepRoles[u]+'</Value></Eq>';
//								q += '</Or>';
//					        }			
//							camlQuery += '<Eq><FieldRef Name="RoleID"/><Value Type="Text">'+TestStepRoles[u]+'</Value></Eq>';
//					        if(q != '')
//								camlQuery += q;
//							camlQuery +='</And></Where></Query>';	
							
//							var Result = teststep.dmlOperation(camlQuery,'MyActivity');
//							if(Result != null && Result != undefined)
//								$.merge(ResultInMyActivitytList,Result);
								
//							if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//							{
//								for(var ii=0;ii<ResultInMyActivitytList.length;ii++)
//								{
//									var res = MyActivityListName.deleteItem(ResultInMyActivitytList[ii]['ID']);
//								}	
//							}	
//						}
//					}	
//				}
//				if(obj.length != 0)
//					var res = TestPassList.updateItem(obj);	
//	        }
//	        else
//	        {
//	        	var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//	        	var obj = new Array();
//	        	for(var i=0;i<testPassesForTestStep.length;i++)
//	        	{
//	        		var rolesShouldNotDelete = new Array(); 
//	        		if(rolesInDeletedTestStepMustNotDeleteFromTestPass[testPassesForTestStep[i]] != undefined)
//	        			rolesShouldNotDelete = rolesInDeletedTestStepMustNotDeleteFromTestPass[testPassesForTestStep[i]].split(",");
//	        		if(rolesShouldNotDelete.length != TestStepRoles.length)
//	        		{
//	        			var rolesShouldDeleteFromTestPass = new Array();
//	        			var rolesShouldRemained = new Array();
//	        			for(var ii=0;ii<TestStepRoles.length;ii++)
//	        			{
//	        				if($.inArray(TestStepRoles[ii],rolesShouldNotDelete) == -1)
//	        					rolesShouldDeleteFromTestPass.push(TestStepRoles[ii]);
//	        			}
//	        			var allRolesInTestPass = new Array();
//	        			if(RolesForTestPassID[testPassesForTestStep[i]] != undefined)
//	        				allRolesInTestPass = RolesForTestPassID[testPassesForTestStep[i]].split(",");
//	        			for(var ii=0;ii<allRolesInTestPass.length;ii++)
//	        			{
//	        				if($.inArray(allRolesInTestPass[ii],rolesShouldDeleteFromTestPass) == -1)
//	        					rolesShouldRemained.push(allRolesInTestPass[ii]);
//	        			}

//	        			if(rolesShouldRemained.length!=0)
//						{
//							obj.push({
//							'ID' : testPassesForTestStep[i],
//							'AllRoles' : rolesShouldRemained
//							});
//						}
//						else
//						{
//							obj.push({
//							'ID' : testPassesForTestStep[i],
//							'AllRoles' : -1
//							});
//						}
//						//Rare - It is very rare possibility of one Test Step can have more than 147 roles so bulk data handling code is not applied
//						var ResultInMyActivitytList = new Array();
//						var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//						if(rolesShouldDeleteFromTestPass.length<=147)
//						{
//							var camlQuery= '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
//							for(var ii=0;ii<rolesShouldDeleteFromTestPass.length-1;ii++)
//								camlQuery+= '<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+rolesShouldDeleteFromTestPass[ii]+'</Value></Eq>';
//							camlQuery+= '<Eq><FieldRef Name="RoleID" /><Value Type="Text">'+rolesShouldDeleteFromTestPass[ii]+'</Value></Eq>';
//							for(var ii=0;ii<rolesShouldDeleteFromTestPass.length-1;ii++)
//								camlQuery+= '</Or>';
//							camlQuery+='</And></Where></Query>';
							
//							ResultInMyActivitytList = teststep.dmlOperation(camlQuery,'MyActivity');
//							if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//							{
//								for(var ii=0;ii<ResultInMyActivitytList.length;ii++)
//								{
//									var res =MyActivityListName.deleteItem(ResultInMyActivitytList[ii]['ID']);
//								}	
//							}
//						}
//						else
//						{
//							//Added by HRW on 6 Sep 2012
//							var iteration= Math.ceil((rolesShouldDeleteFromTestPass.length)/147);//147 is the maximum number of IDs(10 digit ID at the max) accomodated in the query
//							var iterationStartPoint=0;
//							for(var y=0;y<iteration;y++)
//						    {
//							   if(y!=iteration-1)
//							   {
//							 		var q = '';
//									var camlQuery = '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
					          					
//									for(var u=0+iterationStartPoint;u<(147+iterationStartPoint)-1;u++)			 
//									{
//										camlQuery +='<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+rolesShouldDeleteFromTestPass[u]+'</Value></Eq>';
//										q += '</Or>';
//							        }			
					
//									camlQuery += '<Eq><FieldRef Name="RoleID"/><Value Type="Text">'+rolesShouldDeleteFromTestPass[u]+'</Value></Eq>';
									
//									if(q != '')
//										camlQuery += q;
								
//									camlQuery +='</And></Where></Query>';	
									
//									iterationStartPoint+=147;  
//									var Result = teststep.dmlOperation(camlQuery,'MyActivity');
//									if(Result != null && Result != undefined)
//										$.merge(ResultInMyActivitytList,Result);
//							   }
							   
//							    var q = '';
//								var camlQuery = '<Query><Where><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[i]+'</Value></Eq>';
					      					
//								for(var u=iterationStartPoint;u<rolesShouldDeleteFromTestPass.length-1;u++)			 
//								{
//									camlQuery +='<Or><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+rolesShouldDeleteFromTestPass[u]+'</Value></Eq>';
//									q += '</Or>';
//						        }			
					
//								camlQuery += '<Eq><FieldRef Name="RoleID"/><Value Type="Text">'+rolesShouldDeleteFromTestPass[u]+'</Value></Eq>';
								
//						        if(q != '')
//									camlQuery += q;
							
//								camlQuery +='</And></Where></Query>';	
								
//								var Result = teststep.dmlOperation(camlQuery,'MyActivity');
//								if(Result != null && Result != undefined)
//									$.merge(ResultInMyActivitytList,Result);
									
//								if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//								{
//									for(var ii=0;ii<ResultInMyActivitytList.length;ii++)
//									{
//										var res =MyActivityListName.deleteItem(ResultInMyActivitytList[ii]['ID']);
//									}	
//								}	
//							}
//						}	
//					}
//	        	}
//	        	if(obj.length != 0)
//					var res = TestPassList.updateItem(obj);
//			}
//	    }
//		else//There is no other Test Steps in Test Pass(es) added on 1 Mar 2012 by Harshal
//		{
//			var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//			var TestPassList = jP.Lists.setSPObject(teststep.SiteURL,'TestPass');
//			var obj = new Array();
//			if(testPassesForTestStep.length<=147)
//			{
//			    var camlQuery= '<Query><Where>';
//			    var OrEndTags='';
//				for(var ii=0;ii<testPassesForTestStep.length-1;ii++)
//				{
//					camlQuery+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//					OrEndTags +='</Or>';
//					/***********A separate code accomodated here to avoid iterations;*********/
//					obj.push({
//						'ID' : testPassesForTestStep[ii],
//						'AllRoles' : -1
//					});
//					/*************************************************************************/
//				}	
//				camlQuery+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//				/***********A separate code accomodated here to avoid iterations;*********/
//				obj.push({
//					'ID' : testPassesForTestStep[ii],
//					'AllRoles' : -1
//				});
//				/*************************************************************************/

//				camlQuery+= OrEndTags;
//				camlQuery+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//				var ResultInMyActivitytList = teststep.dmlOperation(camlQueryOnParentList,'MyActivity');
//			}
//			else
//			{
//				var numberOfIterations= Math.ceil(testPassesForTestStep.length/147);
//				var iterations=0;
//				var OrEndTags;
//				var ResultInMyActivitytList=new Array();
//				var camlQuery;
//				for(var y=0; y<numberOfIterations-1; y++)
//				{
//					camlQuery= '<Query><Where>';
//					OrEndTags='';
//					for(var i=iterations; i<(iterations+147)-1; i++)
//					{
//						camlQuery+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//						OrEndTags +='</Or>';
//					/***********A separate code accomodated here to avoid iterations;*********/
					
//						obj.push({
//							'ID' : testPassesForTestStep[ii],
//							'AllRoles' : -1
//						});

//					}
//					camlQuery+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
				
//					/***********A separate code accomodated here to avoid iterations;*********/
//					obj.push({
//						'ID' : testPassesForTestStep[ii],
//						'AllRoles' : -1
//					});
//					camlQuery+=OrEndTags;
//					camlQuery+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//					var QueryResult= teststep.dmlOperation(camlQueryOnParentList,'MyActivity')
//					if(QueryResult!=null && QueryResult!= undefined)
//						$.merge(ResultInMyActivitytList,QueryResult);
//					iterations +=147;
//				 }
//				camlQuery= '<Query><Where>';
//				OrEndTags='';
//				for(var i=iterations; i<testPassesForTestStep.length-1; i++)
//				{
//					camlQuery+= '<Or><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
//					OrEndTags +='</Or>';
//					/***********A separate code accomodated here to avoid iterations;*********/
//					obj.push({
//						'ID' : testPassesForTestStep[ii],
//						'AllRoles' : -1
//					});
//				}
//				camlQuery+= '<Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+testPassesForTestStep[ii]+'</Value></Eq>';
			
//				/***********A separate code accomodated here to avoid iterations;*********/
				
//				obj.push({
//					'ID' : testPassesForTestStep[ii],
//					'AllRoles' : -1
//				});
//				camlQuery+=OrEndTags;
//				camlQuery+='</Where><ViewFields><FieldRef Name="ID" /></ViewFields></Query>';
//				var QueryResult= teststep.dmlOperation(camlQueryOnParentList,'MyActivity')
//				if(QueryResult!=null && QueryResult!= undefined)
//					$.merge(ResultInMyActivitytList,QueryResult);
//			}
//			if(ResultInMyActivitytList!=null && ResultInMyActivitytList!=undefined)
//			{
//				for(var i=0;i<ResultInMyActivitytList.length;i++)
//				{
//					var res =MyActivityListName.deleteItem(ResultInMyActivitytList[i]['ID']);
//				}	
//			}
//			if(obj.length!=0)
//				var res = TestPassList.updateItem(obj);
//		}
//	}
	
//	if(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length !=0)
//	{	
//		//Ankita: 8/24/2012 : Bulk data handling
//		var bufferQuery;
//		var OrCount=0;
//		var OneOrForOneDataElement = true; 
//		if(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length<=147)
//		{
//			var queryForMyActivity = '<Query><Where>';	
//			var OrEndTags='';
//			for(var i=0;i<CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length-1;i++)
//            {
//				if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//				{
//					queryForMyActivity += '<Or><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//					bufferQuery ='<Query><Where><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And></Eq></Where></Query>' 
//					OrCount++;
//					OrEndTags +='</Or>';
//				}											
//			}
//			if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//			{	queryForMyActivity += '<And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//				OneOrForOneDataElement = false;
//			}
			
//			queryForMyActivity += OrEndTags;
//			queryForMyActivity += '</Where></Query>';
            
//            if(OneOrForOneDataElement == true &&  OrCount==1)
//            	queryForMyActivity = bufferQuery;
//            if(queryForMyActivity != '<Query><Where></Where></Query>')
//            	var MyActivityResult = teststep.dmlOperation(queryForMyActivity,'MyActivity');
//       }
//       else
//       {
//       		var numberOfIterations= Math.ceil(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length/147);
//       		var iterations=0;
//       		var queryForMyActivity;
//       		var MyActivityResult=new Array();
//       		var OrEndTags;
//       		for(var y=0; y<numberOfIterations-1; y++)
//       		{
//       			queryForMyActivity = '<Query><Where>';
//       			OrEndTags='';
//       			for(var i=iterations; i<(iterations+147)-1; i++)
//       			{
//       				if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//					{
//						queryForMyActivity += '<Or><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//						bufferQuery ='<Query><Where><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And></Eq></Where></Query>' 
//						OrCount++;
//						OrEndTags='</Or>';
//					}	
//       			}
//       			if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//				{	queryForMyActivity += '<And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//					OneOrForOneDataElement = false;
//				}
//				queryForMyActivity += OrEndTags;
//				queryForMyActivity += '</Where></Query>';
            
//            if(OneOrForOneDataElement == true &&  OrCount==1)
//            	queryForMyActivity = bufferQuery;
//            if(queryForMyActivity != '<Query><Where></Where></Query>')
//            {
//            	var QueryResult= teststep.dmlOperation(queryForMyActivity,'MyActivity');
//            	if(QueryResult!= null && QueryResult!= undefined)
//            		$.merge(MyActivityResult,QueryResult);
//            }
//       	 }
//       	queryForMyActivity = '<Query><Where>';
//		OrEndTags='';
//		for(var i=iterations; i<CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity.length-1; i++)
//		{
//			if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//			{
//				queryForMyActivity += '<Or><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//				bufferQuery ='<Query><Where><And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And></Eq></Where></Query>' 
//				OrCount++;
//				OrEndTags='</Or>';
//			}	
//		}
//		if($.inArray(CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i],CombOfTPIdSPUSerIdAndRoleIDMustNotBeDeletedFromMyActivity)==-1)
//		{	queryForMyActivity += '<And><Eq><FieldRef Name="TesterSPUserID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[1]+'</Value></Eq><And><Eq><FieldRef Name="TestPassID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[0]+'</Value></Eq><Eq><FieldRef Name="RoleID" /><Value Type="Text">'+CombOfTPIdSPUSerIdAndRoleIDToBeDeletedFromMyActivity[i].split("|")[2]+'</Value></Eq></And></And>';  
//			OneOrForOneDataElement = false;
//		}
//		queryForMyActivity += OrEndTags;
//		queryForMyActivity += '</Where></Query>';
    
//        if(OneOrForOneDataElement == true &&  OrCount==1)
//        	queryForMyActivity = bufferQuery;
//        if(queryForMyActivity != '<Query><Where></Where></Query>')
//        {
//        	var QueryResult= teststep.dmlOperation(queryForMyActivity,'MyActivity');
//        	if(QueryResult!= null && QueryResult!= undefined)
//        		$.merge(MyActivityResult,QueryResult);
//        }

//       }
//        if(queryForMyActivity != '<Query><Where></Where></Query>')	
//		{

//            if(MyActivityResult !=null && MyActivityResult!=undefined)
//			{
//				var MyActivityListName = jP.Lists.setSPObject(teststep.SiteURL,'MyActivity');
//				for(var aa=0;aa<MyActivityResult.length;aa++)
//				{
//					var res =MyActivityListName.deleteItem(MyActivityResult[aa]['ID']);
//				}
//			} 
//		}	
//	}	
//    //Updating status of Parent List added on 13 April
//    var ParentList = jP.Lists.setSPObject(teststep.SiteURL,'TestPassToTestCaseMapping');
//    var objForParentMapping = new Array();
//	for(var i=0;i<TestPassMappingIDsOfDelTestStep.length;i++)
//	{
//		if(StatusForParentID[TestPassMappingIDsOfDelTestStep[i]] != undefined)
//		{
//			var status = StatusForParentID[TestPassMappingIDsOfDelTestStep[i]].split(",");
//			if($.inArray("Fail",status) != -1)
//			{
//				objForParentMapping.push({
//				'ID' : TestPassMappingIDsOfDelTestStep[i],
//				'status' : 'Fail'
//				});
//			}
//			else if($.inArray("Not Completed",status) != -1)
//			{
//				objForParentMapping.push({
//				'ID' : TestPassMappingIDsOfDelTestStep[i],
//				'status' : 'Not Completed'
//				});
//			}
//			else
//			{
//				objForParentMapping.push({
//				'ID' : TestPassMappingIDsOfDelTestStep[i],
//				'status' : 'Pass'
//				});
//			}
//		}
//		else
//		{
//			objForParentMapping.push({
//				'ID' : TestPassMappingIDsOfDelTestStep[i],
//				'status' : 'Not Completed'
//			});
//		}
//	}
//    if(objForParentMapping.length!=0)
//		var r = ParentList.updateItem(objForParentMapping);

//	//teststep.alertBox("Test Step deleted successfully! ");
//	//teststep.alertBox(teststep.gConfigTestStep+" deleted successfully! ");//Added by Mohini for Resource file
//	Main.AutoHideAlertBox(teststep.gConfigTestStep+" deleted successfully! ");	
//	teststep.clearFields();	
	
//	//Ankita: 7/8/2012 to solve the bug id2267
//	var str = ((teststep.result.length-1)/10).toString();
//	if(str.indexOf(".") == -1 && teststep.startIndexA>0)
//		   teststep.startIndexA-=10;
	
//	teststep.pagination(-1);
					
//	//////////////Logic to updatae/delete master list entry////////////////////////// 
//},

reArrangeSequenceUsingTestStepsBuffer:function(teststepId)
{
	var actionListName = jP.Lists.setSPObject(teststep.SiteURL,'Action');
	var query;
	var obj = new Array();
	var position=-1;
	if(teststep.result!=undefined && teststep.result!=null)
	if(teststep.result[0]["position"]!=undefined && teststep.result[0]["position"]!=null && teststep.result[0]["position"]!='')
	for(var j=0;j< teststep.result.length;j++)
	{	
		if(teststep.result[j]['ID']==teststepId)
        {	
        	position=j;
        	break;
        }
	}
	if(teststep.result!=null && teststep.result!=undefined)
	{
		if(position==0)
		{
			for(var j=1;j< teststep.result.length;j++)
	        {
				obj.push({'ID':teststep.result[j]['ID'],
						  'position':(j-1)	
					});
				var res = actionListName.updateItem(obj);	
			}
		}
		else if(position!=teststep.result.length-1 && position != -1)
		{
			for(var j=position+1;j<teststep.result.length;j++)
	        {
				obj.push({'ID':teststep.result[j]['ID'],
						  'position':(j-1)	
					});
				var res = actionListName.updateItem(obj);	
			}
	    }
	}   
},


/*Function Added by swapnil on 4/16/2013 for bulk deletion*/
delTestSteps:function()
{	   
   var Count=0;
   
   //To check wether the user selected the Test Step or not
   var testStepToDelete = new Array();
	
	$(".chkBoxTS").each(function(){
	
		if( $(this).attr("checked") )
		{
			testStepToDelete.push( $(this).attr("testStepId") );
		}
	
	});
	
	if(testStepToDelete.length == 0)
	{
		teststep.alertBox("Please select the "+teststep.gConfigTestStep+"(s) first.");
		
		Main.hideLoading();
		
		return;
	}
	//End of To check wether the user selected the Test Step or not
   
   if($('#assotestcases').text()=='No Test Case Available')
    {
      Main.hideLoading();
      //teststep.alertBox("No Test Case Available");
      teststep.alertBox("No "+teststep.gConfigTestCase+" Available");//Added by Mohini for Resource file
      return false;
    }
    else
    { 
        Main.hideLoading();
		$("#assotestcases div div li").each(
				function()
				{
		   			if($(this).children(".mslChk").attr('checked') == true)
					{
						Count++;
					}
				});
        
		if(Count==0)
		{  
		  //teststep.alertBox('Please select atleast one TestCase for deletion');
		  teststep.alertBox('Please select atleast one '+teststep.gConfigTestCase+' for deletion');//Added by Mohini for Resource file
		  Main.hideLoading();
		  return false;
		}
		//else if($('#actionSteps').text()=='There are no Test Steps.')
		else if($('#showTestSteps tr').length == 0)
		{ 
		  //teststep.alertBox('There are no Test Steps.');
		  teststep.alertBox('There are no '+teststep.gConfigTestStep+'s.');//Added by Mohini for Resource file
		  Main.hideLoading();
		  return false;
		}
		else if(Count>0)
        {  
			$( "#dialog:ui-dialog" ).dialog( "destroy" );
			//$( "#divConfirm" ).text('Are you sure you want to delete All Test Steps?');	
			$( "#divConfirm" ).text('Are you sure you want to delete all selected '+teststep.gConfigTestStep+'(s)?');//Added by Mohini for Resource file
			$( "#divConfirm" ).dialog
			({
		         autoOpen: false,
		         resizable: false,
		         height:180,
		         modal: true,
		         buttons: {
							"Delete": function(){
													Main.showLoading();
													//var listName = jP.Lists.setSPObject(testcase.SiteURL,'TestCases');						
													//var res = listName.deleteItem(id);
													$( this ).dialog( "close" );
													setTimeout('teststep.delTestStepOk("'+testStepToDelete.join()+'");',100);
													Main.hideLoading();
							                    },
							"Cancel": function(){
													$( this ).dialog( "close" );
													 	 
												}
						  }
			});
			$('#divConfirm').dialog("open");
		}
     }
},
/* function added by shilpa */
/*Function Added by swapnil on 4/16/2013 for bulk deletion*/
delTestStepOk:function(testStepToDelete){
	teststep.delFlag = 1;
	teststep.BulkDelete(testStepToDelete);
	teststep.clearFields();
	//teststep.showTestStep();
	multiSelectList.selectAll("assotestcases");
	teststep.pagination("delete");
	//teststep.alertBox("Test Steps deleted successfully!");
	//teststep.alertBox(teststep.gConfigTestStep+"s deleted successfully!");//Added by Mohini for Resource file
	Main.AutoHideAlertBox(teststep.gConfigTestStep+"s deleted successfully!");
	//window.location.href = window.location.href;
},

sortJSON: function (data, key, way) {
    return data.sort(function (a, b) {
        var x = a[key]==undefined?"":a[key] ; var y = b[key]==undefined?"":b[key];
        if (way === 'asc') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
},


//Code modified for WCF changes |Ejaz Waquif DT:Dec/18/2014 
BulkDelete:function(testStepToDelete)
{
    var count = testStepToDelete.length;
     
	if($("#chkbxSelectAll").attr("checked"))
	{	
		
		testStepToDelete = "";
		$.each( teststep.result ,function(ind,itm){
		
			if(ind == 0)
				testStepToDelete += itm.testStepId;
			else
				testStepToDelete += ","+itm.testStepId;	
		
		});
		
		count = teststep.result.length;
	}
	
	//To update the Total count label |Ejaz Waquif DT:Dec/18/2014
	var len = parseInt($("#labelCount").html()) - count;
	
	var countVal=((len)>=10)?(len):('0'+(len));
	
    $("#labelCount").html(countVal);
	

	var data={
	
		'testStepId':testStepToDelete	
	};
	
	var result = ServiceLayer.DeleteData("DeleteTestStep" + "/" + testStepToDelete, null, "TestStep");
},
/*End*/

/**********Added by Mohini 12-19-2013***********/
alertBox2:function(msg){
	$("#divAlert2").html(msg);
	$('#divAlert2').dialog({
	height: 150,
	modal: true, 
	buttons:
    { 
        "Ok":function() 
		{ 
            if (teststep.noprjFlag == 1)
                window.location.href = Main.getSiteUrl().substr(0, Main.getSiteUrl().lastIndexOf('/') + 1) + 'Dashboard/ProjectMgnt'; //Main.getSiteUrl()+'/SitePages/ProjectMgnt_1.aspx';
            else if (teststep.noTPFlag == 1)
                window.location.href = Main.getSiteUrl().substr(0, Main.getSiteUrl().lastIndexOf('/') + 1) + 'TestPass' + '?pid=' + show.projectId + '&tpid=' + show.testPassId; //+ '/SitePages/TestPassMgnt_1.aspx' + '?pid=' + show.projectId + '&tpid=' + show.testPassId;
            else if (teststep.noTestrFlag == 1)
                window.location.href = Main.getSiteUrl().substr(0, Main.getSiteUrl().lastIndexOf('/') + 1) + 'Tester' + '?pid=' + show.projectId + '&tpid=' + show.testPassId; //+'/SitePages/Tester_1.aspx'+'?pid='+show.projectId+'&tpid='+show.testPassId;
            else if (teststep.noTCFlag == 1)
                window.location.href = Main.getSiteUrl().substr(0, Main.getSiteUrl().lastIndexOf('/') + 1) + 'TestCase' + '?pid=' + show.projectId + '&tpid=' + show.testPassId; //+ '/SitePages/testcase_1.aspx' + '?pid=' + show.projectId + '&tpid=' + show.testPassId;
				
			 $(this).dialog("close");
		},
		"Cancel":function()
		{ 
		    $(this).dialog("close");
		}
	} 
 });
}
}
