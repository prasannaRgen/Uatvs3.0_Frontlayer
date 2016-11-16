// Write your Javascript code.
/*
Name: site.js
Created: 6-Oct-2016
Author: Atul Sirsode
Description: JS file for Autocomple Textbox for Users and People Picker
*/

//[!] Code for AutoComplete Textbox

var GlobalUsersArray = [];
var DicKeyValArrayforUser = [];
var url = ServiceLayer.serviceURL + '/Dashboard/GetUsers'
var Appurl = ServiceLayer.serviceURL + '/Dashboard/GetUsers?AppUrl=' + window.location.href
var AutoCompleteTextbox =
    {
        GetDataForUsers: function () {
            var data = AutoCompleteTextbox.GetData(ServiceLayer.serviceURL + '/Dashboard/GetUsers?AppUrl=' + window.location.href);
            if (data != undefined && data.length > 0) {
                GlobalUsersArray = data;

                if (GlobalUsersArray.length > 0 && GlobalUsersArray != undefined) {
                    var Len = GlobalUsersArray.length;
                    for (i = 0; i < Len; i++) {
                        DicKeyValArrayforUser[GlobalUsersArray[i].UserId] = [];
                        DicKeyValArrayforUser[GlobalUsersArray[i].UserId].push(GlobalUsersArray[i].UserId);
                        DicKeyValArrayforUser[GlobalUsersArray[i].UserId].push(GlobalUsersArray[i].UserName);
                        DicKeyValArrayforUser[GlobalUsersArray[i].UserId].push(GlobalUsersArray[i].Email);
                    }
                }
            }
        },
        GetData: function (URL) {
            var req = new XMLHttpRequest();
            var resultCollection;
            req.onreadystatechange = function () {
                if (req.readyState == 4) {

                    // Request successful, read the response
                    var resp = req.responseText;

                    if (resp != "" && resp != null && resp != "value")
                        resultCollection = JSON.parse(resp);
                }
            }

            req.open("GET", URL, false);
            req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            req.setRequestHeader("appurl", ServiceLayer.appurl);
            req.send();

            return resultCollection;
        },
        leftNavClick: function (Controller, pageName) {
            var redirect = '';
            if (pageName == "ProjectMgnt") {
                redirect = '/' + Controller + '/' + pageName + '?pid=' + show.projectId;
            }
            else {
                redirect = '/' + Controller + '/' + pageName + '?pid=' + show.projectId + '&tpid=' + show.testPassId;
            }
            window.location.href = redirect;
        },
        downloadAttachment: function (Controller, param) {
            var url = ServiceLayer.serviceURL + '/' + Controller + '/' + param + '&' + ServiceLayer.appurl;
            window.open(url, "_blank");
        },
        _testingPgattchmentdownload: function (param) {
            var url = ServiceLayer.serviceURL + '/TestingPg/GetAttachmentFile' + '/' + param + '&' + ServiceLayer.appurl;
            window.open(url, "_blank");

        },
        _testpassAttachmentForEmail: function (_attdId) {
            var url = ServiceLayer.serviceURL + '/TestPass/GetAttachmentFile?id=' + _attdId + '&appurl=' + ServiceLayer.appurl;
            var req = new XMLHttpRequest();
            var resultCollection;
            req.onreadystatechange = function () {
                if (req.readyState == 4) {

                    // Request successful, read the response
                    var resp = req.responseText;

                    if (resp != "" && resp != null && resp != "value")
                        resultCollection = resp;
                }
            }

            req.open("GET", url, false);
            req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            req.setRequestHeader("appurl", ServiceLayer.appurl);
            req.send();

            return resultCollection;
        },
        
    }



var testArr;

$(function () {

    var txtId = $('#AutoText');
    if (document.readyState == 'interactive') {

        if (func._checkIfUserLoginorNot()) {
            AutoCompleteTextbox.GetDataForUsers();
        }
    }


});





