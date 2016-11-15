"use strict"
var _companydetails =
    {


        _collectformValues: function (_container) {
            if (_container != null && _container != undefined && _container.length > 0) {
                var fname = $('#' + _container[0] + '');
                var Lname = $('#' + _container[1] + '');
                var Email = $('#' + _container[2] + '');
                var Contact = $('#' + _container[3] + '');
                var CompanyName = $('#' + _container[4] + '');
                var CompanyUrl = $('#' + _container[5] + '');
                var Address = $('#' + _container[6] + '');
                var Country = $('#' + _container[7] + ' option:selected');
                var State = $('#' + _container[8] + ' option:selected');
                var Pwd = $('#' + _container[9] + '');
                var TxtmobileNo = $('#' + _container[10] + '');

                var values = {
                    'FirstName': fname.val(),
                    'LastName': Lname.val(),
                    'sClient_Name': CompanyName.val(),
                    'sClient_Address': Address.val(),
                    'sClient_State': State.text(),
                    'sClient_Country': Country.text(),
                    'sClient_ContactNo': Contact.val(),
                    'sClient_Url': CompanyUrl.val(),
                    'sClient_AdminEmailID': Email.val(),
                    'sClientType': "R",
                    'Password': Pwd.val(),
                    'Mobile_Number': TxtmobileNo.val(),
                    'sClientApp_url': _container[11]
                };

               
                var _insert = ServiceLayer.InsertUpdateData('SaveCompanyDetails', values, 'CompanyReg');
                if (_insert == 'Insert Successfully..!!!') {
                    func.resetFormFeilds('form-horizontal');
                    var msg = "<br/>";
                    $("#autoHideAlert").html("Congragulations Company Create Successfully..!! <br/>  Please add more users for better UAT..!!");
                    $('#autoHideAlert').dialog({
                        height: 150, modal: true, buttons: {
                            "Ok":
                                function () {
                                    eval(_companydetails._RedirectToLogin('UserRegistration'));
                                    $(this).dialog("close");

                                }
                        }
                    });
                }
                else {
                    func.AutoHideAlertBox(_insert);
                }


            }
        },
        _RedirectToLogin: function (url) {
            func.redirect(url)
        }

    }