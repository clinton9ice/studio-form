// noinspection JSUnresolvedFunction,JSCheckFunctionSignatures

$(document).ready(() => {
    function validEmail(email) {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    // Prevent form default behaviour
    (function () {
        $("[form-default]").on("submit", function (p) {
            return $(this).attr("form-default") === 'false' ? p.preventDefault() : "";
        });
    })()

    $("[data-default]").on("click", function (e) {
        $(this).attr("data-default") === "false" ? e.preventDefault() : $(this).attr("data-default", true);
    });


    // Toggle events
    $("[data-toggle]").on("click", function () {
        //    Check for the event to toggle using switch
        let toggleId = $(this).attr("data-toggle");

        switch (toggleId) {
            case "password":
                // Set a default password type
                let passType = "password";
                // Get the password field from the parent
                let passField = $(this).parents(".form-group").find("input");

                // Toggle  if the type attribute is set to password type
                if (passField.attr("type") === "password") {
                    passType = "text";
                    $(this).removeClass("bi-eye-slash-fill");
                    $(this).addClass("bi-eye");
                } else {
                    $(this).addClass("bi-eye-slash-fill");
                    $(this).removeClass("bi-eye")
                }

                passField.attr("type", passType);
                break;

            default:
                break;
        }
    })

    // Check for empty input 
    function empty(input) {
        return input === "" || input === null;
    }

    // Fetch all the input data from a form and send
    function fetchInput(formName, callback) {
        let registerForm = $(formName),
            error = false;

        let input = registerForm.find("[name]");

        let prop = {}


        // Clear errors
        $("form").find("[app-error]").remove();

        input.each(function () {

            let inputType = $(this).attr("app-type"),
                inputVal = $(this).val().trim()

            // Clear error border
            $(this).removeClass("border-danger");
            if (empty(inputVal)) {
                if (inputType === "confirm-password") {
                    return;
                }
                $(this).addClass("border-danger");
                error = true;
                return $(this).parents(".form-group").append(`<div app-error class="text-danger"> Your ${$(this).attr("name")} is empty</div>`);
            } else if (inputType === "number" && inputVal.length < 11) {
                error = true;
                $(this).addClass("border-danger")
                return $($(this)).parents(".form-group").append(`<div app-error class="text-danger"> Your number must be 11 digit long</div>`);

            } else if (inputType === "number" && inputVal.length > 13) {
                error = true;
                $($(this)).addClass("border-danger")
                return $($(this)).parents(".form-group").append(`<div app-error class="text-danger"> Your number must be less than or equals 13</div>`);

            } else if ($(this).attr("type") === "email" && !validEmail(inputVal)) {
                error = true;
                $(this).addClass("border-danger");
                return $(this).parents(".form-group").append(`<div app-error class="text-danger"> Wrong Email format</div>`);
            } else {
                Object.defineProperty(prop, $(this).attr("name"), {
                    value: inputVal.toLowerCase().toString(),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        });

        // Get the total number of form input
        let formLen = $(formName).find("input[required]").length;
        // Get the the total number of data filled
        let propLen = Object.keys(prop).length;

        // Check for confirm password field
        if ($("body").find("input[app-type='confirm-password']").length > 0 && propLen >= formLen) {
            // Check if password and confirm password match
            if (prop.confirm_password !== prop.password && prop.password) {
                error = true;
                $("input[app-type='password']").addClass("border-danger")
                return modal({
                    type: "error",
                    text: "Passwords does not match"
                })
            }

        }

        if (!error) {
            return typeof callback !== "function" ?
                new Error("Callback must be a function") : callback(propLen >= formLen ? prop : "");
        }
    }

    // Configure the ajax request
    // async function sendRequest([url, data, requestType, dataType], fn) {
    //     $.ajax({
    //         type: requestType !== undefined ? requestType : "POST",
    //         url,
    //         data,
    //         dataType: dataType == undefined ? "Json" : dataType,
    //         success: response => fn(null, response),
    //         error: (e, status) => fn(e)
    //     });
    // }

    function register() {
        $("[app-event='register']").on("click", function () {

            fetchInput(".register-form", function (e) {
                if (e) {

                    modal({
                        isLoading: true
                    })

                    setTimeout(() => {

                        modal({
                            isLoading: false,
                            text: "Your data was registered successfully",
                            title: "Success",
                            className: "success"
                        }, () => {
                            $(".register-form").trigger("reset");
                            console.log(e);
                        })
                    }, 1000)
                }
            })
        });
    }

    function login() {
        $("[app-event='login']").on("click", function () {
            fetchInput($(".login-form"), function (e) {
                if (Object.keys(e).length > 0) {

                    modal({
                        isLoading: true
                    });

                    setTimeout(() => {

                        modal({
                            isLoading: false,
                            title: "Data sent Successfully",
                            text: `Your form was sent successfully - Email:  ${e.email}, Password: ${e.password}`,
                            className: "Success"
                        }, () => {
                            $(".login-form").trigger("reset")
                        });
                    }, 3000);

                } else {
                    modal({
                        type: "error",
                        text: "Something went wrong with your form"
                    })
                }
            });
        })
    }

    //Check for the account selection type
    $("[data-selection='account']").on("click", '[data-account]', function (e) {
        let btnId = $(this).attr("data-account");
        switch (btnId) {
            case "custom":
                //Close the account registration option
                $("[data-account-selection]").slideUp(400);
                $("[data-account='custom-account']").slideDown(600);
                break;
            default:
                e.preventDefault();
                break;
        }
    });
    //Reselect from the option
    $("[app-event='select-option']").on("click", () =>{
        //Close the custom account option
        $("[data-account-selection]").slideDown(250);
        $("[data-account='custom-account']").slideUp(500);
    })
    login()
    register();
});