function CallAuto(TxtId, HdnFldId) {



    var TxtBox = $('#' + TxtId + '');
    var HdnFld = $('#' + HdnFldId + '');
    var _inputTxt = TxtBox.val();
    var _filterArray = [];
    if (_inputTxt != '') {
        GlobalUsersArray.forEach(function (item, index) {
            var ValuefromArray = item.UserName;
            ValuefromArray = ValuefromArray.replace(" ", "").toLowerCase().trim();
            if (ValuefromArray.startsWith(_inputTxt.toLowerCase().trim())) {

                _filterArray.push(item);
            }
        });
    }

    var ProcessArray = [];
    ProcessArray = GlobalUsersArray;
    if (_filterArray.length > 0) {
        ProcessArray = _filterArray;
    }


    TxtBox.autocomplete({
        minLength: 1,
        source: function (request, response) {
            response($.map(ProcessArray, function (value, key) {
                return {
                    label: value.UserName,
                    value: value.UserId + '|' + value.Email
                }
            }));

        },
        focus: function (event, ui) {
            TxtBox.val(ui.item.label);
            return false;
        },

        select: function (event, ui) {
            HdnFld.val('');
            HdnFld.val(ui.item.label + '|' + ui.item.value);

            return false;
        }
    })

    TxtBox.keypress(function (evt) {
        if (evt != undefined) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode >= 65 && charCode <= 90 && charCode == 8) || (charCode >= 97 && charCode <= 122)) {
                return true;
            }
            else {
                return false;
            }
        }
    });

}


function CallAutoMultiple(TxtId, HdnFldId) {
    var TxtBox = $('#' + TxtId + '');

    var HdnFld = $('#' + HdnFldId + '');
    var TxtArr = []; var ValArr = [];
    var TempArr = GlobalUsersArray;
    TxtBox.autocomplete({
        minLength: 1,
        source: function (request, response) {
            response($.map(TempArr, function (value, key) {
                return {
                    label: value.UserName,
                    value: value.UserId + '|' + value.Email
                }
            }));

        },
        select: function (event, ui) {



            if ($.inArray(ui.item.value, ValArr) < 0) {
                TxtArr.push(ui.item.label);
                ValArr.push(ui.item.label + '|' + ui.item.value);
            }
            else {
                TxtArr.splice(1, ui.item.label);
                ValArr.splice(1, ui.item.label + '|' + ui.item.value)
            }

            TxtBox.val(TxtArr.join(","));
            HdnFld.val('');

            HdnFld.val(ValArr.join(","));

            return false;
        }
    })

    TxtBox.blur(function () {



    });

    TxtBox.bind("mouseup", function (e) {
        var $input = $(this),
            oldValue = $input.val();

        if (oldValue == "") return;
        setTimeout(function () {
            var newValue = $input.val();

            if (newValue == "") {
                TxtArr = [];
                ValArr = [];
                $input.trigger("cleared");
            }
        }, 1);
    });
}

function split(val) {
    return val.split(/,s*/);
}

function extractLast(term) {
    return split(term).pop();
}


function MultipleStakeholder() {

    var Modal = $('#popup');
    Modal.show();
    Modal.find('input[id*=txtFindBox]').focus();
    $('#txtFindBox').val('');
    _checkedItemsIds = [];
    MultipleStakeHolderItem.addAllItems(GlobalUsersArray);
    MultipleStakeHolderItem.bindCheckboxEvnt();
    MultipleStakeHolderItem.bindSearchNCbtnEvnt();
    HdnModalValue.val('');
    $('#DivmodalInputBox').html('');
    _disableKeypressatDiv();
    MultipleStakeHolderItem._bindEventToOkButton('VersionStakeholder', 'HdnVersionStakeHolder');
    $('#btnOkModal').attr('disabled', true);
    $('#btnAddModel').attr('disabled', true);
}


$(function myfunction() {
    $('.js-modal-close , #btnCancelModal').click(function () { $('#popup').hide(); });
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            $('#popup').hide()
        }
    }
});

