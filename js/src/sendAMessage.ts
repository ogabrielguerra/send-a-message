interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

class UserFeedback{

    private sendButton :HTMLElement|null = document.getElementById("sendButton");
    private sendMessage :HTMLElement|null = document.getElementById("sendingMessage");
    private feedbackMessage :HTMLElement|null = document.getElementById("feedbackMessage");
    private formContainer :HTMLElement|null = document.getElementById("formContainer");

    hideSendButton(){
        if(this.sendButton && this.sendMessage){
            this.sendButton.style.display = 'none';
            this.sendMessage.style.display = 'block';
        }
    }

    statusMessage(message :string){
        if(this.feedbackMessage && this.formContainer){
            this.feedbackMessage.innerHTML = message;
            this.formContainer.style.display='none';
        }
    }
}

class SendAMessage{

    private proceed :boolean = true;
    private inputs :NodeList|null = null;
    private inputsList :any;
    private numInputs :number = 0;
    private userFeedback :UserFeedback = new UserFeedback();
    private idiom :string;

    constructor(url: string, idiom: string='PT'){
        let element = document.getElementById('formContainer');
        this.idiom = idiom;

        if (typeof(element) != 'undefined' && element != null){
            this.inputs = element.querySelectorAll('input, textarea');
            this.inputsList = Array.from(this.inputs);
            this.numInputs = this.inputs.length;
        }else{
            console.log('ERROR: No fields available.');
        }

        this.sendEmailMessage(url, '');
        this.proceed = true;
    }

    exists(element:any) :boolean {
        return (typeof(element) != 'undefined' && element != null)
    }

    highlight(input :HTMLCanvasElement) :void {
        input.classList.add("form-error");
    }

    unsetHighlight(input :HTMLCanvasElement) :void {
        input.classList.remove("form-error")
    }

    textInputHasValue(el :HTMLInputElement) :boolean {
        return (
            this.exists(el)
            && el.type!=='hidden'
            && (el.type==='textarea' || el.type==='text' || el.type==='tel' || el.type==='email')
            && el.value !== ''
        );
    }

    validateInputs() :void {

        if(this.inputs){
            this.inputsList.forEach((item :any)=>{
                if(item.required && !this.textInputHasValue(item)){
                    this.highlight(item);
                    this.proceed = false;
                }else{
                    this.unsetHighlight(item);
                }
            });
        }
    }

    showFeedback(errorOrSuccess :string, message :string){
        if(errorOrSuccess === 'success'){
            //TODO: Implement showFeedback feature.
        }
    }

    buildFormData() :FormData {
        let fd :FormData  = new FormData();
        this.inputsList.forEach((item :any)=>{
            fd.append(item.name, item.value);
        });

        return fd;
    }

    setRequestAndSend(url :string, isUrlEncoded ?:boolean){
        const xhr :XMLHttpRequest = new XMLHttpRequest();
        xhr.open('POST', url);

        if(isUrlEncoded){
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(this.buildFormData());
        return xhr;
    }

    sendEmailMessage(url :string, token :string) {
        if(!this.proceed || !this.exists(url)){
            return false;
        }

        this.validateInputs();

        if(!this.proceed){
            return false;
        }

        this.userFeedback.hideSendButton();

        const xhr = this.setRequestAndSend(url, false);
        const statusMessage = this.userFeedback.statusMessage

        let messageSuccess = 'Mensagem enviada com sucesso!';
        let messageError = 'Houve um erro no envio se sua mensagem. Por favor, utilize um de nossos telefones.';

        if(this.idiom!=='PT'){
            messageSuccess = 'Message sent!';
            messageError = 'An error occurred while trying to send your message. Please use one of our phones.';
        }

        // @ts-ignore
        new Promise<XMLHttpRequest>((resolve) => {
            xhr.onreadystatechange = ()=> resolve(xhr);
        })
            .then(result => {
                (result.status == 200) ? statusMessage(messageSuccess) : statusMessage(messageError);
            })
            .catch(error => console.log('ERROR:', error.message));
    }

}