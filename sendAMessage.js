class UserData {
    constructor(){ this.data = {}; }
    addData(valueKey, value) { this.data[valueKey] = value; }
}

class SendAMessage{
    constructor(){
        this.fields = $(".inputsContainer").find("input,textarea");
        this.numFields = this.fields.length;
        this.proceed = true;
    }

    //Indicates if a field is ok or not
    highlite(field){
        field.css({"border": "1px solid red"});
    }

    unsetHighlite(field){
        field.css({"border": "1px solid #ccc"});
    }

    validateTypeText(elem){
        let isRequired = elem[0].hasAttribute('required');
        if(isRequired && elem.val()==""){
            this.proceed = false;
            console.log("Required field not filled...");
            this.highlite(elem);
        }else {
            if (elem.attr('type') != 'hidden') {
                this.unsetHighlite(elem);
                console.log("Field passed test...");
            }
        }
    }

    //Validate inputs
    validateInputs(){
        console.log("Validating fields");

        $(".errorValidation").hide();

        for(let i=0; i<this.numFields; i++ ){
            console.log("Looping through fields...");
            let elem = $("#"+this.fields[i].id);
            //@TODO Add validation for more types of field
            if(elem.attr('type')=="text"){
                this.validateTypeText(elem);
            }
        }

        if(this.proceed){
            console.log("validateInputs returns TRUE");
            return true;
        }else{
            console.log("validateInputs returns FALSE");
            $(".errorValidation").show("slow");
            return false;
        }
    }

    sendMessage(token){
        console.log("Start trying to send the message...");

        //Only proceed if fields are validated
        if(!this.validateInputs())
            return false;

        //You might generate a token to validate the send
        let aToken = "";
        if(token=="")
            aToken = "emptytokenmeansnothing";

        const url = 'sendMessage.php';
        let userData = new UserData();

        //Get values from form fields and creates the object
        for(let i=0;i<this.numFields;i++){
            let elem = $("#" + this.fields[i].id);
            if(elem.attr('type') != 'hidden' && this.fields[i].id != "")
                userData.addData(this.fields[i].id, elem.val());
        }

        //Converts the object into a json string and send to server
        $.ajax({
            method: "POST",
            url: url,
            data: { token:aToken, userData: JSON.stringify(userData.data)}
        })

            .done(function( msg ) {
                console.log("Mission complete!");
                console.log(msg);
                if(msg==0){
                    console.log("An error occurred...");
                    $(".successFeedback").hide();
                    $(".errorFeedback").show("slow");

                }else if(msg==1){
                    console.log("All right! A new message was sent successfully!");
                    $(".errorFeedback").hide();
                    $(".inputsContainer").hide();
                    $(".successFeedback").show("slow");
                }
            });

    }
}