var _divModal = $('#DivmodalInputBox');
var HdnModalValue = $('#popup #HdnModalvalue')
var _checkedItemsIds = [];
var MultipleStakeHolderItem =
    {
        addItemsToStakeholderPopUp: function () {

        }
        ,
        addAllItems: function (_inArray) {
            var html = '<table class="table-responsive" style="padding-bottom: 20px; margin-top: 20px;">';
            var Div = $('#DivListUser #DivAllItem ');
            Div.html('');
            var Len = (_inArray != undefined && _inArray != null && _inArray != '') ? _inArray.length : 0;
            var tr = ''; th = '';
            if (Len > 0) {
                th += '<thead style="position: fixed;top:190px;"><tr><th><input type="checkbox"  id="chkSelectAllModal"/></th><th style="width:50px;padding-left:5px;" >UserId</th><th  style="width:150px;padding-left:5px;"> UserName </th><th  style="width:210px;padding-left:5px;"> Email-Id</th></tr></thead>'
                tr += '<tbody>'
                for (var i = 0; i < _inArray.length; i++) {
                    tr += '<tr><td><input onchange="MultipleStakeHolderItem.EnableDisableBtn(this);" type="checkbox"/></td><td style="width:50px;padding-left:5px;" >' + _inArray[i].UserId + '</td><td style="width:150px;padding-left:5px;" >' + _inArray[i].UserName + '</td><td style="width:210px;padding-left:5px;">' + _inArray[i].Email + '</td></tr>'
                }
                tr += '</tbody>'
                html += th + tr;
                html += '</table>'
                Div.append(html);


                if (_checkedItemsIds != null && _checkedItemsIds.length > 0) {
                    Div.find('table>tbody>tr').each(function (ind, itm) {
                        for (var j = 0; j < _checkedItemsIds.length; j++) {

                            var id = $(itm).find('td:eq(1)').text();
                            if (id == _checkedItemsIds[j]) {
                                $(itm).find('td:eq(0)>input[type=checkbox]').attr('checked', true);
                            }


                        }
                    });
                }

            }

        },
        bindSearchNCbtnEvnt: function () {
            $('#btnAddModel').click(function () {
                MultipleStakeHolderItem.AddItemInTxtBox();
            });
            $('#txtFindBox').keyup(function () {
                MultipleStakeHolderItem._SerchInput(this.value);
            });

            $('#txtFindBox').keypress(function (evt) {
                if (evt != undefined) {
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if ((charCode >= 65 && charCode <= 90 && charCode == 8) || (charCode >= 97 && charCode <= 122)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });

            $('#txtFindBox').bind("mouseup", function (e) {
                var $input = $(this),
                    oldValue = $input.val();

                if (oldValue == "") return;
                setTimeout(function () {
                    var newValue = $input.val();

                    if (newValue == "") {
                        MultipleStakeHolderItem.addAllItems(GlobalUsersArray);
                        MultipleStakeHolderItem.bindCheckboxEvnt();
                        // MultipleStakeHolderItem.bindSearchNCbtnEvnt();
                        $input.trigger("cleared");
                        return;

                    }
                }, 1);
            });
            return false;
        },
        bindCheckboxEvnt: function () {

            $('#chkSelectAllModal').change(function () {
                if (this.checked) {
                    $('.table-responsive tbody>tr>td input[type=checkbox]').each(function () { $(this).attr('checked', true) });
                    $('#btnAddModel,#btnOkModal').removeAttr('disabled');
                }
                else {
                    $('.table-responsive tbody>tr>td input[type=checkbox]').each(function () { $(this).attr('checked', false) });
                    $('#btnAddModel,#btnOkModal').attr('disabled', true);
                }
            });
            return false;

        },
        _checkAllchkbox: function () {
            var ischeck = false;
            $('.table-responsive tbody>tr>td input[type=checkbox]').each(function () {
                var chk = $(this).attr('checked');
                var _ids = $(this).parent().parent().find('td:eq(1)').text();
                if (chk) {

                    if ($.inArray(_ids, _checkedItemsIds) == -1) {
                        _checkedItemsIds.push(_ids);
                    }

                    ischeck = true;
                }
                else {
                    if ($.inArray(_ids, _checkedItemsIds) != -1) {
                        if (_checkedItemsIds.length == 1) {
                            _checkedItemsIds.pop(_ids);
                        }
                        else {
                            _checkedItemsIds.splice(1, _ids);
                        }

                    }

                }

            })
            return ischeck;
        },
        _countCheckedItems: function () {
            var count = 0;
            $('.table-responsive tbody>tr>td input[type=checkbox]').each(function () {
                var chk = $(this).attr('checked');
                if (chk) {
                    count++;
                }
            })
            return count;
        },
        EnableDisableBtn: function (obj) {

            if (obj.checked) {
                $('#btnAddModel,#btnOkModal').attr('disabled', false);
            }
            else {

                (!MultipleStakeHolderItem._checkAllchkbox()) ? $('#btnAddModel,#btnOkModal').attr('disabled', true) : '';
            }

            if (!MultipleStakeHolderItem._checkAllchkbox()) {
                $('#chkSelectAllModal').attr('checked', false);
            }

            MultipleStakeHolderItem._removeItemOnUnselect(obj);
            return false;
        },
        AddItemInTxtBox: function () {
            var SpanArray = []; var span = '';
            if (MultipleStakeHolderItem._countCheckedItems() >= 20) {
                Main.AutoHideAlertBox('A project can have maximum 20 Version Stakeholders')
                return false;
            }
            $('.table-responsive tbody>tr>td input[type=checkbox]').each(function () {
                var chkitm = $(this).attr('checked');

                if (chkitm) {
                    var values = $(this).parent().parent();

                    var Hdnval = values.find('td:eq(1)').text() + '|' + values.find('td:eq(2)').text() + '|' + values.find('td:eq(3)').text()


                    /* Testing Purpose*/
                    SpanArray.push('<span contenteditable="true" val="' + Hdnval + '" class="all-copy">' + values.find('td:eq(2)').text() + ';' + '</span>')
                }




            });
            /* Testing Purpose*/
            SpanArray.join(';');
            if (SpanArray.length > 0) {
                for (var i = 0; i < SpanArray.length; i++) {
                    span += SpanArray[i]
                }
            }
            $('#DivmodalInputBox').html('');
            $('#DivmodalInputBox').html(span);
            return false;
        }
        , _removeItemOnUnselect: function (obj) {
            var val = '';
            var values = $(obj).parent().parent();
            val = (obj != undefined) ? values.find('td:eq(1)').text() + '|' + values.find('td:eq(2)').text() + '|' + values.find('td:eq(3)').text() : '';


            var ele = $('#DivmodalInputBox');
            if (ele != undefined && ele.length > 0) {
                ele.find('span').each(function () {

                    var itm = $(this).attr('val');
                    if (val == itm) {
                        $(this).remove();
                    }


                });
            }
        },
        _bindEventToOkButton: function (Txtval, Hdnval) {

            var OkValues = '';
            $('#btnOkModal').click(function () {
                var divele = $('#DivmodalInputBox');
                var btnAdd = $('#btnAddModel').attr('disabled');
                if (divele.html().trim() == '' && !btnAdd) {
                    Main.AutoHideAlertBox('Please add selected User..!!');
                    Main.hideLoading();
                    return false;
                }
                else {
                    if (MultipleStakeHolderItem._countCheckedItems() >= 20) {
                        Main.AutoHideAlertBox('A project can have maximum 20 Version Stakeholders')
                        return false;
                    }
                    OkValues = MultipleStakeHolderItem._getValuesfromDiv();
                }

                if (Txtval != undefined && Hdnval != undefined) {
                    var Txt = $('#' + Txtval + '')
                    var Val = $('#' + Hdnval + '')
                    Txt.val('');
                    Val.val('');
                    var DisplayValue = []; var Valuearry = [];
                    if (OkValues != '') {
                        for (var i = 0; i < OkValues.split(';').length ; i++) {
                            if (OkValues.split(';')[i].trim() != '') {
                                DisplayValue.push(OkValues.split(';')[i].split('|')[1]);
                                var eles = OkValues.split(';')[i].split('|')[1] + '|' + OkValues.split(';')[i].split('|')[0] + '|' + OkValues.split(';')[i].split('|')[2]
                                Valuearry.push(eles);
                            }

                        }
                        Txt.val(DisplayValue.join(';'));
                        Val.val(Valuearry.join(';'));
                    }

                }


                $('#popup').hide();
            });

            return OkValues;
        },
        _getValuesfromDiv: function () {
            var value = '';
            var ele = $('#DivmodalInputBox span');
            for (var i = 0; i < ele.length; i++) {
                value += $(ele[i]).attr('val') + ';';
            }
            return value;
        },
        _SerchInput: function (_inputTxt) {
            var _filterArray = [];
            if (_inputTxt != '') {
                GlobalUsersArray.forEach(function (item, index) {
                    var ValuefromArray = item.UserName;
                    ValuefromArray = ValuefromArray.replace(" ", "").toLowerCase().trim();
                    if (ValuefromArray.startsWith(_inputTxt.toLowerCase().trim())) {

                        _filterArray.push(item);
                    }
                });
            }
            if (_filterArray.length > 0) {
                MultipleStakeHolderItem.addAllItems(_filterArray);
                MultipleStakeHolderItem.bindCheckboxEvnt();


            }
            else {
                MultipleStakeHolderItem.addAllItems(GlobalUsersArray);
                MultipleStakeHolderItem.bindCheckboxEvnt();


            }
            return false;
        }
    }


$(function () {
    _disableKeypressatDiv();
});
function _disableKeypressatDiv() {
    $('.divModalInputStake').keypress(function () { return false; })


}