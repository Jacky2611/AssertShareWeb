/**All client side js code related to popups and/or their content ios in here.
 * 
 */
function test(){
    console.log("helo");

}

/**Closes a popup by setting it's visibility to hidden.
 * 
 * @param {string} popupID - id of the popup that should be closed.
 */
function closePopup(popupID){
    console.log("closing popup: "+popupID);
    var popup = document.getElementById(popupID);
    popup.style.visibility='hidden';

}


/**Sets the visbility of an popup div to visible. Also makes sure that register and login are never shown at the same time.
 * 
 * @param {string} popupID - id of the div that should be set to visible
 */
function showPopup(popupID){

    //there is no point in having both the login AND the register popups open at the same time
    if(popupID=='popup-login')
        closePopup('popup-register');
    else if(popupID=='popup-register')
        closePopup('popup-login');

    console.log("showing popup: "+popupID);
    var popup = document.getElementById(popupID);
    popup.style.visibility='visible';

}


//REGISTER AND LOGIN POPUPS:

/**
 * Logic for the login and register popups
 */
$(document).ready(function(){
    function updateText(event){
        var input=$(this);
        setTimeout(function(){
        var id = $(event.target).attr("id");
        var val=input.val();
        
/*
        //show gravatar preview
        if(id=="input-login-email"){
            document.getElementById("image-login-avatar").src=get_gravatar(val, 140);
        }else if(id=="input-register-email"){
            document.getElementById("image-register-avatar").src=get_gravatar(val, 140);
        }
*/
        //hide and show labels of input fields
        if(val!="")
          input.parent().addClass("label-placeholder-hidden");
        else
          input.parent().removeClass("label-placeholder-hidden");
      },1)
    }
    $(".label-placeholder input").keydown(updateText);
    $(".label-placeholder input").change(updateText);













    var loginEmail = $("#input-login-email");
    var loginImageAvatar = $("#image-login-avatar");
    
    var registerEmail = $("#input-register-email");
    var registerPassword = $("#input-register-pw1");
    var registerConfirmPassword = $("#input-register-pw2");
    var registerImageAvatar = $("#image-register-avatar");
    
    
    function validatePassword(){
      if(registerPassword.val() != registerConfirmPassword.val()) {
        registerConfirmPassword[0].setCustomValidity("Passwords Don't Match");
      } else {
        registerConfirmPassword[0].setCustomValidity('');
      }
    }
    
    function updateRegisterAvatar(){
        console.log("test")
        registerImageAvatar.attr('src', get_gravatar(registerEmail.val(),140));
    }
    function updateLoginAvatar(){
        loginImageAvatar.attr('src', get_gravatar(loginEmail.val(),140));
    }
    
    registerPassword.change(validatePassword);
    registerConfirmPassword.keyup(validatePassword);
    registerEmail.keyup(updateRegisterAvatar); 
    loginEmail.keyup(updateLoginAvatar);








});

