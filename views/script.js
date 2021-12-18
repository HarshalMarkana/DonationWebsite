$(document).ready(function()
{
  
  $("#login").click(function()
  {
    
    
    var email=$("#Email").val();
    var psw=$("#Password").val();
    
    if(email==''){
      $('#errormail').html('please enter username');
      forml.Email.focus();
      return false;
    }

    else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    {
      $('#errormail').html('please enter valid email id');
      forml.Email.focus();
      return false;
    }
    
    
    else
    {
      $('#errormail').html('');
    }
    
    
     if(psw==''){
        $('#errorpswd').html('please enter password');
        forml.Password.focus();
        return false;
      }
     
    else
    {
      $('#errorpswd').html('');
    }
    
  
        
  });
    
});
    
  
