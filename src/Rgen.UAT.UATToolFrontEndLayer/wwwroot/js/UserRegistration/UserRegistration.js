"use strict"
var UserRegistration =
    {

        _collectformValues: function (_container) {
            if (_container != null && _container != undefined && _container.length > 0) {
                var FirstName = $('#' + _container[0] + '');
                var LastName = $('#' + _container[1] + '');
                var Email = $('#' + _container[2] + '');
                var Password = $('#' + _container[3] + '');
                var ConfirmPassword = $('#' + _container[4] + '');
                var DOB = $('#' + _container[5] + '');
                var Gender = $('#' + _container[6] + '');
                var MobileNo = $('#' + _container[7] + '');
                var Country = $('#' + _container[8] + ' option:selected');
          
             
            

                var data = {
                    'FirstName': FirstName.val(),
                    'LastName': LastName.val(),
                    'Email': Email.val(),
                    'Password': Password.val(),
                    'ConfirmPassword': ConfirmPassword.val(),
                    'DOB': DOB.val(),
                    'Gender': Gender.val(),
                    'MobileNo': MobileNo.val(),
                    'Country': Country.text()
               
                };

              
                var result = ServiceLayer.InsertUserData("InsertRegisterUser", data, "UserRegistration");
                if (result != '') {    
                    if (result.Success == "Done") {
                        var glblvalOfEmail = result.Email;        
                      
                        func.resetFormFeilds('form-horizontal');
                
                    $("#autoHideAlert").html("Registration successful..!!");
                    $('#autoHideAlert').dialog({
                        height: 150, modal: true, buttons: {
                            "Ok":
                                function () {
                                    eval(func.redirect('Login'));
                                    $(this).dialog("close");

                                }
                        }
                    });
                   
                    }
                    else
                        func.alertBox('Sorry!This Email is already registered.');
                }
                else
                    func.alertBox('Sorry! Something went wrong, please try again!'); 
                
            }
               
            }
        }


    